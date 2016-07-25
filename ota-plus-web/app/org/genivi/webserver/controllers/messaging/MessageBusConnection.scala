package org.genivi.webserver.controllers.messaging

import akka.actor.{ActorRef, ActorSystem, Props}
import akka.stream.Materializer
import akka.stream.scaladsl.Source
import com.google.inject.ImplementedBy
import org.genivi.sota.messaging.Messages.{DeviceCreated, DeviceSeen}
import org.genivi.webserver.controllers.messaging.Actors.MessageRelayActor

import scala.reflect.ClassTag

@ImplementedBy(classOf[ActorPublisherBusListener])
trait MessageBusConnection {
  def getDeviceSeenSource(system: ActorSystem)(implicit mat: Materializer): Source[DeviceSeen, _]

  def getDeviceCreatedSource(system: ActorSystem)(implicit mat: Materializer): Source[DeviceCreated, _]
}

class ActorPublisherBusListener extends MessageBusConnection {
  def getDeviceSeenSource(system: ActorSystem)(implicit mat: Materializer): Source[DeviceSeen, ActorRef] =
    Source.actorPublisher(Props(new MessageRelayActor[DeviceSeen]()))

  def getDeviceCreatedSource(system: ActorSystem)(implicit mat: Materializer): Source[DeviceCreated, ActorRef] =
    Source.actorPublisher(Props(new MessageRelayActor[DeviceCreated]()))
}
