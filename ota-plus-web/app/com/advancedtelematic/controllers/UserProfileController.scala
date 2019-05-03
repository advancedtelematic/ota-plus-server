package com.advancedtelematic.controllers

import com.advancedtelematic.api.{ApiClientExec, ApiClientSupport, RemoteApiError}
import com.advancedtelematic.auth.oidc.OidcGateway
import com.advancedtelematic.auth.{AccessTokenBuilder, IdentityAction}
import javax.inject.{Inject, Singleton}
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
                                      authAction: IdentityAction,
                                      accessTokenBuilder: AccessTokenBuilder,
                                      oidcGateway: OidcGateway,
                                      components: ControllerComponents)(implicit exec: ExecutionContext)
    extends AbstractController(components)
    with ApiClientSupport {

  def getUserProfile: Action[AnyContent] = authAction.async { request =>
    val fut = for {
      claims  <- oidcGateway.getUserInfo(request.accessToken)
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
      claims <- oidcGateway.getUserInfo(request.accessToken)
      _      <- auth0Api.changePassword(claims.email)
    } yield Ok(EmptyContent())
  }

  def updateUserProfile(): Action[JsValue] = authAction.async(components.parsers.json) { request =>
    import com.advancedtelematic.JsResultSyntax._
    (request.body \ "name").validate[String].toEither match {
      case Right(newName) =>
        userProfileApi.updateDisplayName(request.idToken.userId, newName).flatMap { _ =>
          oidcGateway.getUserInfo(request.accessToken).map { claims =>
            Ok(
              Json.obj(
                "fullName" -> newName,
                "email"    -> claims.email,
                "picture"  -> claims.picture
              )
            )
          }
        }

      case Left(err) =>
        Future.successful(BadRequest(err))
    }
  }

  def updateBillingInfo(): Action[JsValue] = authAction.async(components.parsers.json) { request =>
    userProfileApi.updateBillingInfo(request.idToken.userId, request.queryString, request.body)
  }

  implicit val featureW: Writes[FeatureName] = Writes.StringWrites.contramap(_.get)

  def getFeatures(): Action[AnyContent] = authAction.async { request =>
    userProfileApi
      .getFeatures(request.namespace)
      .map { features =>
        Ok(Json.toJson(features))
      }
      .recover {
        case RemoteApiError(r, _) if r.header.status == 404 =>
          Ok(Json.toJson(Seq.empty[FeatureName]))
        case RemoteApiError(r, _) => r
      }
  }

  def proxyRequest(path: String): Action[AnyContent] = authAction.async { request =>
    userProfileApi.userProfileRequest(request.idToken.userId, request.method, path)
  }

}
