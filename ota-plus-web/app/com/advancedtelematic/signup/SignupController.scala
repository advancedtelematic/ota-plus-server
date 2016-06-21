package com.advancedtelematic.signup

import javax.crypto.SecretKey
import javax.crypto.spec.SecretKeySpec
import javax.inject.Inject

import cats.data.Xor
import com.advancedtelematic.jwa.`HMAC SHA-256`
import com.advancedtelematic.jws.{CompactSerialization, JwsVerifier, KeyLookup}
import io.circe.Decoder
import org.apache.commons.codec.binary.Base64
import org.asynchttpclient.uri.Uri
import org.asynchttpclient.util.HttpConstants.ResponseStatusCodes
import play.api.{Configuration, Logger}
import play.api.mvc.{Action, Controller, Result}
import play.api.data._
import play.api.data.Forms._
import play.api.i18n.{I18nSupport, MessagesApi}
import play.api.libs.json.{JsObject, JsString, JsValue, Json}
import play.api.libs.ws.WSClient

import scala.concurrent.{ExecutionContext, Future}

final case class SetPasswordData(password: String, passwordConfirmation: String)

final case class Invitation(fullName: String, email: String, phoneNumber: String)

object Invitation {

  implicit val DecoderInstance: Decoder[Invitation] = Decoder.instance { c =>
    for {
      fullName    <- c.downField("name").as[String]
      email       <- c.downField("email").as[String]
      phoneNumber <- c.downField("phone_number").as[String]
    } yield Invitation(fullName, email, phoneNumber)
  }

}

class SignupController @Inject() (conf: Configuration,
                                  val messagesApi: MessagesApi,
                                  wSClient: WSClient)(implicit context: ExecutionContext) extends Controller
    with I18nSupport {

  private[this] val verifySignature: CompactSerialization => Boolean = {
    import com.advancedtelematic.json.signature.JcaSupport._
    conf.getString("signup.secret").map { x =>
      val key: SecretKey = new SecretKeySpec( Base64.decodeBase64(x), "HMAC")
      JwsVerifier().algorithmAndKeys(`HMAC SHA-256`, KeyLookup.const(key)).verifySignature _
    }.get
  }

  private[this] val authPlusHost: Uri = conf.getString("authplus.host").map(Uri.create).get
  private[this] val usersPath: String = conf.getString("authplus.usersPath").get

  val logger = Logger(this.getClass)

  private[this] def decodeInvitation(token: String): String Xor Invitation = {
    import com.advancedtelematic.json.signature.JcaSupport._
    import io.circe.parser._
    import cats.syntax.xor._

    for {
      serialized <- CompactSerialization.parse(token)
      _          <- serialized.right[String].ensure("Signature verification failed")(verifySignature)
      invite     <- decode[Invitation](serialized.encodedPayload.stringData()).leftMap( _.getMessage )
    } yield invite
  }

  private[this] def buildRegistationRequest(invitation: Invitation, password: String): JsValue =
    Json.obj(
      "email" -> invitation.email,
      "password" -> password,
      "name" -> invitation.fullName,
      "phone_number" -> invitation.phoneNumber
    )

  private[this] def registerUser(invitation: Invitation, password: String): Future[Result] = {
    import ResponseStatusCodes._
    wSClient.url(authPlusHost.toUrl + usersPath)
        .withMethod("POST")
        .withBody( buildRegistationRequest(invitation, password) )
        .execute().map { response =>
      response.status match {
        case CREATED =>
          Redirect(org.genivi.webserver.controllers.routes.Application.index())

        case UNPROCESSABLE_ENTITY =>
          BadRequest(views.html.signupError("signup.duplicateEmail", invitation.email))

        case code =>
          logger.debug(s"Unexpected response from Auth+: $code")
          ServiceUnavailable(views.html.serviceUnavailable())
      }
    }
  }

  val setPasswordForm = Form(
    mapping(
      "password" -> nonEmptyText,
      "repeatpassword" -> nonEmptyText
    )(SetPasswordData.apply)(SetPasswordData.unapply)
        .verifying("Passwords do not match", pd => pd.password == pd.passwordConfirmation)
  )


  // scalastyle:off
  def checkInvitation(token: String) = Action { implicit request =>
    decodeInvitation(token) match {
      case Xor.Left(err) =>
        logger.debug( s"Failed to decode invitation '$token', reason:  $err" )
        BadRequest(views.html.signupError("signup.closedBeta"))

      case Xor.Right(invitation) =>
        Ok(views.html.signupinvitation(setPasswordForm, invitation, token))
    }
  }

  def setPassword(token: String) = Action.async { implicit request =>
    val resultFuture = decodeInvitation(token) match {
      case Xor.Left(err) =>
        logger.debug(s"Invalid token in form: '$token'")
        Future.successful( BadRequest )

      case Xor.Right(invitation) =>
        setPasswordForm.bindFromRequest().fold(
          formWithErrors => {
            Future.successful( BadRequest(views.html.signupinvitation(formWithErrors, invitation, token)) )
          },
          x => registerUser(invitation, x.password)
        )
    }

    // remove session information so that the user has to log in again
    resultFuture.map(_.withNewSession)
  }
  // sclastyle:on
}
