package com.advancedtelematic.web_events.daemon

import akka.actor.ActorSystem
import akka.stream.OverflowStrategy
import akka.stream.scaladsl.Source

import scala.reflect.ClassTag

trait MessageSourceProvider {
  def getSource[T]()(implicit system: ActorSystem, tag: ClassTag[T]): Source[T, _]
}

class EventBusActorListener extends MessageSourceProvider {
  def getSource[T]()(implicit system: ActorSystem, tag: ClassTag[T]): Source[T, _] = {
    val bufferSize = 888
    Source.actorRef[T](bufferSize, OverflowStrategy.dropNew).mapMaterializedValue { ref =>
      if(system.eventStream.subscribe(ref, tag.runtimeClass)) {
        system.log.info(s"Successfully subscribed to ${tag.runtimeClass.getSimpleName} events")
      } else {
        system.log.error(s"Failed to subscribe to Akka EventBus for message type ${tag.runtimeClass.getSimpleName}")
      }
      ref
    }
  }
}
