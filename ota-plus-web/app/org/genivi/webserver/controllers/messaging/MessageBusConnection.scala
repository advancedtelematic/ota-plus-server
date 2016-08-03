package org.genivi.webserver.controllers.messaging

import akka.actor.{ActorRef, ActorSystem, Props}
import akka.stream.Materializer
import akka.stream.scaladsl.Source
import com.google.inject.ImplementedBy
import org.genivi.sota.messaging.Messages.{DeviceCreated, DeviceDeleted, DeviceSeen}
import org.genivi.webserver.controllers.messaging.Actors.MessageRelayActor

@ImplementedBy(classOf[ActorPublisherBusListener])
trait MessageBusConnection {
  def getDeviceSeenSource(system: ActorSystem)(implicit mat: Materializer): Source[DeviceSeen, _]

  def getDeviceCreatedSource(system: ActorSystem)(implicit mat: Materializer): Source[DeviceCreated, _]

  def getDeviceDeletedSource(system: ActorSystem)(implicit mat: Materializer): Source[DeviceDeleted, _]
}

class ActorPublisherBusListener extends MessageBusConnection {
  def getDeviceSeenSource(system: ActorSystem)(implicit mat: Materializer): Source[DeviceSeen, ActorRef] =
    Source.actorPublisher(Props(new MessageRelayActor[DeviceSeen]()))

  def getDeviceCreatedSource(system: ActorSystem)(implicit mat: Materializer): Source[DeviceCreated, ActorRef] =
    Source.actorPublisher(Props(new MessageRelayActor[DeviceCreated]()))

  def getDeviceDeletedSource(system: ActorSystem)(implicit mat: Materializer): Source[DeviceDeleted, ActorRef] =
    Source.actorPublisher(Props(new MessageRelayActor[DeviceDeleted]()))
}
