package com.advancedtelematic.ota.Messages

import akka.actor.{ActorSystem, Props}
import cats.data.Xor
import com.typesafe.config.ConfigValueFactory
import java.util.UUID
import org.genivi.sota.messaging.MessageBus
import org.genivi.sota.messaging.Messages.{BusMessage, MessageLike}
import org.genivi.sota.messaging.daemon.MessageBusListenerActor
import org.slf4j.LoggerFactory

import scala.reflect.runtime.universe._

object WebMessageBusListenerActor {
  val _log = LoggerFactory.getLogger(this.getClass)
  val uuid = UUID.randomUUID()

  def props[M <: BusMessage]()(implicit ml: MessageLike[M], tt: TypeTag[M], system: ActorSystem): Props = {
    val groupIdPrefix = system.settings.config.getString("messaging.kafka.groupIdPrefix")
    val newGroupIdPrefix = ConfigValueFactory.fromAnyRef(groupIdPrefix + s"-$uuid-")
    val config = system.settings.config.withValue("messaging.kafka.groupIdPrefix", newGroupIdPrefix)

    val source = MessageBus.subscribe(system, config) match {
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
