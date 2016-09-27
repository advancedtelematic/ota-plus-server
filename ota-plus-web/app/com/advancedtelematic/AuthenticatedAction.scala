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

  def invokeBlockOrElse[A](request: Request[A],
                           block: (AuthenticatedRequest[A]) => Future[Result],
                           orelse: (Request[A]) => Future[Result]): Future[Result] = {
    val authenticatedRequest = for {
      idToken             <- request.session.get("id_token").map(IdToken.apply)
      auth0AccessToken    <- request.session.get("access_token").map(Auth0AccessToken.apply)
      authPlusAccessToken <- request.session.get("auth_plus_access_token").map(AuthPlusAccessToken.apply)
      ns                  <- request.session.get("namespace").map(Namespace.apply)
    } yield AuthenticatedRequest(idToken, auth0AccessToken, authPlusAccessToken, ns, request)
    authenticatedRequest.map(block).getOrElse(orelse(request))
  }

  def invokeBlock[A](request: Request[A], block: (AuthenticatedRequest[A]) => Future[Result]): Future[Result] = {
    invokeBlockOrElse[A](
        request,
        block,
        _ => Future.successful(Results.Redirect(com.advancedtelematic.login.routes.LoginController.login())))
  }

}

object AuthenticatedApiAction extends ActionBuilder[AuthenticatedRequest] {

  def invokeBlock[A](request: Request[A], block: (AuthenticatedRequest[A]) => Future[Result]): Future[Result] = {
    AuthenticatedAction
      .invokeBlockOrElse[A](request, block, _ => Future.successful(Results.Forbidden("Not authenticated")))
  }

}
