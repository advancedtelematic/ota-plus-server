package org.genivi.webserver.controllers

import java.util.UUID

import akka.actor.{Actor, ActorRef, Props, Stash}
import akka.event.Logging
import akka.stream.ActorMaterializer
import com.advancedtelematic.ota.common.{MessageBusClient, VehicleSeenMessage}
import com.amazonaws.services.kinesis.clientlibrary.lib.worker.{KinesisClientLibConfiguration, Worker}
import org.genivi.sota.data.Vehicle
import org.genivi.webserver.controllers.MessageBrokerActor.{Start, Subscribe, UnSubscribe}

object MessageBrokerActor {
  def props: Props = Props[MessageBrokerActor]

  case class Subscribe(vin: Vehicle.Vin, sub: ActorRef)
  case class UnSubscribe(vin: Vehicle.Vin, sub: ActorRef)
  case class Start()
}

class MessageBrokerActor extends Stash with Actor {

  implicit val mat = ActorMaterializer()(context)
  val log = Logging(context.system, this)

  type Subscribers = Map[Vehicle.Vin, Set[ActorRef]]

  self ! Start()

  //Need to ensure we have started listening to kinesis asap, so we stash until we are ready
  def receive: Receive = {
    case Start() => initKinesis()
                    unstashAll()
                    context.become(run(Map.empty))
    case _       => stash()
  }

  def run(subs: Subscribers): Receive = {
    case VehicleSeenMessage(vin, sub) => subs.getOrElse(vin, Set()).foreach(a => a ! VehicleSeenMessage(vin, sub))
    case Subscribe(vin, sub)          => context.become(run(subs + (vin -> (subs.getOrElse(vin, Set()) + sub))))
    case UnSubscribe(vin, sub)        => context.become(run(subs + (vin -> (subs.getOrElse(vin, Set()) - sub))))
    case _                            => log.warning("Unknown message received by message broker Actor")
  }

  private def initKinesis() = {
    def credentialsProvider = MessageBusClient.getCredentialsProvider

    val workerId = String.valueOf(UUID.randomUUID())
    val kclConfig =
      new KinesisClientLibConfiguration(MessageBusClient.streamName, MessageBusClient.streamName, credentialsProvider,
        workerId)
        .withRegionName(MessageBusClient.regionName)
        .withCommonClientConfig(MessageBusClient.getClientConfigWithUserAgent)

    val worker = new Worker(new RecordProcessorFactory(context.self), kclConfig)

    try {
      //worker.run() never returns as long as we read from Kinesis,
      //so it must be run in a separate thread.
      //TODO: make this an actor instead of a thread?
      new Thread {
        override def run() {
          log.debug("Starting Kinesis consumer worker")
          worker.run()
        }
      }.start()
    } catch {
      case t:Throwable => log.error("Caught exception when running kinesis worker:" + t)
    }
  }
}
