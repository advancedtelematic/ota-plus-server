package org.genivi.webserver.controllers

import java.util.UUID

import akka.actor.{PoisonPill, Props}
import akka.event.Logging
import akka.stream.ActorMaterializer
import akka.stream.actor.ActorPublisher
import akka.stream.actor.ActorPublisherMessage.{Cancel, Request}
import com.advancedtelematic.ota.common.{MessageBusClient, VehicleSeenMessage}
import com.amazonaws.services.kinesis.clientlibrary.lib.worker.{KinesisClientLibConfiguration, Worker}

object VehicleSeenEventActor {
  def props: Props = Props[VehicleSeenEventActor]
}

class VehicleSeenEventActor extends ActorPublisher[VehicleSeenMessage] {

  implicit val mat = ActorMaterializer()(context)

  val log = Logging(context.system, this)

  def receive: Receive = {
    case Request => initKinesis();run
    case Cancel => context.stop(self)
  }

  def run: Receive = {
    case vsm:VehicleSeenMessage => onNext(vsm)
                                   self ! PoisonPill //we are currently only interested in one message
    case _:Any                  => log.warning("Unknown message received by event Actor")
  }

  private def initKinesis() = {

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
      worker.run()
    } catch {
      case t:Throwable => log.error("Caught exception when running kinesis worker:" + t)
    }
  }

}
