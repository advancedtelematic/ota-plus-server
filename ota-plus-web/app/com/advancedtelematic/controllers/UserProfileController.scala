package com.advancedtelematic.controllers

import cats.syntax.show._
import com.advancedtelematic.api.{ApiClientExec, ApiClientSupport, RemoteApiError}
import javax.inject.{Inject, Singleton}

import com.advancedtelematic.auth.{AccessToken, ApiAuthAction, AuthenticatedAction}
import org.genivi.sota.data.Uuid
import play.api.Configuration
import play.api.libs.functional.syntax._
import play.api.libs.json._
import play.api.libs.ws.WSClient
import play.api.mvc.Results.EmptyContent
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}

final case class UserId(id: String) extends AnyVal

@Singleton
class UserProfileController @Inject()(val conf: Configuration,
                                      val ws: WSClient,
                                      val clientExec: ApiClientExec,
                                      authAction: ApiAuthAction,
                                      components: ControllerComponents)(implicit exec: ExecutionContext)
    extends AbstractController(components)
    with ApiClientSupport {

  def getUserProfile: Action[AnyContent] = authAction.async { request =>
    val claims = request.idToken.claims
    val fut = for {
      profile <- userProfileApi.getUser(claims.userId)
    } yield {
      val displayName = ((profile \ "displayName").validateOpt[String] match {
        case JsSuccess(maybeName, _) =>
          maybeName
        case JsError(_) =>
          None
      }).getOrElse(claims.name)

      Ok(
        Json.obj(
          "fullName" -> displayName,
          "email"    -> claims.email,
          "picture"  -> claims.picture,
          "profile"  -> profile
        )
      )
    }

    fut.recover {
      case e: RemoteApiError =>
        e.result.header.status match {
          case Unauthorized.header.status => Forbidden.sendEntity(e.result.body)
          case _                          => e.result
        }
    }
  }

  val changePassword: Action[AnyContent] = authAction.async { request =>
    for {
      _ <- auth0Api.changePassword(request.idToken.claims.email)
    } yield Ok(EmptyContent())
  }

  def updateUserProfile(): Action[JsValue] = authAction.async(components.parsers.json) { request =>
    import com.advancedtelematic.JsResultSyntax._
    (request.body \ "name").validate[String].toEither match {
      case Right(newName) =>
        userProfileApi.updateDisplayName(request.idToken.claims.userId, newName).map { _ =>
          val claims = request.idToken.claims
          Ok(
            Json.obj(
              "fullName" -> newName,
              "email"    -> claims.email,
              "picture"  -> claims.picture
            )
          )
        }

      case Left(err) =>
        Future.successful(BadRequest(err))
    }
  }

  def updateBillingInfo(): Action[JsValue] = authAction.async(components.parsers.json) { request =>
    userProfileApi.updateBillingInfo(request.idToken.claims.userId, request.queryString, request.body)
  }

  implicit val featureW: Writes[FeatureName] = Writes.StringWrites.contramap(_.get)

  def getFeatures(): Action[AnyContent] = authAction.async { request =>
    val userId = request.idToken.claims.userId
    userProfileApi
      .getFeatures(userId)
      .map { features =>
        Ok(Json.toJson(features))
      }
      .recover {
        case RemoteApiError(r, _) if (r.header.status == 404) =>
          Ok(Json.toJson(Seq.empty[FeatureName]))
        case RemoteApiError(r, _) => r
      }
  }

  val apiDomain = conf.get[String]("api.domain")

  def activateFeature(feature: FeatureName): Action[AnyContent] = authAction.async { request =>
    val userId = request.idToken.claims.userId
    val token  = request.accessToken

    def activateFeatureWithClientId =
      for {
        clientInfo <- authPlusApi.createClientForUser(feature.get,
                                                      s"namespace.${request.namespace.get} $apiDomain/${feature.get}",
                                                      token)
        clientId = Uuid.fromJava(clientInfo.clientId)
        result <- userProfileApi.activateFeature(userId, feature, clientId)
      } yield result

    userProfileApi
      .getFeature(userId, feature)
      .map { r =>
        r.client_id
      }
      .recover { case RemoteApiError(r, _) if (r.header.status == 404) => None }
      .flatMap { client_id =>
        client_id match {
          case Some(id) => Future.successful(Ok(EmptyContent()))
          case None     => activateFeatureWithClientId
        }
      }
  }

  def getFeatureClient(feature: FeatureName): Action[AnyContent] = authAction.async { request =>
    val userId = request.idToken.claims.userId
    val token  = request.accessToken

    userProfileApi.getFeature(userId, feature).flatMap { f =>
      f.client_id match {
        case Some(id) => authPlusApi.getClient(id, token)
        case None     => Future.successful(NotFound)
      }
    }
  }

  def getFeatureConfig(feature: FeatureName): Action[AnyContent] = authAction.async { request =>
    getFeatureConfig(feature, request.idToken.claims.userId, request.accessToken)
  }

}
