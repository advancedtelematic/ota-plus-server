package org.genivi.webserver.controllers

import akka.actor.{ActorRef, Props}
import akka.event.Logging
import akka.stream.actor.ActorPublisher
import akka.stream.actor.ActorPublisherMessage.{Cancel, Request}
import com.advancedtelematic.ota.common.VehicleSeenMessage
import org.genivi.sota.data.Vehicle
import org.genivi.webserver.controllers.MessageBrokerActor.{Subscribe, UnSubscribe}

object VehicleSeenActor {
  def props(kinesisActor: ActorRef, vin: Vehicle.Vin): Props = Props(new VehicleSeenActor(kinesisActor, vin))

}

class VehicleSeenActor(kinesisActor: ActorRef, vin: Vehicle.Vin) extends ActorPublisher[VehicleSeenMessage] {

  val log = Logging(context.system, this)

  def receive: Receive = {
    case Request(_) => kinesisActor ! Subscribe(vin, context.self)
                       //If KinesisActor terminates, this actor cannot perform its function
                       //thus, we ensure this actor dies in that case
                       context.watch(kinesisActor)
                       context.become(run)
    case Cancel     => context.stop(self)
  }

  def run: Receive = {
    case VehicleSeenMessage(v, lastSeen)  => log.error("Got vehicle seen msg, checking demand")
                                             if(isActive && (totalDemand > 0)) {
                                               log.error("relaying vehicle seen message")
                                               onNext(VehicleSeenMessage(v, lastSeen))
                                               kinesisActor ! UnSubscribe(v, context.self)
                                               onCompleteThenStop()
                                             }
    case _                                => log.error("Unknown message received")
  }

}
