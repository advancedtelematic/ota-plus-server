package com.advancedtelematic.auth

import akka.http.scaladsl.model.headers.{Authorization, OAuth2BearerToken}
import com.advancedtelematic.auth.SecuredAction.InvalidSignature
import com.advancedtelematic.libats.data.DataType.Namespace
import javax.crypto.spec.SecretKeySpec
import javax.inject.Inject
import org.jose4j.base64url.Base64
import org.jose4j.jwa.AlgorithmConstraints
import org.jose4j.jwa.AlgorithmConstraints.ConstraintType
import org.jose4j.jws.{AlgorithmIdentifiers, JsonWebSignature}
import play.api.{Configuration, Logger}
import play.api.libs.json.{Json, JsResult}
import play.api.mvc._
import play.api.mvc.Results.EmptyContent

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success, Try}
import scala.util.control.NoStackTrace

sealed abstract class AuthorizedRequest[A](request: Request[A]) extends WrappedRequest[A](request) {
  def accessToken: AccessToken
  def namespace: Namespace
}
final case class AuthorizedBearerJwtRequest[A](accessToken: AccessToken, namespace: Namespace, request: Request[A])
    extends AuthorizedRequest[A](request)
final case class AuthorizedSessionRequest[A](accessToken: AccessToken,
                                             idToken: IdToken,
                                             namespace: Namespace,
                                             request: Request[A])
    extends AuthorizedRequest[A](request)

object SecuredAction {
  final case class MissingSessionKey(key: String)
      extends Throwable(s"Key '$key' not found in session")
      with NoStackTrace

  private[this] def readValue(session: Session, key: String): Try[String] = {
    session.get(key) match {
      case Some(value) =>
        Success(value)

      case None =>
        Failure(MissingSessionKey(key))
    }
  }

  def fromSession[A](request: Request[A]): Try[AuthorizedSessionRequest[A]] = {
    val session = request.session

    for {
      idToken     <- readValue(session, "id_token").flatMap(IdToken.fromCompactSerialization)
      accessToken <- readValue(session, "access_token").flatMap(SessionCodecs.parseAccessToken)
      ns          <- readValue(session, "namespace").map(Namespace.apply)
    } yield AuthorizedSessionRequest(accessToken, idToken, ns, request)
  }

  final case class InvalidJwt(error: String) extends Throwable(error) with NoStackTrace

  final case class InvalidSignature(tokenValue: String) extends Throwable("Signature of the JWT is invalid.")
}

abstract class SecuredAction[R[_] <: AuthorizedRequest[_]] extends ActionBuilder[R, AnyContent] {

  def config: Configuration
  def parser: BodyParsers.Default
  implicit def executionContext: ExecutionContext
  def unauthorizedResult: Result
  def tokenVerification: TokenVerification

  def authRequest[A](request: Request[A]): Try[R[A]]

  val log = Logger(this.getClass)

  def invokeBlock[A](request: Request[A], block: (R[A]) => Future[Result]): Future[Result] = {
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

/**
  * To be used if response is rendered on a server. Redirects to the login page in case no valid session is available.
  */
class UiAuthAction @Inject()(val tokenVerification: TokenVerification,
                             val config: Configuration,
                             val parser: BodyParsers.Default)(
    implicit val executionContext: ExecutionContext
) extends SecuredAction[AuthorizedSessionRequest] {

  override def authRequest[A](request: Request[A]): Try[AuthorizedSessionRequest[A]] =
    SecuredAction.fromSession(request)

  override val unauthorizedResult: Result =
    Results.Redirect(com.advancedtelematic.controllers.routes.LoginController.login())
}

/**
  * This action can be used to handle requests from SPA in case it requires information about user's identity.
  */
class IdentityAction @Inject()(val tokenVerification: TokenVerification,
                               val config: Configuration,
                               val parser: BodyParsers.Default)(implicit val executionContext: ExecutionContext)
    extends SecuredAction[AuthorizedSessionRequest] {

  override def authRequest[A](request: Request[A]): Try[AuthorizedSessionRequest[A]] =
    SecuredAction.fromSession(request)

  override def unauthorizedResult: Result = Results.Forbidden("Not authenticated")
}

class ApiAuthAction @Inject()(val tokenVerification: TokenVerification,
                              val config: Configuration,
                              val parser: BodyParsers.Default)(
    implicit val executionContext: ExecutionContext
) extends SecuredAction[AuthorizedRequest] {

  private[this] val secret = {
    val encodedKey = config.get[String]("authplus.token")
    new SecretKeySpec( Base64.decode(encodedKey), "HMAC" )
  }
  private[this] def extractBearerToken[A](request: Request[A]): Try[String] = {
    import SecuredAction.InvalidJwt

    request.headers
      .get("Authorization")
      .map {
        Authorization.parseFromValueString(_) match {
          case Left(errors) =>
            Failure(InvalidJwt(errors.mkString("\n")))

          case Right(Authorization(OAuth2BearerToken(token))) =>
            Success(token)

          case Right(authorization) =>
            Failure(InvalidJwt(s"Unsupported authorization ${authorization}."))
        }
      }
      .getOrElse(Failure(InvalidJwt("Missing 'Authorization' header")))
  }

  private[this] def processBearerToken(tokenValue: String): Try[AccessTokenClaims] = {
    val jwsOrErr = Try {
      val jws = new JsonWebSignature()
      jws.setCompactSerialization(tokenValue)
      jws.setAlgorithmConstraints(
        new AlgorithmConstraints(ConstraintType.WHITELIST, AlgorithmIdentifiers.HMAC_SHA256)
      )
      jws.setKey(secret)
      jws
    }

    for {
      jws <- jwsOrErr
      payload <- if( jws.verifySignature() ) Success(jws.getPayload) else Failure(InvalidSignature(tokenValue))
      json <- Try { Json.parse(payload) }
      claims <- JsResult.toTry(json.validate[AccessTokenClaims])
    } yield claims
  }

  private[this] val `namespace.` = "namespace."

  private[this] def nsFromScope(claims: AccessTokenClaims): Try[Namespace] = {
    claims.scope.find(_.startsWith(`namespace.`)).map(_.substring(`namespace.`.length)) match {
      case Some(x) =>
        Success(Namespace(x))

      case None =>
        Failure(new IllegalStateException("No namespace found in token's scope"))
    }
  }

  override def authRequest[A](request: Request[A]): Try[AuthorizedRequest[A]] = {
    (extractBearerToken(request), SecuredAction.fromSession(request)) match {
      case (Failure(t), Failure(e)) =>
        Failure(new IllegalStateException("Neither valid session nor a bearer token authz in request"))

      case (Success(_), Success(_)) =>
        Failure(new IllegalStateException("The request has both valid session and a bearer token."))

      case (Success(x), Failure(_)) =>
        for {
          claims <- processBearerToken(x)
          ns <- nsFromScope(claims)
        } yield AuthorizedBearerJwtRequest(AccessToken(x, claims.expirationTime), ns, request)

      case (Failure(_), x @ Success(_)) =>
        x
    }
  }

  override def unauthorizedResult: Result = Results.Forbidden(EmptyContent())
}
