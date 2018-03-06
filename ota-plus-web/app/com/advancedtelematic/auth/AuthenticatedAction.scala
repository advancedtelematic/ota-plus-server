package com.advancedtelematic.auth

import com.advancedtelematic.jwt.JsonWebToken
import com.advancedtelematic.libats.auth.{AuthedNamespaceScope, NsFromToken}
import com.advancedtelematic.libats.data.DataType.Namespace
import javax.inject.Inject
import play.api.{Configuration, Logger}
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success, Try}
import scala.util.control.NoStackTrace

final case class AuthenticatedRequest[A](idToken: IdToken,
                                         accessToken: AccessToken,
                                         namespace: Namespace,
                                         request: Request[A])
    extends WrappedRequest[A](request)

object AuthenticatedRequest {
  final case class MissingSessionKey(key: String)
    extends Throwable(s"Key '$key' not found in session") with NoStackTrace

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

  def fromAuthHeader[A](request: Request[A]): Try[AuthenticatedRequest[A]] = {
    extractBearerToken(request).map { case (token, jwt) =>
      // TODO: Use com.advancedtelematic.libats.data.DataType.Namespace
      val ns = AuthedNamespaceScope(jwt).namespace.get
      // TODO: Refactor to allow no IdToken
      AuthenticatedRequest(
        IdToken.from(ns, jwt.clientId.toString, "", ""),
        AccessToken(token, jwt.expirationTime),
        Namespace(ns),
        request)
    }
  }

  final case class InvalidJwt(error: String) extends Throwable(error) with NoStackTrace

  private[this] def extractBearerToken[A](request: Request[A]): Try[(String, JsonWebToken)] =
    request.headers.get("Authorization")
      .map { _.split(' ') match {
        case Array(bearer, token) if bearer.toLowerCase == "bearer" =>
          NsFromToken.parseToken[JsonWebToken](token)
            .fold(e => Failure(InvalidJwt(e)), jwt => Success((token, jwt)))
        case _ => Failure(InvalidJwt("Missing bearer token"))
        }
      }
      .getOrElse(Failure(InvalidJwt("Missing 'Authorization' header")))
}

abstract class AuthenticatedAction extends ActionBuilder[AuthenticatedRequest, AnyContent] {

  def config: Configuration
  def parser: BodyParsers.Default
  implicit def executionContext: ExecutionContext
  def unauthorizedResult: Result
  def tokenVerification: TokenVerification

  def authRequest[A](request: Request[A]): Try[AuthenticatedRequest[A]]

  val log = Logger(this.getClass)

  def invokeBlock[A](request: Request[A], block: (AuthenticatedRequest[A]) => Future[Result]): Future[Result] = {
    authRequest(request) match {
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

  override def authRequest[A](request: Request[A]): Try[AuthenticatedRequest[A]] =
    AuthenticatedRequest.fromRequest(request)

  override val unauthorizedResult: Result =
    Results.Redirect(com.advancedtelematic.controllers.routes.LoginController.login())
}

class ApiAuthAction @Inject()(val tokenVerification: TokenVerification,
                              val config: Configuration,
                              val parser: BodyParsers.Default)(
    implicit val executionContext: ExecutionContext
) extends AuthenticatedAction {

  override def authRequest[A](request: Request[A]): Try[AuthenticatedRequest[A]] =
    AuthenticatedRequest.fromAuthHeader(request) orElse AuthenticatedRequest.fromRequest(request)

  override def unauthorizedResult: Result = Results.Forbidden("Not authenticated")
}
