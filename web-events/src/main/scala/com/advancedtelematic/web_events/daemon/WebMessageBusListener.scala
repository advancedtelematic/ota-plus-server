package com.advancedtelematic.web_events.daemon

import akka.Done
import akka.actor.ActorSystem
import org.genivi.sota.messaging.Messages.{BusMessage, MessageLike}
import org.slf4j.LoggerFactory

import scala.concurrent.Future

object WebMessageBusListener {
  private val log = LoggerFactory.getLogger(this.getClass)

  def action[T <: BusMessage](msg: T)(implicit ml: MessageLike[T], system: ActorSystem): Future[Done] = {
    log.info(s"Received ${ml.streamName} -> ${ml.id(msg)}, publishing to akka event stream")
    system.eventStream.publish(msg)
    Future.successful(Done)
  }
}
