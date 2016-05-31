package org.genivi.webserver.controllers.messaging

import akka.actor.{ActorRef, ActorSystem, Props}
import akka.stream.Materializer
import akka.stream.scaladsl.Source
import com.google.inject.ImplementedBy
import org.genivi.sota.data.Device
import org.genivi.sota.messaging.Messages.DeviceSeenMessage

@ImplementedBy(classOf[ActorPublisherBusListener])
trait MessageBusConnection {
  def getSource(system: ActorSystem)(implicit mat: Materializer)
      : (Device.Id => Source[DeviceSeenMessage, _])
}

class ActorPublisherBusListener extends MessageBusConnection {
  def getSource(system: ActorSystem)(implicit mat: Materializer)
      : (Device.Id => Source[DeviceSeenMessage, ActorRef]) = {
    device => Source.actorPublisher(Props(new DeviceSeenActor(device)))
  }
}
