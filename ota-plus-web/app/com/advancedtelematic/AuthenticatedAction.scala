package com.advancedtelematic

import cats.data.Xor
import org.genivi.sota.data.Namespace
import play.api.Logger
import play.api.mvc._

import scala.concurrent.Future

final case class AuthenticatedRequest[A](idToken: IdToken,
                                         auth0AccessToken: Auth0AccessToken,
                                         authPlusAccessToken: AuthPlusAccessToken,
                                         namespace: Namespace,
                                         request: Request[A])
    extends WrappedRequest[A](request)

object AuthenticatedAction extends ActionBuilder[AuthenticatedRequest] {
  val log = Logger(this.getClass)

  def toAuthenticatedRequest[A](request: Request[A]): Xor[String, AuthenticatedRequest[A]] =
    for {
      idToken <- Xor
                  .fromOption(request.session.get("id_token"), "No id_token in session")
                  .flatMap(IdToken.fromTokenValue)
      auth0AccessToken <- Xor.fromOption(
                           request.session.get("access_token").map(Auth0AccessToken.apply),
                           "No access_token in session")
      authPlusAccessToken <- Xor.fromOption(
                              request.session.get("auth_plus_access_token").map(AuthPlusAccessToken.apply),
                              "No Auth+ token in session")
      ns <- Xor.fromOption(request.session.get("namespace").map(Namespace.apply), "No namespace in session")
    } yield AuthenticatedRequest(idToken, auth0AccessToken, authPlusAccessToken, ns, request)

  def invokeBlock[A](request: Request[A], block: (AuthenticatedRequest[A]) => Future[Result]): Future[Result] = {
    AuthenticatedAction.toAuthenticatedRequest(request) match {
      case Xor.Right(x) => block(x)
      case Xor.Left(x) =>
        log.debug(s"Invalid session: $x")
        Future.successful(Results.Redirect(com.advancedtelematic.login.routes.LoginController.login()))
    }
  }

}
