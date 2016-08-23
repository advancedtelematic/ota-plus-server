/**
  * Copyright: Copyright (C) 2015, Jaguar Land Rover
  * License: MPL-2.0
  */

package org.genivi.webserver.controllers

import javax.inject.{Inject, Singleton}

import akka.actor.ActorSystem
import akka.stream.Materializer
import akka.stream.scaladsl.Source
import com.advancedtelematic.ota.Messages.MessageWriters._
import org.genivi.sota.data.{Device, Namespace}
import org.genivi.sota.messaging.Messages.{DeviceCreated, DeviceDeleted, DeviceSeen, PackageCreated, UpdateSpec}
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

  def subDeviceSeen(device: Device.Id): Action[AnyContent] = Action {
    val deviceSeenSource = messageBusProvider.getSource[DeviceSeen]()
    Ok.chunked(deviceSeenSource
      .filter(dsm => dsm.deviceId == device)
      .map(Json.toJson(_))
      via Comet.json("parent.deviceSeen")).as(ContentTypes.HTML)
  }

  def subDeviceCreated(namespace: Namespace): Action[AnyContent] = Action {
    val deviceCreatedSource = messageBusProvider.getSource[DeviceCreated]()
    Ok.chunked(deviceCreatedSource
      .filter(dcm => dcm.namespace == namespace)
      .map(Json.toJson(_))
      via Comet.json("parent.deviceCreated")).as(ContentTypes.HTML)
  }

  def subDeviceDeleted(namespace: Namespace): Action[AnyContent] = Action {
    val deviceDeletedSource: Source[DeviceDeleted, _] = messageBusProvider.getSource[DeviceDeleted]()
    Ok.chunked(deviceDeletedSource
      .filter(ddm => ddm.namespace == namespace)
      .map(Json.toJson(_))
      via Comet.json("parent.deviceDeleted")).as(ContentTypes.HTML)
  }

  def subPackageCreated(namespace: Namespace): Action[AnyContent] = Action {
    val packageCreatedSource: Source[PackageCreated, _] = messageBusProvider.getSource[PackageCreated]()
    Ok.chunked(packageCreatedSource
      .filter(usm => usm.namespace == namespace)
      .map(Json.toJson(_))
      via Comet.json("parent.packageCreated")).as(ContentTypes.HTML)
  }

  def subUpdateSpec(namespace: Namespace): Action[AnyContent] = Action {
    val updateSpecSource: Source[UpdateSpec, _] = messageBusProvider.getSource[UpdateSpec]()
    Ok.chunked(updateSpecSource
      .filter(usm => usm.namespace == namespace)
      .map(Json.toJson(_))
      via Comet.json("parent.updateSpec")).as(ContentTypes.HTML)
  }
}
