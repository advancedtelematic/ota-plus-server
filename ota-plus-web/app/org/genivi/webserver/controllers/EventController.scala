package org.genivi.webserver.controllers

import javax.inject.{Inject, Singleton}

import akka.actor.ActorSystem
import akka.stream.Materializer
import akka.stream.scaladsl.Source
import com.typesafe.config.ConfigException
import org.genivi.sota.data.Device
import org.genivi.sota.messaging.MessageBusManager
import org.genivi.sota.messaging.Messages.DeviceSeenMessage
import org.genivi.webserver.controllers.messaging.MessageBusConnection
import play.api.{Configuration, Logger}
import play.api.http.ContentTypes
import play.api.libs.Comet
import play.api.libs.concurrent.Execution
import play.api.libs.json._
import play.api.mvc._

@Singleton
class EventController @Inject()
    (val subFn: MessageBusConnection,
     val system: ActorSystem,
     val conf: Configuration)(implicit mat: Materializer)
  extends Controller {

  implicit val context = Execution.defaultContext
  private val log = Logger(this.getClass)

  MessageBusManager.getSubscriber(system, conf.underlying)

  implicit val deviceWrites = new Writes[DeviceSeenMessage] {
   def writes(deviceMsg: DeviceSeenMessage) = Json.obj(
     "deviceId" -> deviceMsg.deviceId.underlying.get,
     "lastSeen" -> deviceMsg.lastSeen.toString
   )
  }

  def subDeviceSeen(device: Device.Id): Action[AnyContent] = Action {
    val srcFn = subFn.getSource(system)
    val deviceSeenSource: Source[DeviceSeenMessage, _] = srcFn(device)
    Ok.chunked(deviceSeenSource
      .map(Json.toJson(_))
        via Comet.json("parent.deviceSeen")).as(ContentTypes.JSON)
  }

}
