package com.advancedtelematic.web_events

import akka.http.scaladsl.Http
import akka.http.scaladsl.server.{Directives, Route}
import com.advancedtelematic.libats.http.BootApp
import com.advancedtelematic.libats.http.LogDirectives.logResponseMetrics
import com.advancedtelematic.libats.http.VersionDirectives.versionHeaders
import com.advancedtelematic.libats.messaging.Messages._
import com.advancedtelematic.libats.messaging.daemon.MessageBusListenerActor.Subscribe
import com.advancedtelematic.libats.monitoring.MetricsSupport
import com.advancedtelematic.web_events.daemon.{KafkaListener, WebMessageBusListener}
import com.advancedtelematic.web_events.http.WebEventsRoutes
import com.typesafe.config.ConfigFactory

// simpler versions of the messages with stringly types
trait Messages {
  case class DeviceSeen(namespace: String, uuid: String, lastSeen: String)
  case class DeviceCreated(namespace: String, uuid: String, deviceName: String, deviceId: Option[String],
                           deviceType: String, timestamp: String)
  case class PackageCreated(namespace: String, packageId: String, description: Option[String],
                            vendor: Option[String], signature: Option[String], timestamp: String)
  case class PackageBlacklisted(namespace: String, packageId: String, timestamp: String)
  case class UpdateSpec(namespace: String, device: String, packageUuid: String, status: String, timestamp: String)

  implicit val deviceSeenMessageLike = MessageLike[DeviceSeen](_.uuid)
  implicit val deviceCreatedMessageLike = MessageLike[DeviceCreated](_.uuid)
  implicit val packageCreatedMessageLike = MessageLike[PackageCreated](_.packageId.mkString)
  implicit val blacklistedPackageMessageLike = MessageLike[PackageBlacklisted](_.packageId.mkString)
  implicit val updateSpecMessageLike = MessageLike[UpdateSpec](_.device.toString)
}

trait Settings {
  lazy val config = ConfigFactory.load()

  val host = config.getString("server.host")
  val port = config.getInt("server.port")
}

object Boot extends BootApp
  with Directives
  with Settings
  with VersionInfo
  with MetricsSupport
  with Messages {

  log.info(s"Starting $version on http://$host:$port")

  val deviceSeenlistener = system.actorOf(KafkaListener.props(config, WebMessageBusListener.action[DeviceSeen]),
    "device-seen")
  deviceSeenlistener ! Subscribe

  val deviceCreatedlistener = system.actorOf(KafkaListener.props(config, WebMessageBusListener.action[DeviceCreated]),
    "device-created")
  deviceCreatedlistener ! Subscribe

  val packageCreatedlistener = system.actorOf(KafkaListener.props(config, WebMessageBusListener.action[PackageCreated]),
    "package-created")
  packageCreatedlistener ! Subscribe

  val packageBlacklistedlistener = system.actorOf(KafkaListener.props(config, WebMessageBusListener.action[PackageBlacklisted]),
    "package-blacklisted")
  packageBlacklistedlistener ! Subscribe

  val updateSpeclistener = system.actorOf(KafkaListener.props(config, WebMessageBusListener.action[UpdateSpec]),
    "update-spec")
  updateSpeclistener ! Subscribe

  val routes: Route =
    (versionHeaders(version) & logResponseMetrics(projectName)) {
      new WebEventsRoutes().routes
    }

  Http().bindAndHandle(routes, host, port)
}
