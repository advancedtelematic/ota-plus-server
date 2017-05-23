package com.advancedtelematic.web_events.http

import akka.actor.ActorSystem
import akka.http.scaladsl.model.ws.{Message, TextMessage}
import akka.stream.Materializer
import akka.stream.scaladsl.{Flow, Sink, Source}
import com.advancedtelematic.web_events.daemon.MessageSourceProvider
import io.circe.Json
import com.advancedtelematic.libats.data.Namespace
import com.advancedtelematic.libats.messaging.Messages.MessageLike
import com.advancedtelematic.web_events._

import scala.concurrent.ExecutionContext

class WebSocketResource(messageBusProvider: MessageSourceProvider)
                       (implicit system: ActorSystem, ec: ExecutionContext, mat: Materializer) extends Messages {

  import akka.http.scaladsl.server.Directives._

  def wsFlow(namespace: Namespace): Flow[Message, Message, Any] = {

    def getSource[T](ns: T => String)(implicit ml: MessageLike[T]): Source[Message, _] = {
      implicit val tag = ml.tag

      messageBusProvider.getSource[T]()
        .filter(ns(_) == namespace.get)
        .map(msg => Json.obj("type" -> Json.fromString(tag.runtimeClass.getSimpleName),
                             "event" -> ml.encoder(msg)))
        .map(js => TextMessage(js.noSpaces))
    }

    val sources = getSource[DeviceSeen](_.namespace)
      .merge(getSource[DeviceCreated](_.namespace))
      .merge(getSource[PackageCreated](_.namespace))
      .merge(getSource[PackageBlacklisted](_.namespace))
      .merge(getSource[UpdateSpec](_.namespace))

    Flow.fromSinkAndSource(Sink.ignore, sources)
  }

  val tokenValidator = (new BasicAuthTokenValidator()).fromConfig()

  val route = tokenValidator { ns =>
    path("events" / "ws") {
      handleWebSocketMessages(wsFlow(ns))
    }
  }
}
