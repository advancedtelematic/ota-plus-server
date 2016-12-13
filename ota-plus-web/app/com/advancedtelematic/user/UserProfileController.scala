package com.advancedtelematic.user

import cats.data.Xor
import cats.syntax.show._
import com.advancedtelematic.AuthenticatedAction
import com.advancedtelematic.api.{ApiClientExec, ApiClientSupport, RemoteApiError}
import javax.inject.{Inject, Singleton}
import org.genivi.sota.data.Uuid
import play.api.Configuration
import play.api.libs.functional.syntax._
import play.api.libs.json._
import play.api.libs.ws.WSClient
import play.api.mvc.Results.EmptyContent
import play.api.mvc.{Action, AnyContent, BodyParsers, Controller}
import scala.concurrent.{ExecutionContext, Future}


final case class UserProfile(fullName: String, email: String, picture: String, scope: Option[String])

final case class UserId(id: String) extends AnyVal

object UserProfile {

  val FromUserInfoReads: Reads[UserProfile] =
    (((__ \ "user_metadata" \ "name").read[String] | (__ \ "name").read[String]) and
      (__ \ "email").read[String] and
      (__ \ "picture").read[String] and
      ((__ \ "user_metadata" \ "scope_beta").readNullable[String] |
        Reads.pure(Option.empty[String])))(UserProfile.apply _)

  implicit val FormatInstance: Format[UserProfile] = Json.format[UserProfile]
}

@Singleton
class UserProfileController @Inject()(val conf: Configuration, val ws: WSClient, val clientExec: ApiClientExec)(
    implicit exec: ExecutionContext)
    extends Controller
    with ApiClientSupport {

  import com.advancedtelematic.JsResultSyntax._
  import org.genivi.webserver.controllers.FeatureName

  def getUserProfile: Action[AnyContent] = AuthenticatedAction.async { request =>
    auth0Api.queryUserProfile(request.auth0AccessToken).map(x => Ok(Json.toJson(x))).recover {
      case e: RemoteApiError => e.result.header.status match {
        case Unauthorized.header.status => Forbidden.sendEntity(e.result.body)
        case _ => e.result
      }
    }
  }

  val changePassword: Action[AnyContent] = AuthenticatedAction.async { request =>
    for {
      _     <- auth0Api.changePassword(request.idToken.email)
    } yield Ok(EmptyContent())
  }

  def updateUserProfile(): Action[JsValue] = AuthenticatedAction.async(BodyParsers.parse.json) { request =>
    (request.body \ "name").validate[String].toXor match {
      case Xor.Right(newName) =>
        auth0Api.saveUserMetadata(request.idToken, "name", JsString(newName)).map { userInfo =>
          Ok(Json.toJson(userInfo))
        }

      case Xor.Left(err) =>
        Future.successful(BadRequest(err))
    }
  }

  implicit val featureW: Writes[FeatureName] = Writes.StringWrites.contramap(_.get)

  def getFeatures(): Action[AnyContent] = AuthenticatedAction.async { request =>
    val userId = request.idToken.userId
    userProfileApi.getFeatures(userId)
      .map { features => Ok(Json.toJson(features)) }
      .recover {
        case RemoteApiError(r, _) if (r.header.status == 404) =>
          Ok(Json.toJson(Seq.empty[FeatureName]))
        case RemoteApiError(r, _) => r
      }
  }

  def activateFeature(feature: FeatureName): Action[AnyContent] = AuthenticatedAction.async { request =>
    val userId = request.idToken.userId
    val token = request.authPlusAccessToken

    for {
      clientInfo <- authPlusApi.createClientForUser(feature.get, "", token)
      clientId = Uuid.fromJava(clientInfo.clientId)
      _ <- userProfileApi.activateFeature(userId, feature, clientId)
    } yield Ok(EmptyContent())
  }

  def getConfig(feature: FeatureName): Action[AnyContent] = AuthenticatedAction.async { request =>
    val userId = request.idToken.userId
    val token = request.authPlusAccessToken
    val authPlus = conf.getString("authplus.host")
    val treehub = conf.getString("treehub.host")

    def authConfig(client: Uuid, secret: String) = Json.obj("oauth2" -> Json.obj(
      "server" -> authPlus,
      "client_id" -> client.show,
      "client_secret" -> secret
    ))

    val featureConfig = feature match {
      case FeatureName("treehub") => Json.obj("treehub" -> Json.obj("server" -> treehub))
      case FeatureName(x) => Json.obj(x -> Json.obj())
    }

    val action = userProfileApi.getFeature(userId, feature).flatMap { f =>
      f.client_id match {
        case Some(id) => for {
          secret <- authPlusApi.fetchSecret(id.toJava, token)
          _ <- userProfileApi.activateFeature(userId, feature, id)
        } yield authConfig(id, secret)
        case None => Future.successful(Json.obj())
      }
    }

    action.map(r => Ok(r ++ featureConfig))
  }

}
