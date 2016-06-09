package org.genivi.webserver.controllers

import java.util.UUID

import akka.actor.{Actor, ActorRef, Props}
import akka.event.Logging
import akka.stream.ActorMaterializer
import com.advancedtelematic.ota.common.{MessageBusClient, VehicleSeenMessage}
import com.amazonaws.services.kinesis.clientlibrary.lib.worker.{KinesisClientLibConfiguration, Worker}
import org.genivi.sota.data.Vehicle
import org.genivi.webserver.controllers.MessageBrokerActor.{Start, Subscriber}

object MessageBrokerActor {
  def props: Props = Props[MessageBrokerActor]

  case class Subscriber(vin: Vehicle.Vin, actor: ActorRef)
  case class Start()
}

class MessageBrokerActor extends Actor {

  implicit val mat = ActorMaterializer()(context)

  val log = Logging(context.system, this)

  def receive: Receive = {
    case Start => log.error("Starting Kinesis Actor")
                  initKinesis()
                  context.become(run(Map.empty))
    case _     => log.error("Unknown message type received by Kinesis Actor")
  }

  def run(subs: Map[Vehicle.Vin, List[ActorRef]]): Receive = {
    case VehicleSeenMessage(vin, lastSeen)  => log.error("Received request message")
                                               subs.get(vin) match {
                                                 case Some(actors) => actors.foreach(
                                                   a => a ! VehicleSeenMessage(vin, lastSeen))
                                                 case None         => log.debug("No subscribers for vehicle seen")
                                               }
    case Subscriber(vin, actorRef)          => log.error("Received new subscriber")
                                               subs.get(vin) match {
                                                 case Some(n) => context.become(run(subs + (vin -> (n :+ actorRef))))
                                                 case None    => context.become(run(subs + (vin -> List(actorRef))))
                                               }
    case _                                  => log.error("Unknown message received by kinesis event Actor")
  }

  private def initKinesis() = {

    log.error("Initializing Kinesis Actor")
    def credentialsProvider = MessageBusClient.getCredentialsProvider

    val workerId = String.valueOf(UUID.randomUUID())
    val kclConfig =
      new KinesisClientLibConfiguration(MessageBusClient.streamName, MessageBusClient.streamName, credentialsProvider,
        workerId)
        .withRegionName(MessageBusClient.regionName)
        .withCommonClientConfig(MessageBusClient.getClientConfigWithUserAgent)

    // Create the KCL worker with the stock trade record processor factory
    val worker = new Worker(new RecordProcessorFactory(context.self), kclConfig)

    try {
      //worker.run() never returns as long as we read from Kinesis,
      //so it must be run in a separate thread.
      //TODO: Should we attempt to shut this thread down gracefully?
      new Thread{
        override def run() {
          log.error("Starting Kinesis consumer worker")
          worker.run()
        }
      }.start()
    } catch {
      case t:Throwable => log.error("Caught exception when running kinesis worker:" + t)
    }
  }

}
