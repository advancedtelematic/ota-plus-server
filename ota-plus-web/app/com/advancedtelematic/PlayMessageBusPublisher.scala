package com.advancedtelematic

import javax.inject.{Inject, Singleton}

import com.advancedtelematic.libats.messaging.{MessageBus, MessageBusPublisher}
import com.advancedtelematic.libats.messaging_datatype.MessageLike
import play.api.Logger

import scala.concurrent.ExecutionContext
import _root_.akka.actor.ActorSystem

@Singleton
class PlayMessageBusPublisher @Inject()(implicit system: ActorSystem) extends MessageBusPublisher {

  private val log = Logger(this.getClass)

  @volatile lazy val messageBus =
    MessageBus.publisher(system, system.settings.config) match {
      case Right(v) => v
      case Left(error) =>
        log.error("Could not initialize message bus publisher", error)
        MessageBusPublisher.ignore
    }

  override def publish[T](msg: T)(implicit ex: ExecutionContext, messageLike: MessageLike[T]) =
    messageBus.publish(msg)
}
