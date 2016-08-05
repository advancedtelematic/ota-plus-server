/**
  * Copyright: Copyright (C) 2015, Jaguar Land Rover
  * License: MPL-2.0
  */

package org.genivi.webserver.controllers.messaging

import akka.actor.ActorSystem
import akka.stream.scaladsl.Source
import cats.data.Xor
import com.google.inject.ImplementedBy
import io.circe.Decoder
import org.genivi.sota.messaging.MessageBus
import org.genivi.sota.messaging.Messages.Message

import scala.reflect.ClassTag

@ImplementedBy(classOf[MessageBusActorListener])
trait MessageSourceProvider {
  def getSource[T <: Message]()(implicit system: ActorSystem,
                                tag: ClassTag[T],
                                decoder: Decoder[T]): Source[T, _]
}

class MessageBusActorListener extends MessageSourceProvider {

  def getSource[T <: Message]()(implicit system: ActorSystem,
                                  tag: ClassTag[T],
                                  decoder: Decoder[T]): Source[T, _] = {
    MessageBus.subscribe(system, system.settings.config) match {
      case Xor.Right(v) => v
      case Xor.Left(e)  => throw e
    }
  }
}
