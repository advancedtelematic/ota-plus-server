package org.genivi.webserver.controllers.messaging

import akka.actor.{ActorRef, ActorSystem, Props}
import akka.stream.Materializer
import akka.stream.scaladsl.Source
import com.google.inject.ImplementedBy
import org.genivi.sota.data.{Device, Namespace}
import org.genivi.sota.messaging.Messages.{DeviceCreatedMessage, DeviceSeenMessage}
import org.genivi.webserver.controllers.messaging.Actors.{DeviceCreatedActor, DeviceSeenActor}

@ImplementedBy(classOf[ActorPublisherBusListener])
trait MessageBusConnection {
  def getDeviceSeenSource(system: ActorSystem)(implicit mat: Materializer)
    : Device.Id => Source[DeviceSeenMessage, _]

  def getDeviceCreatedSource(system: ActorSystem)(implicit mat: Materializer)
    : Namespace => Source[DeviceCreatedMessage, _]
}

class ActorPublisherBusListener extends MessageBusConnection {
  def getDeviceSeenSource(system: ActorSystem)(implicit mat: Materializer)
      : (Device.Id => Source[DeviceSeenMessage, ActorRef]) =
    device => Source.actorPublisher(Props(new DeviceSeenActor(device)))

  def getDeviceCreatedSource(system: ActorSystem)(implicit mat: Materializer)
      : Namespace => Source[DeviceCreatedMessage, ActorRef] =
    namespace => Source.actorPublisher(Props(new DeviceCreatedActor(namespace)))
}
