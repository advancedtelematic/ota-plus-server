package com.advancedtelematic.web_events

import akka.http.scaladsl.Http
import akka.http.scaladsl.server.{Directives, Route}
import akka.stream.Materializer
import com.advancedtelematic.web_events.daemon.{KafkaListener, WebMessageBusListener}
import com.advancedtelematic.web_events.http.WebEventsRoutes
import com.typesafe.config.ConfigFactory
import org.genivi.sota.http.BootApp
import org.genivi.sota.http.LogDirectives.logResponseMetrics
import org.genivi.sota.http.VersionDirectives.versionHeaders
import org.genivi.sota.messaging.daemon.MessageBusListenerActor.Subscribe
import org.genivi.sota.messaging.Messages._
import org.genivi.sota.monitoring.MetricsSupport


trait Settings {
  lazy val config = ConfigFactory.load()

  val host = config.getString("server.host")
  val port = config.getInt("server.port")
}

object Boot extends BootApp
  with Directives
  with Settings
  with VersionInfo
  with MetricsSupport {

  log.info(s"Starting $version on http://$host:$port")

  val deviceSeenlistener = system.actorOf(KafkaListener.props(config, WebMessageBusListener.action[DeviceSeen]), "device-seen")
  deviceSeenlistener ! Subscribe

  val deviceCreatedlistener = system.actorOf(KafkaListener.props(config, WebMessageBusListener.action[DeviceCreated]), "device-created")
  deviceCreatedlistener ! Subscribe

  val deviceDeletedlistener = system.actorOf(KafkaListener.props(config, WebMessageBusListener.action[DeviceDeleted]), "device-deleted")
  deviceDeletedlistener ! Subscribe

  val packageCreatedlistener = system.actorOf(KafkaListener.props(config, WebMessageBusListener.action[PackageCreated]), "package-created")
  packageCreatedlistener ! Subscribe

  val packageBlacklistedlistener = system.actorOf(KafkaListener.props(config, WebMessageBusListener.action[PackageBlacklisted]), "package-blacklisted")
  packageBlacklistedlistener ! Subscribe

  val updateSpeclistener = system.actorOf(KafkaListener.props(config, WebMessageBusListener.action[UpdateSpec]), "update-spec")
  updateSpeclistener ! Subscribe

  val routes: Route =
    (versionHeaders(version) & logResponseMetrics(projectName)) {
      new WebEventsRoutes().routes
    }

  Http().bindAndHandle(routes, host, port)
}
