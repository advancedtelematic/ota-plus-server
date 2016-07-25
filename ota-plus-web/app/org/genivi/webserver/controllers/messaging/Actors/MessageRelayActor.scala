package org.genivi.webserver.controllers.messaging.Actors

import akka.event.Logging
import akka.stream.actor.ActorPublisher
import akka.stream.actor.ActorPublisherMessage.{Cancel, Request}
import org.genivi.sota.messaging.Messages.Message

import scala.annotation.tailrec
import scala.reflect.ClassTag

class MessageRelayActor[T <: Message](implicit m: ClassTag[T]) extends ActorPublisher[T] {

  private[this] val log = Logging(context.system, this)

  //The buffer code here is copied from
  //http://doc.akka.io/docs/akka/2.4.9-RC1/scala/stream/stream-integrations.html
  val MaxBufferSize = 100
  var buf = Vector.empty[T]

  override def preStart(): Unit = {
    if(!context.system.eventStream.subscribe(context.self, m.runtimeClass)) {
      throw new java.lang.IllegalStateException("Failed to subscribe to Akka event bus")
    }
  }

  def receive: Receive = {
    case Cancel =>
      context.system.eventStream.unsubscribe(context.self)
      context.stop(self)
    case msg: T if buf.size == MaxBufferSize =>
      log.warning("No demand for messages, dropping message")
    case msg: T =>
      if(isActive && (totalDemand > 0)) {
        onNext(msg)
      } else {
        buf :+= msg
        deliverBuf()
      }
    case Request(_) =>
      deliverBuf()
  }

  @tailrec final def deliverBuf(): Unit =
    if (totalDemand > 0) {
      /*
       * totalDemand is a Long and could be larger than
       * what buf.splitAt can accept
       */
      if (totalDemand <= Int.MaxValue) {
        val (use, keep) = buf.splitAt(totalDemand.toInt)
        buf = keep
        use foreach onNext
      } else {
        val (use, keep) = buf.splitAt(Int.MaxValue)
        buf = keep
        use foreach onNext
        deliverBuf()
      }
    }
}
