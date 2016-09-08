package com.advancedtelematic.ota.Messages

import akka.actor.{ActorLogging, PoisonPill, Props}
import akka.stream.actor.ActorSubscriberMessage.{OnComplete, OnError, OnNext}
import akka.stream.actor.{ActorSubscriber, RequestStrategy, WatermarkRequestStrategy}
import org.genivi.sota.messaging.Messages.{Message, MessageLike}
import org.genivi.sota.messaging.daemon.MessageBusListenerActor
import scala.reflect.runtime.universe._

class WebMessageBusListenerActor[T <: Message]()(implicit ml: MessageLike[T], tt: TypeTag[T])
  extends ActorSubscriber with ActorLogging {

  override protected def requestStrategy: RequestStrategy = WatermarkRequestStrategy(1024)

  implicit val ec = context.dispatcher

  override def receive: Receive = {
    case OnNext(e) if ml.tag.runtimeClass.isInstance(e) =>
      val msg = e.asInstanceOf[T]
      log.info(s"Got message ${ml.streamName} - ${ml.id(msg)} publishing to Akka EventStream")
      context.system.eventStream.publish(msg)

    case OnComplete =>
      log.info(s"${context.self.path.name} Upstream completed")
      self ! PoisonPill

    case OnError(ex) =>
      log.info(s"Error from upstream: ${ex.getMessage}")
      throw ex
  }
}

object WebMessageBusListenerActor {
  def props[T <: Message](implicit ml: MessageLike[T], tt: TypeTag[T]): Props =
    MessageBusListenerActor.props[T](Props(new WebMessageBusListenerActor[T]()))
}
