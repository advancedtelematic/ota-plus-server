package org.genivi.webserver.controllers.messaging

import akka.NotUsed
import akka.actor.{ActorRef, ActorSystem}
import akka.stream.{Materializer, OverflowStrategy}
import akka.stream.scaladsl.Source
import cats.data.Xor
import com.google.inject.ImplementedBy
import org.genivi.sota.messaging.MessageBus
import org.genivi.sota.messaging.Messages.{DeviceCreated, DeviceSeen, Message}
import DeviceCreated._
import DeviceSeen._
import io.circe.Decoder

import scala.reflect.ClassTag

@ImplementedBy(classOf[MessageBusActorListener])
trait MessageSourceProvider {
  def getSource[T <: Message]()(implicit system: ActorSystem, tag: ClassTag[T], decoder: Decoder[T]): Source[T, _]
}

class MessageBusActorListener extends MessageSourceProvider {
  def getSource[T <: Message]()
                             (implicit system: ActorSystem,
                              tag: ClassTag[T], decoder: Decoder[T]): Source[T, NotUsed] = {
    MessageBus.subscribe(system, system.settings.config) match {
      case Xor.Right(v) => v
      case Xor.Left(e) => throw e
    }
  }
}
