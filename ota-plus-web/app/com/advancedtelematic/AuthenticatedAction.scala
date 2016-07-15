package com.advancedtelematic

import play.api.mvc._
import scala.concurrent.Future

final case class IdToken(token: String)     extends AnyVal
final case class AccessToken(token: String) extends AnyVal

final case class AuthenticatedRequest[A](idToken: IdToken, accessToken: AccessToken, request: Request[A])
    extends WrappedRequest[A](request)

object AuthenticatedAction extends ActionBuilder[AuthenticatedRequest] {

  def invokeBlock[A](request: Request[A], block: (AuthenticatedRequest[A]) => Future[Result]): Future[Result] = {
    val authenticatedRequest = for {
      idToken     <- request.session.get("id_token").map(IdToken.apply)
      accessToken <- request.session.get("access_token").map(AccessToken.apply)
    } yield AuthenticatedRequest(idToken, accessToken, request)
    authenticatedRequest
      .map(block)
      .getOrElse(Future.successful(Results.Redirect(com.advancedtelematic.login.routes.LoginController.login())))
  }

}
