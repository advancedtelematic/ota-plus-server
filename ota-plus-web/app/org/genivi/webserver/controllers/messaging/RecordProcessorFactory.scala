package org.genivi.webserver.controllers.messaging

import akka.actor.ActorRef
import com.amazonaws.services.kinesis.clientlibrary.interfaces.{IRecordProcessor, IRecordProcessorFactory}

/**
  * This class exists only because the Kinesis API requires such a Factory.
  * @param messageBroker A reference to the Actor responsible for passing messages to
  */
class RecordProcessorFactory(messageBroker: ActorRef) extends IRecordProcessorFactory {

  override def createProcessor(): IRecordProcessor =  {
    new RecordProcessor(messageBroker)
  }
}
