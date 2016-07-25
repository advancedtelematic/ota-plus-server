package org.genivi.webserver.controllers.messaging.Actors

import akka.event.Logging
import akka.stream.actor.ActorPublisher
import akka.stream.actor.ActorPublisherMessage.{Cancel, Request}
import org.genivi.sota.data.Namespace
import org.genivi.sota.messaging.Messages.DeviceCreatedMessage

class DeviceCreatedActor(namespace: Namespace) extends ActorPublisher[DeviceCreatedMessage] {

  private[this] val log = Logging(context.system, this)

  override def preStart(): Unit = {
    if(!context.system.eventStream.subscribe(context.self, classOf[DeviceCreatedMessage])) {
      log.error("Failed to subscribe to event bus!")
    }
  }

  def receive: Receive = {
    case Request(_) => //nothing to do here, demand is updated automatically
    case Cancel =>
      context.system.eventStream.unsubscribe(context.self)
      context.stop(self)
    case dcm: DeviceCreatedMessage =>
      if(isActive && (totalDemand > 0) && dcm.namespace.equals(namespace)) {
        onNext(dcm)
      } else if(totalDemand <= 0) {
        //This actor should always have totalDemand > 0, so log an error here
        log.error("No demand for messages, dropping message")
      }
    case _ => log.warning("Unknown message received")
  }

}
