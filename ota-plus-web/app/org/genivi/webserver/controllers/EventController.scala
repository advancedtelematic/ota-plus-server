package org.genivi.webserver.controllers

import javax.inject.{Inject, Singleton}

import akka.actor.ActorSystem
import akka.stream.Materializer
import akka.stream.scaladsl.Source
import com.advancedtelematic.ota.Messages.Messages._
import org.genivi.sota.data.{Device, Namespace}
import org.genivi.sota.messaging.MessageBusManager
import org.genivi.sota.messaging.Messages.{DeviceCreatedMessage, DeviceSeenMessage}
import org.genivi.webserver.controllers.messaging.MessageBusConnection
import play.api.http.ContentTypes
import play.api.libs.Comet
import play.api.libs.concurrent.Execution
import play.api.libs.json._
import play.api.mvc._
import play.api.Configuration

@Singleton
class EventController @Inject()
    (val subFn: MessageBusConnection,
     val system: ActorSystem,
     val conf: Configuration)(implicit mat: Materializer)
  extends Controller {

  implicit val context = Execution.defaultContext

  MessageBusManager.getSubscriber(system, conf.underlying)
  MessageBusManager.getDeviceCreatedSubscriber(system, conf.underlying)

  def subDeviceSeen(device: Device.Id): Action[AnyContent] = Action {
    val dsmListener = subFn.getDeviceSeenSource(system)
    val deviceSeenSource: Source[DeviceSeenMessage, _] = dsmListener(device)
    Ok.chunked(deviceSeenSource
      .map(Json.toJson(_))
        via Comet.json("parent.deviceSeen")).as(ContentTypes.JSON)
  }

  def subDeviceCreated(namespace: Namespace): Action[AnyContent] = Action {
    val dcmListener = subFn.getDeviceCreatedSource(system)
    val deviceCreatedSource: Source[DeviceCreatedMessage, _] = dcmListener(namespace)
    Ok.chunked(deviceCreatedSource
      .map(Json.toJson(_))
      via Comet.json("parent.deviceCreated")).as(ContentTypes.JSON)
  }
}
