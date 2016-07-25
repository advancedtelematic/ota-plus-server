/**
  * Copyright: Copyright (C) 2015, Jaguar Land Rover
  * License: MPL-2.0
  */

package org.genivi.webserver.controllers

import javax.inject.{Inject, Singleton}

import akka.actor.ActorSystem
import akka.stream.Materializer
import com.advancedtelematic.ota.Messages.Messages.{deviceCreatedWrites, deviceSeenWrites}
import org.genivi.sota.data.{Device, Namespace}
import org.genivi.sota.messaging.MessageBus
import org.genivi.sota.messaging.Messages.{DeviceCreated, DeviceSeen}
import org.genivi.webserver.controllers.messaging.MessageSourceProvider
import play.api.http.ContentTypes
import play.api.libs.Comet
import play.api.libs.json._
import play.api.mvc._
import play.api.Configuration

@Singleton
class EventController @Inject()
    (val messageBusProvider: MessageSourceProvider,
     val conf: Configuration)(implicit mat: Materializer, system: ActorSystem)
  extends Controller {

  MessageBus.subscribe[DeviceSeen](system, conf.underlying)
  MessageBus.subscribe[DeviceCreated](system, conf.underlying)

  def subDeviceSeen(device: Device.Id): Action[AnyContent] = Action {
    val deviceSeenSource = messageBusProvider.getSource[DeviceSeen]()
    Ok.chunked(deviceSeenSource
      .filter(dsm => dsm.deviceId == device)
      .map(Json.toJson(_))
      via Comet.json("parent.deviceSeen")).as(ContentTypes.JSON)
  }

  def subDeviceCreated(namespace: Namespace): Action[AnyContent] = Action {
    val deviceCreatedSource = messageBusProvider.getSource[DeviceCreated]()
    Ok.chunked(deviceCreatedSource
      .filter(dcm => dcm.namespace == namespace)
      .map(Json.toJson(_))
      via Comet.json("parent.deviceCreated")).as(ContentTypes.JSON)
  }
}
