package com.advancedtelematic

import javax.inject.{Inject, Singleton}

import com.advancedtelematic.libats.messaging.{MessageBus, MessageBusPublisher}
import com.advancedtelematic.libats.messaging_datatype.MessageLike

import scala.concurrent.ExecutionContext
import _root_.akka.actor.ActorSystem

@Singleton
class PlayMessageBusPublisher @Inject()(implicit system: ActorSystem) extends MessageBusPublisher {

  @volatile private lazy val messageBus = MessageBus.publisher(system, system.settings.config)

  override def publish[T](msg: T)(implicit ex: ExecutionContext, messageLike: MessageLike[T]) =
    messageBus.publish(msg)
}
