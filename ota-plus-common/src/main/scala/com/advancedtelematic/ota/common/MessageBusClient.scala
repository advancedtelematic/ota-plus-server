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
  val streamName = "coreStream"
  val appName = "ota-plus"
  val regionName = "eu-central-1"
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
    //No choice but to use null here due to Java exception code
    var creds: AWSCredentialsProvider = null
    try {
      creds = new ProfileCredentialsProvider("default")
    } catch {
      case a:AmazonClientException => log.error("Cannot load the credentials from the credential profiles file. " +
                    "Please make sure that your credentials file is at the correct " +
                    "location (~/.aws/credentials), and is in valid format." +
                    a.toString)
    }
    creds
  }

  def init(): Unit = {
    //TODO: Maybe create a new stream here programmatically?
    log.debug("Initiating Kinesis client...")
    kinesisClient = new AmazonKinesisClient(getCredentialsProvider,
      getClientConfigWithUserAgent)
  }

  def shutdown(): Unit = {
    kinesisClient.shutdown()
    //TODO: set kinesisClient to null or otherwise ensure it isn't used for requests after shutdown is called
  }

  def sendVehicleSeen(vin: Vehicle.Vin): Future[Unit] = {
    if(kinesisClient == null) init()

    val vm = VehicleSeenMessage(vin, DateTime.now())

    val putRecord= new PutRecordRequest()
    putRecord.setStreamName(streamName)
    putRecord.setPartitionKey(vehicleSeenPartitionKey)
    putRecord.setData(ByteBuffer.wrap(vm.asJson.noSpaces.getBytes))

    try {
      kinesisClient.putRecord(putRecord)
      log.info("Sent vehicle seen message:" + vm)
    } catch {
      case ex:AmazonClientException => log.error(s"Error sending record to Amazon Kinesis: ${ex.toString}")
      case np:NullPointerException  => log.error(s"kinesisClient is null, have you called init()?: ${np.toString}")
      case t :Throwable             => log.error(s"Unknown exception occurred: ${t.toString}")
    }
    //TODO: Fail if exception thrown
    Future.successful(())
  }

}
