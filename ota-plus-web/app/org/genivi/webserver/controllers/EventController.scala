package org.genivi.webserver.controllers

import javax.inject.{Inject, Singleton}

import akka.actor.ActorSystem
import akka.stream.Materializer
import akka.stream.scaladsl.{Flow, Sink, Source}
import com.advancedtelematic.ota.Messages.MessageWriters._
import com.advancedtelematic.ota.Messages.WebMessageBusListenerActor
import org.genivi.sota.data.{Namespace, Uuid}
import org.genivi.sota.messaging.Messages.{DeviceCreated, DeviceDeleted, DeviceSeen, PackageCreated, UpdateSpec}
import org.genivi.sota.messaging.daemon.MessageBusListenerActor.Subscribe
import org.genivi.webserver.controllers.messaging.MessageSourceProvider
import play.api.http.ContentTypes
import play.api.libs.Comet
import play.api.libs.streams._
import play.api.libs.json._
import play.api.mvc._
import play.api.mvc.WebSocket.FrameFormatter
import play.api.Configuration
import scala.concurrent.Future

@Singleton
class EventController @Inject()
    (val messageBusProvider: MessageSourceProvider,
     val conf: Configuration)(implicit mat: Materializer, system: ActorSystem)
  extends Controller {

  /*
  This means we cannot have more than app server,
  as each actor will use up one app name to start a worker.

  See PRO-1358 on how to fix this
   */
  List(
    WebMessageBusListenerActor.props[DeviceSeen],
    WebMessageBusListenerActor.props[DeviceCreated]
//    WebMessageBusListenerActor.props[DeviceDeleted],
//    WebMessageBusListenerActor.props[PackageCreated],
//    WebMessageBusListenerActor.props[UpdateSpec]
  ).foreach(p => system.actorOf(p) ! Subscribe)

  private def subscribe[T](source: Source[T, _], callbackName: String)(implicit writes: Writes[T]) = {
    Ok.chunked(
      source
      .map(Json.toJson(_))
      .via(Comet.json(callbackName)))
      .as(ContentTypes.HTML)
  }

  def subDeviceSeen(device: Uuid): Action[AnyContent] = Action {
    val deviceSeenSource = messageBusProvider.getSource[DeviceSeen]().filter(_.uuid == device)
    subscribe(deviceSeenSource, "parent.deviceSeen")
  }

  def subDeviceCreated(namespace: Namespace): Action[AnyContent] = Action {
    val deviceCreatedSource = messageBusProvider.getSource[DeviceCreated]().filter(_.namespace == namespace)
    subscribe(deviceCreatedSource, "parent.deviceCreated")
  }

  def subDeviceDeleted(namespace: Namespace): Action[AnyContent] = Action {
    val deviceDeletedSource = messageBusProvider.getSource[DeviceDeleted]().filter(_.namespace == namespace)
    subscribe(deviceDeletedSource, "parent.deviceDeleted")
  }

  def subPackageCreated(namespace: Namespace): Action[AnyContent] = Action {
    val packageCreatedSource = messageBusProvider.getSource[PackageCreated]().filter(_.namespace == namespace)
    subscribe(packageCreatedSource, "parent.packageCreated")
  }

  def subUpdateSpec(namespace: Namespace): Action[AnyContent] = Action {
    val updateSpecSource = messageBusProvider.getSource[UpdateSpec]().filter(_.namespace == namespace)
    subscribe(updateSpecSource, "parent.updateSpec")
  }

  def ws(device: Uuid) = WebSocket.acceptOrResult[JsValue, JsValue] { request =>
    // TODO do sameOriginCheck
    val act = for {
      idToken             <- request.session.get("id_token")
      auth0AccessToken    <- request.session.get("access_token")
      authPlusAccessToken <- request.session.get("auth_plus_access_token")
      ns                  <- request.session.get("namespace")
    } yield Right(wsFlow(device))

    Future.successful(act.getOrElse(Left(Forbidden("forbidden"))))
  }

  def wsFlow(device: Uuid): Flow[JsValue, JsValue, _] = {
    val deviceSeenSource    = messageBusProvider.getSource[DeviceSeen]()
      .filter(_.uuid == device)
      .map(Json.toJson(_))
    Flow.fromSinkAndSource(Sink.ignore, deviceSeenSource)
  }
}
