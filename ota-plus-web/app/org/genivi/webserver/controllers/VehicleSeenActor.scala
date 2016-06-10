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

class VehicleSeenActor(messageBroker: ActorRef, vin: Vehicle.Vin) extends ActorPublisher[VehicleSeenMessage] {

  val log = Logging(context.system, this)

  override def preStart(): Unit = {
    messageBroker ! Subscribe(vin, context.self)
    //If KinesisActor terminates, this actor cannot perform its function,
    //so we ensure this actor dies in that case
    context.watch(messageBroker)
  }

  def receive: Receive = {
    case Request(_)                      => //nothing to do here, demand is updated automatically
    case Cancel                          => messageBroker! UnSubscribe(vin, self)
                                            context.stop(self) //onCompleteThenStop() might be better here
    case VehicleSeenMessage(_, lastSeen) => if(isActive && (totalDemand > 0)) {
                                              onNext(VehicleSeenMessage(vin, lastSeen))
                                            } else if(totalDemand <= 0) {
                                              //This actor should always have totalDemand > 0, so log an error here
                                              log.error("No demand for messages, dropping message")
                                            }
    case _                               => log.error("Unknown message received")
  }

}
