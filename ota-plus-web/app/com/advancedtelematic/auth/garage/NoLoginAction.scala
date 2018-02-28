package com.advancedtelematic.auth.garage

import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.{Base64, UUID}
import javax.inject.Inject

import akka.actor.ActorSystem
import cats.instances.map
import com.advancedtelematic.{auth, PlayMessageBusPublisher}
import com.advancedtelematic.auth.{AccessTokenBuilder, IdToken, SessionCodecs}
import com.advancedtelematic.controllers.UserLogin
import com.advancedtelematic.jws.{CompactSerialization, JwsPayload}
import play.api.libs.json.Json
import play.api.mvc.{AnyContent, BodyParsers, Request, Result, Results}
import play.api.{Configuration, Logger}
import io.circe.syntax._

import scala.concurrent.{ExecutionContext, Future}
import scala.util.Try

class NoLoginAction @Inject()(messageBus: PlayMessageBusPublisher,
                              configuration: Configuration,
                              tokenBuilder: AccessTokenBuilder,
                              val parser: BodyParsers.Default,
                              val executionContext: ExecutionContext)(implicit system: ActorSystem)
    extends com.advancedtelematic.auth.LoginAction {

  import system.dispatcher

  private lazy val log           = Logger(this.getClass)
  private lazy val jwtSecret     = configuration.get[String]("authplus.token")
  private lazy val fakeNamespace = configuration.get[String]("oidc.namespace")

  private def namespace(request: Request[AnyContent]): String = {
    val fromHeader = for {
      authHeader <- request.headers.get("Authorization")
      authBase64 <- authHeader.split(" ").tail.headOption
      authData   <- Try(new String(Base64.getDecoder.decode(authBase64))).toOption
      user       <- authData.split(":").headOption
    } yield user

    fromHeader.getOrElse(fakeNamespace)
  }

  override def apply(request: Request[AnyContent]) = {
    val fakeNamespace = namespace(request)
    val idToken       = IdToken.from(fakeNamespace, "Guest User", "guest", "guest@advancedtelematic.com")
    val accessToken =
      tokenBuilder.mkToken(fakeNamespace, Instant.now().plus(30, ChronoUnit.DAYS), Set(s"namespace.${fakeNamespace}"))

    val result = Results
      .Redirect(com.advancedtelematic.controllers.routes.Application.index())
      .withSession(
        "namespace"    -> fakeNamespace,
        "id_token"     -> idToken.value,
        "access_token" -> Json.stringify(Json.toJson(accessToken)(SessionCodecs.AccessTokenFormat))
      )

    log.debug(s"Signed fake auth token for namespace $fakeNamespace")

    messageBus.publishSafe(UserLogin(fakeNamespace, Instant.now()))

    Future.successful(result)
  }
}

class NoLogoutAction @Inject()(val parser: BodyParsers.Default, val executionContext: ExecutionContext)
    extends com.advancedtelematic.auth.LogoutAction {

  override def apply(request: Request[AnyContent]): Future[Result] = {
    Future.successful(Results.Redirect(com.advancedtelematic.controllers.routes.LoginController.login()).withNewSession)
  }
}
