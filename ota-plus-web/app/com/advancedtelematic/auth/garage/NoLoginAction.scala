package com.advancedtelematic.auth.garage

import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.UUID
import javax.inject.Inject

import akka.actor.ActorSystem
import com.advancedtelematic.{PlayMessageBusPublisher, auth}
import com.advancedtelematic.auth.{IdToken, SessionCodecs}
import com.advancedtelematic.controllers.UserLogin
import com.advancedtelematic.jws.{CompactSerialization, JwsPayload}
import play.api.libs.json.Json
import play.api.mvc.{AnyContent, BodyParsers, Request, Results}
import play.api.{Configuration, Logger}
import io.circe.syntax._

import scala.concurrent.{ExecutionContext, Future}

class NoLoginAction @Inject()(messageBus: PlayMessageBusPublisher,
                              configuration: Configuration,
                              val parser: BodyParsers.Default,
                              val executionContext: ExecutionContext)(implicit system: ActorSystem)
  extends com.advancedtelematic.auth.LoginAction {

  import system.dispatcher

  private lazy val jwtSecret = configuration.get[String]("authplus.token")
  private lazy val fakeNamespace = configuration.get[String]("oidc.namespace")

  override def apply(request: Request[AnyContent]) = {
    val idToken = IdToken.from(fakeNamespace, "Guest User", "guest", "guest@advancedtelematic.com")
    val accessToken = AuthPlusSignature.fakeSignedToken(jwtSecret, fakeNamespace)

    val result = Results.Redirect(com.advancedtelematic.controllers.routes.Application.index()).withSession(
      "namespace"    -> fakeNamespace,
      "id_token"     -> idToken.value,
      "access_token" -> Json.stringify(Json.toJson(accessToken)(SessionCodecs.AccessTokenFormat))
    )

    messageBus.publishSafe(UserLogin(fakeNamespace, Instant.now()))

    Future.successful(result)
  }
}
