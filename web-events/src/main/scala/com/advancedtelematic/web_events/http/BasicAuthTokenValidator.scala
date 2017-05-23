package com.advancedtelematic.web_events.http

import java.time.Instant
import javax.crypto.SecretKey
import javax.crypto.spec.SecretKeySpec

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.client.RequestBuilding._
import akka.http.scaladsl.model.ContentTypes._
import akka.http.scaladsl.model.headers.{Authorization, BasicHttpCredentials, HttpChallenge, HttpChallenges}
import akka.http.scaladsl.model.{HttpEntity, Multipart, StatusCodes, Uri}
import akka.http.scaladsl.server.AuthenticationFailedRejection.{CredentialsMissing, CredentialsRejected}
import akka.http.scaladsl.server._
import akka.http.scaladsl.unmarshalling.Unmarshal
import akka.http.scaladsl.util.FastFuture
import akka.stream.Materializer
import cats.syntax.either._
import com.advancedtelematic.jwa.HS256
import com.advancedtelematic.jws.Jws
import com.typesafe.config.{ConfigException, ConfigFactory}
import io.circe.generic.auto._
import io.circe.parser.decode
import io.circe.{Decoder, Json}
import org.apache.commons.codec.binary.Base64
import com.advancedtelematic.libats.data.Namespace
import org.slf4j.LoggerFactory
import com.advancedtelematic.jwt.JsonWebToken

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}

case class ValidationResponse(active: Boolean)

object BasicAuthTokenValidator {
  lazy val logger = LoggerFactory.getLogger(this.getClass)
}

class BasicAuthTokenValidator(implicit system: ActorSystem, mat: Materializer) {
  import de.heikoseeberger.akkahttpcirce.FailFastCirceSupport._
  import BasicAuthTokenValidator.logger
  import Directives._
  import Json._

  private val config = ConfigFactory.load()

  val authProtocol = config.getString("auth.protocol")
  val shouldVerify = config.getString("auth.verification")
  lazy val authPlusUri = Uri(config.getString("authplus.api.uri"))
  lazy val clientId = config.getString("authplus.client.id")
  lazy val clientSecret = config.getString("authplus.client.secret")

  private def authPlusCheckToken(token: String)(
      implicit ec: ExecutionContext): Future[Boolean] = {
    import StatusCodes._
    val uri = authPlusUri.withPath(Uri("/introspect").path)
    val entity = HttpEntity(`application/json`, fromString(token).noSpaces)
    val form = Multipart.FormData(Map("token" -> entity))
    val request = Post(uri, form) ~> Authorization(
      BasicHttpCredentials(clientId, clientSecret))

    for {
      response <- Http().singleRequest(request)
      status <- response.status match {
        case OK =>
          Unmarshal(response.entity).to[ValidationResponse].map(_.active)
        case _ =>
          FastFuture.failed(new Throwable(s"auth-plus doesn't return OK: ${response.toString}"))
      }
    } yield status
  }

  def parseJwt(input: String)(
      implicit decoder: Decoder[JsonWebToken]): Either[String, JsonWebToken] =
    for {
      jws <- Jws.readSignatureCompact(input)
      payload <- decode[JsonWebToken](new String(jws.payload.data))
        .leftMap(_.getMessage)
    } yield payload

  def validate(realm: String): Directive1[String] =
    extractCredentials.flatMap {
      // bearer authentication mapped to basic auth with token in password position
      case Some(BasicHttpCredentials(_, token)) =>
        provide(token)
      case _ =>
        reject(AuthenticationFailedRejection(CredentialsMissing, HttpChallenges.basic(realm)))
    }

  def authPlusValidate: Directive1[JsonWebToken] =
    validate("auth-plus").flatMap { token =>
      extractExecutionContext.flatMap { implicit ec =>
        onComplete(authPlusCheckToken(token)) flatMap {
          case Success(true) =>
            logger.info(s"Token was successfully verified via auth-plus")
            parseJwt(token) match {
              case Right(jwt) => provide(jwt)
              case Left(msg) =>
                logger.info(s"Token parse error: $msg")
                reject(AuthorizationFailedRejection)
            }
          case Success(false) =>
            logger.info("auth-plus rejects the token")
            reject(AuthorizationFailedRejection)
          case Failure(err) =>
            logger.info(s"Couldn't connect with auth-plus (will try local validation): ${err.toString}")
            localValidate
        }
      }
  }

  private[this] def authenticateToken(serializedToken: String,
                                      verifySignatureFn: Jws.JwsVerifier): Either[String, JsonWebToken] = {
    import cats.syntax.either._
    val tokenOrError: Either[String, JsonWebToken] =
      Jws.verifySignature[JsonWebToken](serializedToken, verifySignatureFn)
    tokenOrError.ensure("The access token expired")(_.expirationTime.isAfter(Instant.now()))
  }

  def authenticateJwt(token: String, realm: String, verifySignatureFn: Jws.JwsVerifier): Directive1[JsonWebToken] =
    authenticateToken(token, verifySignatureFn) match {
      case Left(err) =>
        reject(
          AuthenticationFailedRejection(
            CredentialsRejected,
            HttpChallenge("Bearer", realm, Map("error" -> "invalid_token", "error_description" -> err))
          )
        )

      case Right(jwt) =>
        provide(jwt)
    }

  def localValidate(token: String): Directive1[JsonWebToken] = {
    import com.advancedtelematic.json.signature.JcaSupport._

    val verifier: String Either Jws.JwsVerifier = for {
      secret <- Either
        .catchOnly[ConfigException] { config.getString("auth.token.secret") }
        .leftMap(_.getMessage)
        .map[SecretKey](x => new SecretKeySpec(Base64.decodeBase64(x), "HMAC"))
      keyInfo <- HS256.verificationKey(secret).leftMap(_.getMessage)
    } yield HS256.verifier(keyInfo)

    verifier.fold(
      _ => reject(AuthorizationFailedRejection),
      x =>
        authenticateJwt(token, "auth-plus", x).flatMap { jwt =>
          logger.info(s"Token was successfully verified locally")
          provide(jwt)
      }
    )
  }

  def localValidate: Directive1[JsonWebToken] =
    validate("local").flatMap { token =>
      localValidate(token)
    }

  def fromConfig(): Directive1[Namespace] = {
    val defaultNamespace = Namespace("default")

    authProtocol match {
      case "none" => provide(defaultNamespace)
      case _ =>
        shouldVerify match {
          case "none" =>
            logger.info("Will not verify tokens")
            provide(defaultNamespace)
          case "local" =>
            logger.info("Will verify tokens locally")
            localValidate.map(token => Namespace(token.subject.underlying))
          case "auth-plus" =>
            logger.info("Will verify tokens with auth-plus")
            authPlusValidate.map(token => Namespace(token.subject.underlying))
        }
    }
  }
}
