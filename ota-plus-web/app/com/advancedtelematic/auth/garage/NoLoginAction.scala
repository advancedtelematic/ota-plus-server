package com.advancedtelematic.auth.garage

import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.Base64

import akka.actor.ActorSystem
import brave.play.{TraceData, ZipkinTraceServiceLike}
import com.advancedtelematic.PlayMessageBusPublisher
import com.advancedtelematic.api.{ApiClientExec, ApiClientSupport}
import com.advancedtelematic.api.Errors.RemoteApiError
import com.advancedtelematic.auth.{AccessTokenBuilder, IdToken, IdentityClaims, SessionCodecs}
import com.advancedtelematic.controllers.{UserId, UserLogin}
import com.advancedtelematic.libats.data.DataType.Namespace
import javax.inject.Inject
import play.api.{Configuration, Logger}
import play.api.libs.json.Json
import play.api.mvc.{AnyContent, BodyParsers, Request, Result, Results}

import scala.concurrent.{ExecutionContext, Future}
import scala.util.Try

class NoLoginAction @Inject()(val conf: Configuration,
                              val parser: BodyParsers.Default,
                              val clientExec: ApiClientExec,
                              val tracer: ZipkinTraceServiceLike,
                              val executionContext: ExecutionContext,
                              messageBus: PlayMessageBusPublisher,
                              tokenBuilder: AccessTokenBuilder
                             )(implicit system: ActorSystem)
  extends com.advancedtelematic.auth.LoginAction with ApiClientSupport {

  import system.dispatcher

  private lazy val log           = Logger(this.getClass)
  private lazy val fakeNamespace = conf.get[String]("oidc.namespace")
  private lazy val email         = "guest@here.com"
  private lazy val userName      = "Guest User"
  implicit private lazy val traceData = TraceData(tracer.tracing.tracer().newTrace())

  private def namespace(request: Request[AnyContent]): String = {
    val fromHeader = for {
      authHeader <- request.headers.get("Authorization")
      authBase64 <- authHeader.split(" ").tail.headOption
      authData   <- Try(new String(Base64.getDecoder.decode(authBase64))).toOption
      user       <- authData.split(":").headOption
    } yield user

    fromHeader.getOrElse(fakeNamespace)
  }

  private def ensureNsExists(ns: Namespace, userId: UserId) =
    userProfileApi
      .getUser(userId)
      .recoverWith {
        case RemoteApiError(result, _) if result.header.status == 404 =>
          userProfileApi.createUser(userId, userName, email, Some(ns))
      }

  override def apply(request: Request[AnyContent]) = {
    val fakeNamespace = namespace(request)
    val idToken       = IdToken.from(fakeNamespace, userName , "guest", email)
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
        Some(IdentityClaims(UserId(fakeNamespace), userName, None, email)),
        Namespace(fakeNamespace),
        Instant.now()))

    ensureNsExists(Namespace(fakeNamespace), UserId(fakeNamespace)).map(_ => result)
  }
}

class NoLogoutAction @Inject()(val parser: BodyParsers.Default, val executionContext: ExecutionContext)
    extends com.advancedtelematic.auth.LogoutAction {

  override def apply(request: Request[AnyContent]): Future[Result] = {
    Future.successful(Results.Redirect(com.advancedtelematic.controllers.routes.LoginController.login()).withNewSession)
  }
}
