package org.genivi.webserver.controllers.messaging

import akka.actor.{ActorRef, ActorSystem}
import akka.stream.{Materializer, OverflowStrategy}
import akka.stream.scaladsl.Source
import com.google.inject.ImplementedBy
import org.genivi.sota.messaging.Messages.{DeviceCreated, DeviceSeen, Message}

import scala.reflect.ClassTag

@ImplementedBy(classOf[MessageBusActorListener])
trait MessageSourceProvider {
  def getDeviceSeenSource(system: ActorSystem)(implicit mat: Materializer): Source[DeviceSeen, _]

  def getDeviceCreatedSource(system: ActorSystem)(implicit mat: Materializer): Source[DeviceCreated, _]
}

class MessageBusActorListener extends MessageSourceProvider {

  def getDeviceSeenSource(system: ActorSystem)(implicit mat: Materializer): Source[DeviceSeen, ActorRef] =
    getSource[DeviceSeen](system)

  def getDeviceCreatedSource(system: ActorSystem)(implicit mat: Materializer): Source[DeviceCreated, ActorRef] =
    getSource[DeviceCreated](system)

  private def getSource[T <: Message](system: ActorSystem)(implicit tag: ClassTag[T]): Source[T, ActorRef] = {
    val MaxBufferSize = 50
    Source.actorRef(MaxBufferSize, OverflowStrategy.dropTail)
      .mapMaterializedValue(r => {
        if (!system.eventStream.subscribe(r, tag.runtimeClass)) {
          throw new IllegalStateException("Failed to subscribe to Akka event bus")
        }
        r
      })
  }

}
