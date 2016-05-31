package com.advancedtelematic.ota.common

import java.nio.ByteBuffer

import com.amazonaws.auth.AWSCredentialsProvider
import com.amazonaws.auth.profile.ProfileCredentialsProvider
import com.amazonaws.{AmazonClientException, ClientConfiguration}
import com.amazonaws.services.kinesis.{AmazonKinesis, AmazonKinesisClient}
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
  private val streamName = "coreStream"
  private val appName = "ota-plus"
  private val version = "1.0.0"
  private implicit val log = LoggerFactory.getLogger(this.getClass)

  var kinesisClient: AmazonKinesisClient = null

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

  def getCredentialsProvider: AWSCredentialsProvider ={
    new ProfileCredentialsProvider("default")
  }

  def init():Unit = {
    kinesisClient = new AmazonKinesisClient(getCredentialsProvider,
      getClientConfigWithUserAgent)
  }

  def sendVehicleSeen(vin: Vehicle.Vin): Future[Unit] = {
    val vm = VehicleSeenMessage(vin, DateTime.now())

    val putRecord= new PutRecordRequest()
    putRecord.setStreamName(streamName)
    putRecord.setPartitionKey(vehicleSeenPartitionKey)
    putRecord.setData(ByteBuffer.wrap(vm.asJson.noSpaces.getBytes))

    try {
      kinesisClient.putRecord(putRecord)
    } catch {
      case ex:AmazonClientException => log.error(s"Error sending record to Amazon Kinesis: $ex")
      case np:NullPointerException  => log.error(s"kinesisClient is null, have you called init()?: $np")
      case t :Throwable             => log.error(s"Unknown exception occurred: $t")
    }

    Future.successful(())
  }

}
