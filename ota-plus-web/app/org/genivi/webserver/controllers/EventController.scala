package org.genivi.webserver.controllers

import javax.inject.{Inject, Singleton}

import akka.actor.ActorSystem
import akka.stream.Materializer
import com.advancedtelematic.ota.Messages.MessageWriters._
import com.advancedtelematic.ota.Messages.WebMessageBusListenerActor
import org.genivi.sota.data.{Device, Namespace, Uuid}
import org.genivi.sota.messaging.Messages.{DeviceCreated, DeviceDeleted, DeviceSeen, PackageCreated, UpdateSpec}
import org.genivi.sota.messaging.daemon.MessageBusListenerActor.Subscribe
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

  val listenerProps = List(WebMessageBusListenerActor.props[DeviceSeen],
    WebMessageBusListenerActor.props[DeviceCreated],
    WebMessageBusListenerActor.props[DeviceDeleted],
    WebMessageBusListenerActor.props[PackageCreated],
    WebMessageBusListenerActor.props[UpdateSpec])
  listenerProps.foreach(p => system.actorOf(p) ! Subscribe)


  def subDeviceSeen(device: Uuid): Action[AnyContent] = Action {
    val deviceSeenSource = messageBusProvider.getSource[DeviceSeen]()
    Ok.chunked(deviceSeenSource
      .filter(dsm => dsm.uuid == device)
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
    val deviceDeletedSource = messageBusProvider.getSource[DeviceDeleted]()
    Ok.chunked(deviceDeletedSource
      .filter(ddm => ddm.namespace == namespace)
      .map(Json.toJson(_))
      via Comet.json("parent.deviceDeleted")).as(ContentTypes.HTML)
  }

  def subPackageCreated(namespace: Namespace): Action[AnyContent] = Action {
    val packageCreatedSource = messageBusProvider.getSource[PackageCreated]()
    Ok.chunked(packageCreatedSource
      .filter(usm => usm.namespace == namespace)
      .map(Json.toJson(_))
      via Comet.json("parent.packageCreated")).as(ContentTypes.HTML)
  }

  def subUpdateSpec(namespace: Namespace): Action[AnyContent] = Action {
    val updateSpecSource = messageBusProvider.getSource[UpdateSpec]()
    Ok.chunked(updateSpecSource
      .filter(usm => usm.namespace == namespace)
      .map(Json.toJson(_))
      via Comet.json("parent.updateSpec")).as(ContentTypes.HTML)
  }
}
