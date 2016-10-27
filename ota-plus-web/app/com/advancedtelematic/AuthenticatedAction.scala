package com.advancedtelematic

import org.genivi.sota.data.Namespace

import play.api.mvc._
import scala.concurrent.Future

final case class AuthenticatedRequest[A](idToken: IdToken,
                                         auth0AccessToken: Auth0AccessToken,
                                         authPlusAccessToken: AuthPlusAccessToken,
                                         namespace: Namespace,
                                         request: Request[A])
    extends WrappedRequest[A](request)

object AuthenticatedAction extends ActionBuilder[AuthenticatedRequest] {

  def toAuthenticatedRequest[A](request: Request[A]) = for {
      idToken             <- request.session.get("id_token").map(IdToken.apply)
      auth0AccessToken    <- request.session.get("access_token").map(Auth0AccessToken.apply)
      authPlusAccessToken <- request.session.get("auth_plus_access_token").map(AuthPlusAccessToken.apply)
      ns                  <- request.session.get("namespace").map(Namespace.apply)
    } yield AuthenticatedRequest(idToken, auth0AccessToken, authPlusAccessToken, ns, request)

  def invokeBlock[A](request: Request[A], block: (AuthenticatedRequest[A]) => Future[Result]): Future[Result] = {
      AuthenticatedAction.toAuthenticatedRequest(request)
        .map(block)
        .getOrElse(Future.successful(Results.Redirect(com.advancedtelematic.login.routes.LoginController.login())))
  }

}

