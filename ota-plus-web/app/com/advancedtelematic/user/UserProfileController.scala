package com.advancedtelematic.user

import javax.inject.{Inject, Singleton}

import cats.data.Xor
import com.advancedtelematic.jws.CompactSerialization
import com.advancedtelematic.{AccessToken, AuthenticatedAction, IdToken}
import com.advancedtelematic.login.Auth0Config
import org.asynchttpclient.util.HttpConstants.ResponseStatusCodes
import play.api.{Configuration, Logger}
import play.api.libs.json._
import play.api.libs.functional.syntax._
import play.api.libs.ws.WSClient
import play.api.mvc.Results.EmptyContent
import play.api.mvc.{Action, AnyContent, BodyParsers, Controller}

import scala.concurrent.{ExecutionContext, Future}

final case class UserProfile(fullName: String, email: String, picture: String)

final case class UserId(id: String) extends AnyVal

object UserProfile {

  val FromUserInfoReads: Reads[UserProfile] =
    (((__ \ "user_metadata" \ "name").read[String] | (__ \ "name").read[String]) and
          (__ \ "email").read[String] and
          (__ \ "picture").read[String])(UserProfile.apply _)

  implicit val FormatInstance: Format[UserProfile] = Json.format[UserProfile]
}

@Singleton
class UserProfileController @Inject()(conf: Configuration, wsClient: WSClient)(implicit exec: ExecutionContext)
    extends Controller {

  implicit class JsResultOps[T](res: JsResult[T]) {

    def toXor: String Xor T =
      res.fold(err => Xor.left[String, T](Json.stringify(JsError.toJson(err))), Xor.Right.apply)

  }

  private[this] val log = Logger(this.getClass)

  private[this] val auth0Config = Auth0Config(conf).get

  private[this] val ManagementAccessToken = conf.getString("auth0.userUpdateToken").get

  def getUserProfile: Action[AnyContent] = AuthenticatedAction.async { request =>
    val userProfile: Future[UserProfile] =
      getUser(request.accessToken).map(UserProfile.FromUserInfoReads.reads).flatMap[UserProfile] {
        case JsSuccess(profile, _) =>
          Future.successful(profile)
        case JsError(errors) =>
          Future.failed(new Throwable(errors.toString()))
      }
    userProfile.map(x => Ok(Json.toJson(x)))
  }

  private[this] def userIdFromToken(idToken: IdToken): String Xor UserId = {
    for {
      cs    <- CompactSerialization.parse(idToken.token)
      idStr <- (Json.parse(cs.encodedPayload.stringData()) \ "sub").validate[String].toXor
    } yield UserId(idStr)
  }

  def updateUserProfile: Action[JsValue] = AuthenticatedAction.async(BodyParsers.parse.json) { request =>
    val errorOrRequest = for {
      newName <- (request.body \ "name").validate[String].toXor
      userId  <- userIdFromToken(request.idToken)
    } yield
      wsClient
        .url(s"https://${auth0Config.domain}/api/v2/users/${userId.id}")
        .withHeaders("Authorization"       -> s"Bearer $ManagementAccessToken")
        .withBody(Json.obj("user_metadata" -> Json.obj("name" -> newName)))
        .withMethod("PATCH")

    errorOrRequest match {
      case Xor.Right(req) =>
        req.execute() map { response =>
          if (response.status == ResponseStatusCodes.OK_200) {
            Ok(Json.toJson(response.json.as(UserProfile.FromUserInfoReads)))
          } else {
            log.error(
                s"Unable to update user profile. Auth0 responded with '${response.status} ${response.statusText}'")
            InternalServerError(EmptyContent())
          }
        }

      case Xor.Left(err) =>
        Future.successful(BadRequest(err))
    }
  }

  private[this] def getUser(accessToken: AccessToken): Future[JsValue] = {
    val userResponse = wsClient
      .url(String.format("https://%s/userinfo", auth0Config.domain))
      .withQueryString("access_token" -> accessToken.token)
      .get()

    userResponse.flatMap(response => Future.successful(response.json))
  }
}
