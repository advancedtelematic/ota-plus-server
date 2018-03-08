package com.advancedtelematic.auth.garage

import com.advancedtelematic.auth._
import javax.inject.Inject
import play.api.{Configuration, Logger}
import play.api.libs.ws.{WSAuthScheme, WSClient}
import play.api.mvc._
import play.shaded.ahc.org.asynchttpclient.util.HttpConstants.ResponseStatusCodes

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}

class LoginAction @Inject()(conf: Configuration,
                            val parser: BodyParsers.Default,
                            val executionContext: ExecutionContext)
    extends com.advancedtelematic.auth.LoginAction {

  private[this] val oauthConfig    = OAuthConfig(conf)
  private[this] val auth0Config    = Auth0Config(conf)
  private[this] val downtimeConfig = DowntimeConfig(conf)
  override def apply(request: Request[AnyContent]): Future[Result] = {
    Future.successful(Results.Ok(views.html.login(oauthConfig, auth0Config, downtimeConfig)))
  }
}

class LogoutAction @Inject()(conf: Configuration,
                             ws: WSClient,
                             authAction: UiAuthAction,
                             val parser: BodyParsers.Default)(implicit val executionContext: ExecutionContext)
    extends com.advancedtelematic.auth.LogoutAction {

  private[this] val log            = Logger(this.getClass)
  private[this] val oauthConfig    = OAuthConfig(conf)
  private[this] val authPlusConfig = AuthPlusConfig(conf).get

  override def apply(request: Request[AnyContent]): Future[Result] = {
    Future.fromTry(SecuredAction.fromSession(request).map(revoke)).map { _ =>
      implicit val reqHeader: RequestHeader = request
      val query =
          Map(
            "client_id" -> Seq(oauthConfig.clientId),
            "returnTo" ->
              Seq(com.advancedtelematic.controllers.routes.LoginController.login().absoluteURL(secure=true))
          )
      Results.Redirect(s"https://${oauthConfig.domain}/v2/logout", query).withNewSession
    }
  }

  private[this] def revoke[A](req: AuthorizedSessionRequest[A]): Unit = {
    ws.url(s"${authPlusConfig.uri}/revoke")
      .withAuth(authPlusConfig.clientId, authPlusConfig.clientSecret, WSAuthScheme.BASIC)
      .post(Map("token" -> Seq(req.accessToken.value)))
      .onComplete {
        case Success(response) if response.status == ResponseStatusCodes.OK_200 =>
          log.debug(s"Access token '${req.accessToken.value}' revoked.")

        case Success(response) =>
          log.error(s"Revocation request for token '${req.accessToken.value}' failed with response $response")

        case Failure(t) =>
          log.error(s"Revocation request for token '${req.accessToken.value}' failed.", t)
      }
  }
}

import java.time.{Instant, ZoneId}
import java.time.format.{DateTimeFormatter, DateTimeParseException, FormatStyle}
import java.util.Locale

import scala.concurrent.duration.Duration

final case class DowntimeConfig(start: Option[Instant], duration: Duration) {
  val isPlanned = start.map(_.isAfter(Instant.now())).getOrElse(false)
  val isDown = start
    .map(st => {
      val now = Instant.now()
      st.isBefore(now) && st.isAfter(now.minusSeconds(duration.toSeconds))
    })
    .getOrElse(false)

  def startDateTime =
    start
      .map(st => {
        val fmt = DateTimeFormatter
          .ofLocalizedDateTime(FormatStyle.FULL)
          .withLocale(Locale.US)
          .withZone(ZoneId.systemDefault())
        fmt.format(st)
      })
      .getOrElse("")
}

object DowntimeConfig {
  def apply(configuration: Configuration): DowntimeConfig = {
    val downtime = configuration.get[String]("downtime.start")
    val duration = configuration.get[Duration]("downtime.duration")
    try {
      val fmt = DateTimeFormatter.ISO_OFFSET_DATE_TIME
      val nst = Instant.from(fmt.parse(downtime))
      DowntimeConfig(Some(nst), duration)
    } catch {
      case t: DateTimeParseException =>
        DowntimeConfig(None, duration)
    }
  }
}
