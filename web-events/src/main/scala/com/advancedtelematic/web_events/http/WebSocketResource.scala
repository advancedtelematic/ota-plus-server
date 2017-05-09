package com.advancedtelematic.web_events.http

import akka.actor.ActorSystem
import akka.http.scaladsl.model.ws.{Message, TextMessage}
import akka.http.scaladsl.server.Directive1
import akka.stream.Materializer
import akka.stream.scaladsl.{Flow, Sink, Source}

import com.advancedtelematic.web_events.daemon.MessageSourceProvider

import io.circe.generic.auto._
import io.circe.Json

import org.genivi.sota.data.Namespace
import org.genivi.sota.http.AuthedNamespaceScope
import org.genivi.sota.marshalling.CirceMarshallingSupport._
import org.genivi.sota.messaging.Messages.MessageLike
import org.genivi.sota.messaging.Messages.{DeviceCreated, DeviceDeleted, DeviceSeen, PackageCreated,
                                           PackageBlacklisted, UpdateSpec}
import scala.concurrent.ExecutionContext
import scala.reflect.ClassTag


class WebSocketResource(namespaceExtractor: Directive1[AuthedNamespaceScope],
                        messageBusProvider: MessageSourceProvider)
                       (implicit system: ActorSystem, ec: ExecutionContext, mat: Materializer) {

  import akka.http.scaladsl.server.Directives._

  def wsFlow(namespace: Namespace): Flow[Message, Message, Any] = {
    def getSource[T](ns: T => Namespace)(implicit ml: MessageLike[T]): Source[Message, _] = {
      implicit val tag = ml.tag
      messageBusProvider.getSource[T]()
        .filter(ns(_) == namespace)
        .map(msg => Json.obj("type" -> Json.fromString(tag.runtimeClass.getSimpleName),
                             "event" -> ml.encoder(msg)))
        .map(js => TextMessage(js.noSpaces))
    }

    val sources = getSource[DeviceSeen](_.namespace)
      .merge(getSource[DeviceDeleted](_.namespace))
      .merge(getSource[DeviceCreated](_.namespace))
      .merge(getSource[PackageCreated](_.namespace))
      .merge(getSource[PackageBlacklisted](_.namespace))
      .merge(getSource[UpdateSpec](_.namespace))

    Flow.fromSinkAndSource(Sink.ignore, sources)
  }

  val route = namespaceExtractor { ns =>
    path("events" / "ws") {
      handleWebSocketMessages(wsFlow(ns))
    }
  }
}
