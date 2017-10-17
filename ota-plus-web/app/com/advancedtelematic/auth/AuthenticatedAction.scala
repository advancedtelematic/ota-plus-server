package com.advancedtelematic.auth

import javax.inject.Inject

import cats.syntax.either._
import org.genivi.sota.data.Namespace
import play.api.{Configuration, Logger}
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success, Try}

final case class AuthenticatedRequest[A](idToken: IdToken,
                                         accessToken: AccessToken,
                                         namespace: Namespace,
                                         request: Request[A])
    extends WrappedRequest[A](request)

object AuthenticatedRequest {
  final case class MissingSessionKey(key: String) extends Throwable(s"Key '$key' not found in session")

  private[this] def readValue(session: Session, key: String): Try[String] = {
    session.get(key) match {
      case Some(value) =>
        Success(value)

      case None =>
        Failure(MissingSessionKey(key))
    }
  }

  def fromRequest[A](request: Request[A]): Try[AuthenticatedRequest[A]] = {
    val session = request.session
    for {
      idToken     <- readValue(session, "id_token").flatMap(IdToken.fromTokenValue)
      accessToken <- readValue(session, "access_token").flatMap(SessionCodecs.parseAccessToken)
      ns          <- readValue(session, "namespace").map(Namespace.apply)
    } yield AuthenticatedRequest(idToken, accessToken, ns, request)
  }
}

abstract class AuthenticatedAction extends ActionBuilder[AuthenticatedRequest, AnyContent] {

  def config: Configuration
  def parser: BodyParsers.Default
  implicit def executionContext: ExecutionContext
  def unauthorizedResult: Result
  def tokenVerification: TokenVerification

  val log = Logger(this.getClass)

  def invokeBlock[A](request: Request[A], block: (AuthenticatedRequest[A]) => Future[Result]): Future[Result] = {
    AuthenticatedRequest.fromRequest(request) match {
      case Success(x) =>
        tokenVerification(x.accessToken)
          .flatMap(isValid => if (isValid) block(x) else Future.successful(unauthorizedResult))
      case Failure(t) =>
        log.debug("Session verification failed.", t)
        Future.successful(unauthorizedResult)
    }
  }
}

class UiAuthAction @Inject()(val tokenVerification: TokenVerification,
                             val config: Configuration,
                             val parser: BodyParsers.Default)(
    implicit val executionContext: ExecutionContext
) extends AuthenticatedAction {
  override val unauthorizedResult: Result =
    Results.Redirect(com.advancedtelematic.controllers.routes.LoginController.login())
}

class ApiAuthAction @Inject()(val tokenVerification: TokenVerification,
                              val config: Configuration,
                              val parser: BodyParsers.Default)(
    implicit val executionContext: ExecutionContext
) extends AuthenticatedAction {
  override def unauthorizedResult: Result = Results.Forbidden("Not authenticated")
}
