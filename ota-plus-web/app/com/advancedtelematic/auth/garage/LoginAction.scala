package com.advancedtelematic.auth.garage

import javax.inject.Inject
import com.advancedtelematic.auth._
import play.api.{Configuration, Logger}
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}



class LoginAction @Inject()(conf: Configuration,
                            val parser: BodyParsers.Default,
                            val executionContext: ExecutionContext)
    extends com.advancedtelematic.auth.LoginAction {

  private[this] val oauthConfig = OAuthConfig(conf)
  private[this] val auth0Config = Auth0Config(conf)
  private[this] val downtimeConfig = DowntimeConfig(conf)
  override def apply(request: Request[AnyContent]): Future[Result] = {
    Future.successful(Results.Ok(views.html.login(oauthConfig, auth0Config, downtimeConfig)))
  }
}

import java.time.{Instant, ZoneId}
import java.time.format.{DateTimeFormatter, DateTimeParseException, FormatStyle}
import java.util.Locale
import scala.concurrent.duration.Duration

final case class DowntimeConfig(start: Option[Instant], duration: Duration) {
  val isPlanned = start.map(_.isAfter(Instant.now())).getOrElse(false)
  val isDown = start.map(st => {
      val now = Instant.now()
      st.isBefore(now) && st.isAfter(now.minusSeconds(duration.toSeconds))
  }).getOrElse(false)

  def startDateTime = start.map(st => {
    val fmt = DateTimeFormatter.ofLocalizedDateTime(FormatStyle.FULL)
      .withLocale(Locale.US)
      .withZone(ZoneId.systemDefault())
    fmt.format(st)
  }).getOrElse("")
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

