package com.advancedtelematic.api

import java.time.Instant

import akka.actor.ActorSystem
import akka.stream.Materializer
import akka.stream.scaladsl.Source
import akka.util.ByteString
import com.advancedtelematic.ota.Messages.Messages._
import eu.timepit.refined.api.Refined
import org.genivi.sota.data.Device.{DeviceName, DeviceType}
import org.genivi.sota.data.{Device, Namespace}
import org.genivi.sota.messaging.Messages.{DeviceCreated, DeviceSeen}
import org.genivi.webserver.controllers.EventController
import org.genivi.webserver.controllers.messaging.MessageSourceProvider
import org.scalatestplus.play.{OneServerPerSuite, PlaySpec}
import play.api.inject.bind
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.libs.json._
import play.api.mvc._
import play.api.test.FakeRequest
import play.api.test.Helpers._

object MessagingData {
  val deviceUUID = "77a1888b-9bc8-4673-8f23-a51240303db4"
  val nonMatchingDeviceUUID = "99a1888b-9bc8-4673-8f23-a51240303db4"
  val deviceId = Device.Id(Refined.unsafeApply(deviceUUID))
  val nonMatchingDeviceId = Device.Id(Refined.unsafeApply(nonMatchingDeviceUUID))
  val lastSeen = Instant.now()
  val deviceSeenMessage = new DeviceSeen(deviceId, lastSeen)
  val deviceName = DeviceName("testDevice")
  val namespace = Namespace("default")
  val invalidNamespace = Namespace("invalid")
  val deviceIdOpt = Some(Device.DeviceId(deviceUUID))
  val deviceType = DeviceType.Vehicle
  val deviceCreatedMessage = new DeviceCreated(namespace, deviceName, deviceIdOpt, deviceType)
}

class EventControllerSpec extends PlaySpec with OneServerPerSuite with Results {

  protected def getDeviceSeenResponse(msg: DeviceSeen): String = {
    "<html><body><script type=\"text/javascript\">parent.deviceSeen(" + Json.toJson(msg) + ");</script>"
  }

  protected def getDeviceCreatedResponse(msg: DeviceCreated): String = {
    "<html><body><script type=\"text/javascript\">parent.deviceCreated(" + Json.toJson(msg) + ");</script>"
  }

  val mockMsgSrc = new MessageSourceProvider {
    def getDeviceSeenSource(system: ActorSystem)(implicit mat: Materializer) =
      Source.single(MessagingData.deviceSeenMessage)

    def getDeviceCreatedSource(system: ActorSystem)(implicit mat: Materializer) =
      Source.single(MessagingData.deviceCreatedMessage)
  }

  val application = new GuiceApplicationBuilder()
    .overrides(bind[MessageSourceProvider].to(mockMsgSrc))
    .build

  implicit val mat = application.injector.instanceOf[Materializer]

  val controller = application.injector.instanceOf[EventController]

  val emptyRequest = FakeRequest().withBody(RawBuffer(0, ByteString()))

  "EventController" should {
    "route DeviceSeens from akka bus to client" in {
      val request = FakeRequest(GET, s"/events/devices/${MessagingData.deviceUUID}")
      val result = call(controller.subDeviceSeen(MessagingData.deviceId), request)

      status(result) must be(OK)
      contentAsString(result).trim mustBe getDeviceSeenResponse(MessagingData.deviceSeenMessage)
    }

    "route DeviceCreateds from akka bus to client" in {
      val request = FakeRequest(GET, s"/events/devices/${MessagingData.namespace}")
      val result = call(controller.subDeviceCreated(MessagingData.namespace), request)

      status(result) must be(OK)
      contentAsString(result).trim mustBe getDeviceCreatedResponse(MessagingData.deviceCreatedMessage)
    }
  }
}
