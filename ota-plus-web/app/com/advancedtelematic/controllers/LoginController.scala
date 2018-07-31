package com.advancedtelematic.controllers

import java.time.Instant

import akka.Done
import akka.actor.ActorSystem
import com.advancedtelematic.PlayMessageBusPublisher
import com.advancedtelematic.api.UnexpectedResponse
import com.advancedtelematic.auth.{AccessToken, IdentityClaims, IdToken, LoginAction, LogoutAction,
  OAuthConfig, SessionCodecs, TokenExchange, Tokens, UiAuthAction}
import com.advancedtelematic.auth.oidc.{NamespaceProvider, OidcGateway}
import com.advancedtelematic.libats.messaging_datatype.MessageLike
import javax.inject.{Inject, Singleton}
import play.api.{Configuration, Logger}
import play.api.libs.json.Json
import play.api.libs.ws.WSClient
import play.api.mvc._

import scala.concurrent.Future

final case class LoginData(username: String, password: String)

final case class UserLogin(id: String, identity: Option[IdentityClaims], timestamp: Instant)

object UserLogin {

  import com.advancedtelematic.libats.codecs.CirceCodecs._
  private[this] implicit val UserLoginEncoder = io.circe.generic.semiauto.deriveEncoder[IdentityClaims]
  private[this] implicit val UserLoginDecoder = io.circe.generic.semiauto.deriveDecoder[IdentityClaims]

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
                                val login: LoginAction,
                                val logout: LogoutAction)
    extends AbstractController(components) {

  val accountConfirmation: Action[AnyContent] = Action {
    Ok(views.html.accountConfirmation())
  }

  val accountActivated: Action[AnyContent] = Action {
    Ok(views.html.activated())
  }
}

/**
  * Handles just login/authentication
  */
@Singleton
class OAuthOidcController @Inject()(
    oidcGateway: OidcGateway,
    messageBus: PlayMessageBusPublisher,
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

  val authorizationError: Action[AnyContent] = Action { implicit request =>
    Unauthorized(views.html.authorizationError())
  }

  def authorizationFailed(error: String, errorDescription: String): Result = {
    Redirect(routes.OAuthOidcController.authorizationError()).flashing("authzError" -> error)
  }

  def publishLoginEvent(accessToken: AccessToken): Future[Done] = {
    oidcGateway.getUserInfo(accessToken).flatMap { x =>
      messageBus
        .publish(UserLogin(x.userId.id, Some(x), Instant.now()))
        .map(_ => Done)
    }
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
        tokens                                   <- oidcGateway.exchangeCodeForTokens(code)
        newTokens @ Tokens(accessToken, idToken) <- tokenExchange.run(tokens)
        ns = namespaceProvider.apply(newTokens)
        _ <- publishLoginEvent(accessToken)
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

}
