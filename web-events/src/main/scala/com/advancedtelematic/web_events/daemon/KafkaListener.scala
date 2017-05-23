package com.advancedtelematic.web_events.daemon

import akka.actor.{ActorSystem, Props}
import akka.kafka.ConsumerMessage.CommittableMessage
import akka.stream.scaladsl.Source
import akka.{Done, NotUsed}
import com.typesafe.config.Config
import com.advancedtelematic.libats.messaging.Messages.MessageLike
import com.advancedtelematic.libats.messaging.daemon.MessageBusListenerActor
import com.advancedtelematic.libats.messaging.kafka.KafkaClient
import scala.concurrent.{ExecutionContext, Future}

object KafkaListener {
  def props[T](config: Config, action: T => Future[Done])
           (implicit system: ActorSystem, ml: MessageLike[T]): Props = {
    implicit val ec = system.dispatcher

    val source = buildSource(action, kafkaSource(config))
    MessageBusListenerActor.props[T](source)(ml)
  }

  private def kafkaSource[Event](config: Config)
                                (implicit system: ActorSystem,
                                 ml: MessageLike[Event]): Source[CommittableMessage[Array[Byte], Event], NotUsed] =
    KafkaClient.committableSource[Event](config)(ml, system) match {
      case Right(s) => s
      case Left(err) => throw err
    }

  private def buildSource[Event](action: Event => Future[Done],
                                 fromSource: Source[CommittableMessage[Array[Byte], Event],   NotUsed])
                                (implicit ec: ExecutionContext,
                                 system: ActorSystem): Source[Event, NotUsed] = {
    fromSource
      .mapAsync(3) { commitableMsg =>
        val msg = commitableMsg.record.value()
        action(msg).map(_ => commitableMsg)
      }
      .mapAsync(1) { commitableMsg =>
        commitableMsg.committableOffset.commitScaladsl().map(_ => commitableMsg.record.value())
      }
  }
}
