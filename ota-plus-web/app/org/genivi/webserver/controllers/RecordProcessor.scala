package org.genivi.webserver.controllers

import java.util

import akka.actor._
import com.advancedtelematic.ota.common.VehicleSeenMessage
import com.amazonaws.services.kinesis.clientlibrary.interfaces.{IRecordProcessor, IRecordProcessorCheckpointer}
import com.amazonaws.services.kinesis.clientlibrary.types.ShutdownReason
import com.amazonaws.services.kinesis.model.Record
import io.circe.generic.auto._
import io.circe.parser._
import org.genivi.sota.marshalling.CirceMarshallingSupport._
import org.slf4j.LoggerFactory
import scala.collection.JavaConversions._

//TODO: can this simply be a lambda that RecordProcessorFactory returns?
class RecordProcessor(messageBroker: ActorRef) extends IRecordProcessor{

  private implicit val log = LoggerFactory.getLogger(this.getClass)

  override def shutdown(checkpointer: IRecordProcessorCheckpointer, reason: ShutdownReason): Unit = {

  }

  override def initialize(shardId: String): Unit = {

  }

  override def processRecords(records: util.List[Record], checkpointer: IRecordProcessorCheckpointer): Unit = {
    for(record <- records) {
      decode[VehicleSeenMessage](record.getData.array.toString)
        .fold(e => log.error("Received unknown Kinesis message:" + e),
              _ => messageBroker ! _)
    }
  }

}
