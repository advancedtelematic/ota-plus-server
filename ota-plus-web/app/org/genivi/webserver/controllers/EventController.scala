package org.genivi.webserver.controllers

import javax.inject.{Inject, Singleton}

import akka.actor.ActorSystem
import akka.stream.Materializer
import akka.stream.scaladsl.Source
import com.advancedtelematic.ota.Messages.Messages.{deviceCreatedWrites, deviceSeenWrites, deviceDeletedWrites}
import org.genivi.sota.data.{Device, Namespace}
import org.genivi.sota.messaging.MessageBusManager
import org.genivi.sota.messaging.Messages.{DeviceCreated, DeviceDeleted, DeviceSeen}
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

  MessageBusManager.subscribe[DeviceSeen](system, conf.underlying)
  MessageBusManager.subscribe[DeviceCreated](system, conf.underlying)

  def subDeviceSeen(device: Device.Id): Action[AnyContent] = Action {
    val deviceSeenSource: Source[DeviceSeen, _] = subFn.getDeviceSeenSource(system)
    Ok.chunked(deviceSeenSource
      .filter(dsm => dsm.deviceId == device)
      .map(Json.toJson(_))
      via Comet.json("parent.deviceSeen")).as(ContentTypes.JSON)
  }

  def subDeviceCreated(namespace: Namespace): Action[AnyContent] = Action {
    val deviceCreatedSource: Source[DeviceCreated, _] = subFn.getDeviceCreatedSource(system)
    Ok.chunked(deviceCreatedSource
      .filter(dcm => dcm.namespace == namespace)
      .map(Json.toJson(_))
      via Comet.json("parent.deviceCreated")).as(ContentTypes.JSON)
  }

  def subDeviceDeleted(namespace: Namespace): Action[AnyContent] = Action {
    val deviceDeletedSource: Source[DeviceDeleted, _] = subFn.getDeviceDeletedSource(system)
    Ok.chunked(deviceDeletedSource
      .filter(ddm => ddm.ns == namespace)
      .map(Json.toJson(_))
      via Comet.json("parent.deviceDeleted")).as(ContentTypes.JSON)
  }
}
