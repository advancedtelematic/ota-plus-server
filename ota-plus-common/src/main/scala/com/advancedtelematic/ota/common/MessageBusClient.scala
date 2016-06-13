package com.advancedtelematic.ota.common

import java.nio.ByteBuffer

import com.amazonaws.auth.AWSCredentialsProvider
import com.amazonaws.auth.profile.ProfileCredentialsProvider
import com.amazonaws.{AmazonClientException, ClientConfiguration}
import com.amazonaws.services.kinesis.AmazonKinesisClient
import org.genivi.sota.data.Vehicle
import com.amazonaws.services.kinesis.model.PutRecordRequest
import io.circe.generic.auto._
import io.circe.syntax._
import org.genivi.sota.marshalling.CirceMarshallingSupport._
import org.joda.time.DateTime
import org.slf4j.LoggerFactory

import scala.concurrent.Future

case class VehicleSeenMessage(vin: Vehicle.Vin, lastSeen: DateTime)

object MessageBusClient {

  private val vehicleSeenPartitionKey = "VehicleSeen"
  private val defaultShardCount = 1
  val streamName = "coreStream"
  val appName = "ota-plus"
  val regionName = "us-east-1"
  private val version = "1.0.0"
  private implicit val log = LoggerFactory.getLogger(this.getClass)

  val getClientConfigWithUserAgent: ClientConfiguration = {
    val config = new ClientConfiguration
    val userAgent = new StringBuilder(ClientConfiguration.DEFAULT_USER_AGENT)

    // Separate fields of the user agent with a space
    userAgent.append(" ")
    // Append the application name followed by version number of the sample
    userAgent.append(appName)
    userAgent.append("/")
    userAgent.append(version)

    config.setUserAgent(userAgent.toString())
    config
  }

  var kinesisClient: AmazonKinesisClient = new AmazonKinesisClient()
  getCredentialsProvider match {
    case Some(creds) => kinesisClient = new AmazonKinesisClient(creds, getClientConfigWithUserAgent)
      if (kinesisClient.listStreams().getStreamNames.contains(streamName)) {
        kinesisClient.createStream(streamName, defaultShardCount)
      }
    case None        => log.error("failed to create kinesis client due to missing credentials")
  }

  def getCredentialsProvider: Option[AWSCredentialsProvider] ={
    try {
      Some(new ProfileCredentialsProvider("default"))
    } catch {
      case a:AmazonClientException => log.error("Cannot load the credentials from the credential profiles file. " +
                                        "Please make sure that your credentials file is at the correct " +
                                        "location (~/.aws/credentials), and is in valid format." +
                                        a.toString)
                                      None
    }
  }

  def shutdown(): Unit = {
    kinesisClient.shutdown()
  }

  def sendVehicleSeen(vin: Vehicle.Vin): Future[Unit] = {
    val vm = VehicleSeenMessage(vin, DateTime.now())

    val putRecord= new PutRecordRequest()
    putRecord.setStreamName(streamName)
    putRecord.setPartitionKey(vehicleSeenPartitionKey)
    putRecord.setData(ByteBuffer.wrap(vm.asJson.noSpaces.getBytes))

    try {
      kinesisClient.putRecord(putRecord)
      log.trace("Sent vehicle seen message:" + vm)
      Future.successful(())
    } catch {
      case ex @(_:AmazonClientException | _:NullPointerException | _:Throwable) =>
        log.error(s"Error sending record to Amazon Kinesis: ${ex.toString}")
        Future.failed(ex)
    }
  }

}
