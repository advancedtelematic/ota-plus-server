package com.advancedtelematic.messaging

import akka.actor.{ActorSystem, Props}
import cats.data.Xor
import org.genivi.sota.messaging.MessageBus
import org.genivi.sota.messaging.Messages.{BusMessage, MessageLike}
import org.genivi.sota.messaging.daemon.MessageBusListenerActor
import org.slf4j.LoggerFactory

import scala.reflect.runtime.universe._

object WebMessageBusListenerActor {
  val _log = LoggerFactory.getLogger(this.getClass)

  def props[M <: BusMessage]()(implicit ml: MessageLike[M], tt: TypeTag[M], system: ActorSystem): Props = {
    val source = MessageBus.subscribe(system, system.settings.config) match {
      case Xor.Right(s) =>
        s.map { msg =>
          _log.info(s"Received ${ml.streamName} -> ${ml.id(msg)}, publishing to akka event stream")
          system.eventStream.publish(msg)
          msg
        }

      case Xor.Left(err) => throw err
    }

    MessageBusListenerActor.props(source)
  }
}
