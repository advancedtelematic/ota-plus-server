package com.advancedtelematic.ota.Messages

import akka.actor.{ActorLogging, PoisonPill, Props}
import akka.stream.actor.ActorSubscriberMessage.{OnComplete, OnError, OnNext}
import akka.stream.actor.{ActorSubscriber, RequestStrategy, WatermarkRequestStrategy}
import org.genivi.sota.messaging.Messages.{Message, MessageLike}
import org.genivi.sota.messaging.daemon.MessageBusListenerActor

class WebMessageBusListenerActor[T <: Message] extends ActorSubscriber with ActorLogging {

  override protected def requestStrategy: RequestStrategy = WatermarkRequestStrategy(1024)

  implicit val ec = context.dispatcher

  override def receive: Receive = {
    case OnNext(e) =>
      log.info(s"Got message ${e.toString}, publishing to Akka EventStream")
      context.system.eventStream.publish(e.asInstanceOf[T])

    case OnComplete =>
      log.info(s"${context.self.path.name} Upstream completed")
      self ! PoisonPill

    case OnError(ex) =>
      log.info(s"Error from upstream: ${ex.getMessage}")
      throw ex
  }
}

object WebMessageBusListenerActor {
  def props[T <: Message](implicit ml: MessageLike[T]): Props =
    MessageBusListenerActor.props[T](Props(classOf[WebMessageBusListenerActor[T]]))
}
