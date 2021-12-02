package com.advancedtelematic.auth

import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.Base64

import akka.actor.ActorSystem
import brave.play.{TraceData, ZipkinTraceServiceLike}
import com.advancedtelematic.PlayMessageBusPublisher
import com.advancedtelematic.api.Errors.RemoteApiError
import com.advancedtelematic.api.{ApiClientExec, ApiClientSupport}
import com.advancedtelematic.controllers.{UserId, UserLogin}
import com.advancedtelematic.libats.data.DataType.Namespace
import javax.inject.Inject
import play.api.libs.json.Json
import play.api.mvc._
import play.api.{Configuration, Logger}

import scala.concurrent.{ExecutionContext, Future}
import scala.util.Try

object NoLoginData {
  lazy val email    = "guest@here.com"
  lazy val userName = "Guest User"

}

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
  private lazy val fakeUser      = conf.get[String]("oidc.user")
  implicit private lazy val traceData = TraceData(tracer.tracing.tracer().newTrace())

  private def ensureNsExists(ns: Namespace, userId: UserId) =
    userProfileApi
      .getUser(userId)
      .recoverWith {
        case RemoteApiError(result, _) if result.header.status == 404 =>
          userProfileApi.createUser(userId, NoLoginData.userName, NoLoginData.email, Some(ns))
      }

  override def apply(request: Request[AnyContent]): Future[Result] = {
    val idToken = IdToken.from(fakeUser, NoLoginData.userName , "guest", NoLoginData.email)
    val accessToken =
      tokenBuilder.mkToken(fakeUser, Instant.now().plus(30, ChronoUnit.DAYS), Set(s"namespace.${fakeNamespace}"))

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
        Some(IdentityClaims(UserId(fakeUser), NoLoginData.userName, None, NoLoginData.email)),
        Namespace(fakeNamespace),
        Instant.now()))

    ensureNsExists(Namespace(fakeNamespace), UserId(fakeUser)).map(_ => result)
  }
}

class NoLogoutAction @Inject()(val parser: BodyParsers.Default, val executionContext: ExecutionContext)
    extends com.advancedtelematic.auth.LogoutAction {

  override def apply(request: Request[AnyContent]): Future[Result] = {
    Future.successful(Results.Redirect(com.advancedtelematic.controllers.routes.LoginController.login()).withNewSession)
  }
}
