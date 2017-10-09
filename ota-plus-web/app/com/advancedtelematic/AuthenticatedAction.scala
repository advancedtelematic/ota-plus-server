package com.advancedtelematic

import javax.inject.Inject

import cats.syntax.either._
import org.genivi.sota.data.Namespace
import play.api.Logger
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}

final case class AuthenticatedRequest[A](idToken: IdToken,
                                         auth0AccessToken: Auth0AccessToken,
                                         authPlusAccessToken: AuthPlusAccessToken,
                                         namespace: Namespace,
                                         request: Request[A])
    extends WrappedRequest[A](request)

object AuthenticatedRequest {
  def fromRequest[A](request: Request[A]): Either[String, AuthenticatedRequest[A]] =
    for {
      idToken <- Either
        .fromOption(request.session.get("id_token"), "No id_token in session")
        .flatMap(IdToken.fromTokenValue)
      auth0AccessToken <- Either.fromOption(
        request.session.get("access_token").map(Auth0AccessToken.apply),
        "No access_token in session")
      authPlusAccessToken <- Either.fromOption(
        request.session.get("auth_plus_access_token").map(AuthPlusAccessToken.apply),
        "No Auth+ token in session")
      ns <- Either.fromOption(request.session.get("namespace").map(Namespace.apply), "No namespace in session")
    } yield AuthenticatedRequest(idToken, auth0AccessToken, authPlusAccessToken, ns, request)
}

class AuthenticatedAction @Inject()(val parser: BodyParsers.Default)(implicit val executionContext: ExecutionContext)
  extends ActionBuilder[AuthenticatedRequest, AnyContent] {
  val log = Logger(this.getClass)

  def invokeBlock[A](request: Request[A], block: (AuthenticatedRequest[A]) => Future[Result]): Future[Result] = {
    AuthenticatedRequest.fromRequest(request) match {
      case Right(x) => block(x)
      case Left(x) =>
        log.debug(s"Invalid session: $x")
        Future.successful(Results.Redirect(com.advancedtelematic.controllers.routes.LoginController.login()))
    }
  }

}
