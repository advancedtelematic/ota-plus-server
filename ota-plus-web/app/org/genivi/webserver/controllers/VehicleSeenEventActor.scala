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
    case Request => log.debug("Received request message")
                    initKinesis()
                    context.become(run)
    case Cancel => context.stop(self)
  }

  def run: Receive = {
    case vsm:VehicleSeenMessage => onNext(vsm)
                                   log.debug("Received request message")
                                   self ! PoisonPill //we are currently only interested in one message
    case _:Any                  => log.warning("Unknown message received by event Actor")
  }

  private def initKinesis() = {

    log.debug("Initializing Kinesis Actor")
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
      log.debug("Started Kinesis consumer worker")
    } catch {
      case t:Throwable => log.error("Caught exception when running kinesis worker:" + t)
    }
  }

}
