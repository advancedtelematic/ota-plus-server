package com.advancedtelematic.login

import javax.inject.{Inject, Singleton}

import org.asynchttpclient.uri.Uri
import play.api.http.{HeaderNames, MimeTypes}
import play.api.libs.json.{JsValue, Json}
import play.api.Configuration
import play.api.i18n.{I18nSupport, MessagesApi}
import play.api.libs.ws.WSClient
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Try}

case class LoginData(username: String, password: String)

/**
  * Handles just login/authentication
  */
@Singleton
class LoginController @Inject()(conf: Configuration, val messagesApi: MessagesApi, wSClient: WSClient)(
    implicit context: ExecutionContext)
    extends Controller
    with I18nSupport {

  private val token_key = "access_token"

  private[this] val authPlusHost: Uri = conf.getString("authplus.host").map(Uri.create).get

  val auth0Config = Auth0Config(conf).get

  val login: Action[AnyContent] = Action { implicit req =>
    Ok(views.html.login(auth0Config))
  }

  def logout: Action[AnyContent] = Action { implicit req =>
    Redirect(org.genivi.webserver.controllers.routes.Application.index()).withNewSession
  }

  val closedBeta: Action[AnyContent] = Action {
    Ok(views.html.closedBeta())
  }

  def authorizationFailed(error: String, errorDescription: String): Result = {
    if (errorDescription == "closed.beta") {
      Redirect(routes.LoginController.closedBeta())
    } else {
      Redirect(routes.LoginController.login())
    }
  }

  val callback: Action[AnyContent] = Action.async { request =>
    request.getQueryString("code")
      .map[Future[Result]] { code =>
        // Get the token
        getToken(code).map {
          case (idToken, accessToken) =>
            Redirect(org.genivi.webserver.controllers.routes.Application.index()).withSession(
                "id_token"     -> idToken,
                "access_token" -> accessToken
            )
        }.recover {
          case ex: IllegalStateException => Unauthorized(ex.getMessage)
        }
      }
      .getOrElse {
        val errorAndDescription: Option[(String, String)] = for {
          error       <- request.getQueryString("error")
          description <- request.getQueryString("error_description")
        } yield (error, description)
        Future.successful(
            errorAndDescription.map((authorizationFailed _).tupled).getOrElse(BadRequest(Results.EmptyContent())))
      }
  }

  def getToken(code: String): Future[(String, String)] = {
    val tokenResponse = wSClient
      .url(String.format("https://%s/oauth/token", auth0Config.domain))
      .withHeaders(HeaderNames.ACCEPT -> MimeTypes.JSON)
      .post(
          Json.obj(
              "client_id"     -> auth0Config.clientId,
              "client_secret" -> auth0Config.secret,
              "redirect_uri"  -> auth0Config.callbackURL,
              "code"          -> code,
              "grant_type"    -> "authorization_code"
          )
      )

    tokenResponse.flatMap { response =>
      (for {
        idToken     <- (response.json \ "id_token").asOpt[String]
        accessToken <- (response.json \ "access_token").asOpt[String]
      } yield {
        Future.successful((idToken, accessToken))
      }).getOrElse(Future.failed[(String, String)](new IllegalStateException("Tokens not sent")))
    }
  }

}

case class Auth0Config(secret: String, clientId: String, callbackURL: String, domain: String)
object Auth0Config {
  def apply(configuration: Configuration): Option[Auth0Config] = {
    for {
      clientSecret <- configuration.getString("auth0.clientSecret")
      clientId     <- configuration.getString("auth0.clientId")
      callbackUrl  <- configuration.getString("auth0.callbackURL")
      domain       <- configuration.getString("auth0.domain")
    } yield Auth0Config(clientSecret, clientId, callbackUrl, domain)
  }
}
