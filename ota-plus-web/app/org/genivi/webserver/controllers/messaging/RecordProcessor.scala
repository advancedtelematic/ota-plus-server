package org.genivi.webserver.controllers.messaging

import java.util

import akka.actor._
import cats.data.Xor
import com.advancedtelematic.ota.common.VehicleSeenMessage
import com.amazonaws.services.kinesis.clientlibrary.interfaces.{IRecordProcessor, IRecordProcessorCheckpointer}
import com.amazonaws.services.kinesis.clientlibrary.types.ShutdownReason
import com.amazonaws.services.kinesis.model.Record
import io.circe.generic.auto._
import io.circe.parser._
import org.slf4j.LoggerFactory

import scala.collection.JavaConversions._

//TODO: can this simply be a lambda that RecordProcessorFactory returns?
class RecordProcessor(messageBroker: ActorRef) extends IRecordProcessor{

  private implicit val log = LoggerFactory.getLogger(this.getClass)

  override def shutdown(checkpointer: IRecordProcessorCheckpointer, reason: ShutdownReason): Unit = {
    log.trace("Shutting down worker due to reason:" + reason.toString)
  }

  override def initialize(shardId: String): Unit = {
    log.trace("Initializing kinesis worker")
  }

  /* We don't use checkpointer as the messages handled for now can be sent twice */
  override def processRecords(records: util.List[Record], checkpointer: IRecordProcessorCheckpointer): Unit = {
    for(record <- records) {
      io.circe.jawn.parseByteBuffer(record.getData) match {
        case Xor.Left(e)  => log.warn("Received unrecognized record data from Kinesis:" + e.getMessage)
        case Xor.Right(json) => decode[VehicleSeenMessage](json.toString) match {
          case Xor.Left(e)  => log.warn("Received unrecognized json from Kinesis:" + e.getMessage)
          case Xor.Right(vsm) => messageBroker ! vsm
        }
      }
    }
  }

}
