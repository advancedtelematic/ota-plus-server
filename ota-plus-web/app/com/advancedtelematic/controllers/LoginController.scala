package com.advancedtelematic.controllers

import java.time.Instant
import javax.inject.{Inject, Singleton}

import akka.Done
import akka.actor.ActorSystem
import com.advancedtelematic.api.UnexpectedResponse
import com.advancedtelematic.auth.{AccessToken, AuthPlusConfig, IdToken, LoginAction, OAuthConfig, SessionCodecs,
                                                                                TokenExchange, Tokens, UiAuthAction}
import com.advancedtelematic.auth.oidc.NamespaceProvider
import com.advancedtelematic.libats.messaging.{MessageBus, MessageBusPublisher}
import com.advancedtelematic.libats.messaging_datatype.MessageLike
import play.api.{Configuration, Logger}
import play.api.http.{HeaderNames, MimeTypes}
import play.api.libs.json.{JsResult, JsValue, Json}
import play.api.libs.ws.{WSAuthScheme, WSClient, WSResponse}
import play.api.mvc._
import play.shaded.ahc.org.asynchttpclient.util.HttpConstants.ResponseStatusCodes

import scala.concurrent.Future
import scala.util.{Failure, Success, Try}

final case class LoginData(username: String, password: String)

final case class UserLogin(id: String, timestamp: Instant)

object UserLogin {

  import com.advancedtelematic.libats.codecs.CirceCodecs._

  implicit val MessageLikeInstance = MessageLike[UserLogin](_.id)
}

final case class UnexpectedToken(token: IdToken, msg: String) extends Throwable {
  override def getMessage: String =
    s"Cannot parse namespace from token: '${token.value}', '${msg}'"
}

final case class CallbackError(msg: String) extends Throwable(msg)

class LoginController @Inject()(components: ControllerComponents,
                                conf: Configuration,
                                ws: WSClient,
                                authAction: UiAuthAction,
                                val login: LoginAction)
    extends AbstractController(components) {

  private[this] val log = Logger(this.getClass)

  private[this] val authPlusConfig = AuthPlusConfig(conf).get

  val accountConfirmation: Action[AnyContent] = Action {
    Ok(views.html.accountConfirmation())
  }

  val accountActivated: Action[AnyContent] = Action {
    Ok(views.html.activated())
  }
  def logout: Action[AnyContent] = authAction { implicit req =>
    ws.url(s"${authPlusConfig.uri}/revoke")
      .withAuth(authPlusConfig.clientId, authPlusConfig.clientSecret, WSAuthScheme.BASIC)
      .post(Map("token" -> Seq(req.accessToken.value)))
      .onComplete {
        case Success(response) if response.status == ResponseStatusCodes.OK_200 =>
          log.debug(s"Access token '${req.accessToken.value}' revoked.")

        case Success(response) =>
          log.error(s"Revocation request for token '${req.accessToken.value}' failed with response $response")

        case Failure(t) =>
          log.error(s"Revocation request for token '${req.accessToken.value}' failed.", t)
      }(components.executionContext)
    Redirect(com.advancedtelematic.controllers.routes.LoginController.login()).withNewSession
  }
}

/**
  * Handles just login/authentication
  */
@Singleton
class OAuthOidcController @Inject()(
    conf: Configuration,
    ws: WSClient,
    tokenExchange: TokenExchange,
    namespaceProvider: NamespaceProvider,
    components: ControllerComponents
)(implicit system: ActorSystem)
    extends AbstractController(components) {

  implicit val ec = components.executionContext

  private[this] val oauthConfig = OAuthConfig(conf)

  private[this] val log = Logger(this.getClass)

  lazy val config = system.settings.config

  private[this] val RedirectToLogin = Redirect(com.advancedtelematic.controllers.routes.LoginController.login())

  lazy val messageBus =
    MessageBus.publisher(system, config) match {
      case Right(v) => v
      case Left(error) =>
        log.error("Could not initialize message bus publisher", error)
        MessageBusPublisher.ignore
    }

  val authorizationError: Action[AnyContent] = Action { implicit request =>
    Unauthorized(views.html.authorizationError())
  }

  def authorizationFailed(error: String, errorDescription: String): Result = {
    Redirect(routes.OAuthOidcController.authorizationError()).flashing("authzError" -> error)
  }

  def publishLoginEvent(user: UserId): Future[Done] = {
    messageBus
      .publish(UserLogin(user.id, Instant.now()))
      .map(_ => Done)
  }

  val callback: Action[AnyContent] = Action.async { request =>
    def onAuthzError(errorCode: String): Future[Result] = {
      val result = request
        .getQueryString("error_description")
        .map(authorizationFailed(errorCode, _))
        .getOrElse(Redirect(routes.LoginController.login()))
      Future.successful(result)
    }

    def onAuthzCode(code: String): Future[Result] = {
      val loginResult = for {
        tokens                       <- exchangeCodeForTokens(code)
        newTokens @ Tokens(accessToken, idToken) <- tokenExchange.run(tokens)
        ns = namespaceProvider.apply(newTokens)
        _ <- publishLoginEvent(idToken.claims.userId)
      } yield
        Redirect(com.advancedtelematic.controllers.routes.Application.index()).withSession(
          "namespace"    -> ns.get,
          "id_token"     -> idToken.value,
          "access_token" -> Json.stringify(Json.toJson(accessToken)(SessionCodecs.AccessTokenFormat))
        )
      loginResult.recover {
        case t: UnexpectedResponse =>
          log.debug("Error while exchanging authz code for tokens", t)
          RedirectToLogin
      }
    }

    request.getQueryString("error") match {
      case Some(errorCode) =>
        onAuthzError(errorCode)
      case None =>
        request.getQueryString("code").fold(Future.successful(RedirectToLogin))(onAuthzCode)
    }
  }

  def exchangeCodeForTokens(code: String): Future[Tokens] = {
    def extractTokens(response: WSResponse): Future[Tokens] = {
      val tokenOrError = for {
        json        <- extractPayload(response)
        idToken     <- JsResult.toTry((json \ "id_token").validate[String]).flatMap(IdToken.fromTokenValue)
        accessToken <- JsResult.toTry(json.validate[AccessToken](AccessToken.FromTokenResponseReads))
      } yield Tokens(accessToken, idToken)
      Future.fromTry(tokenOrError)
    }

    val tokenEndpoint = s"https://${oauthConfig.domain}/oauth/token"
    ws.url(tokenEndpoint)
      .withHttpHeaders(HeaderNames.ACCEPT -> MimeTypes.JSON)
      .post(
        Json.obj(
          "client_id"     -> oauthConfig.clientId,
          "client_secret" -> oauthConfig.secret,
          "redirect_uri"  -> oauthConfig.callbackURL,
          "code"          -> code,
          "grant_type"    -> "authorization_code"
        )
      )
      .flatMap(extractTokens)
  }

  private[this] def extractPayload(response: WSResponse): Try[JsValue] =
    if (response.status != ResponseStatusCodes.OK_200) {
      Failure(UnexpectedResponse(response))
    } else {
      Try(response.json)
    }
}
