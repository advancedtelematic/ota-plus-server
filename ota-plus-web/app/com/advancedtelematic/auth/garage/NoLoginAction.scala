package com.advancedtelematic.auth.garage

import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.Base64

import akka.actor.ActorSystem
import com.advancedtelematic.PlayMessageBusPublisher
import com.advancedtelematic.auth.{AccessTokenBuilder, IdToken, IdentityClaims, SessionCodecs}
import com.advancedtelematic.controllers.{UserId, UserLogin}
import com.advancedtelematic.libats.data.DataType.Namespace
import javax.inject.Inject
import play.api.{Configuration, Logger}
import play.api.libs.json.Json
import play.api.mvc.{AnyContent, BodyParsers, Request, Result, Results}

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
    val email         = "guest@advancedtelematic.com"
    val idToken       = IdToken.from(fakeNamespace, "Guest User", "guest", email)
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

    messageBus.publishSafe(UserLogin(
        fakeNamespace,
        Some(IdentityClaims(UserId(fakeNamespace), "guest", None, email)),
        Namespace(fakeNamespace),
        Instant.now()))

    Future.successful(result)
  }
}

class NoLogoutAction @Inject()(val parser: BodyParsers.Default, val executionContext: ExecutionContext)
    extends com.advancedtelematic.auth.LogoutAction {

  override def apply(request: Request[AnyContent]): Future[Result] = {
    Future.successful(Results.Redirect(com.advancedtelematic.controllers.routes.LoginController.login()).withNewSession)
  }
}
