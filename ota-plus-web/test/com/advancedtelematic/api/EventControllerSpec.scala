package com.advancedtelematic.api

import java.time.Instant

import akka.stream.Materializer
import akka.util.ByteString
import akka.actor.ActorSystem
import akka.stream.scaladsl.Source
import eu.timepit.refined.api.Refined
import org.genivi.sota.data.Device
import org.genivi.sota.messaging.Messages.DeviceSeenMessage
import org.genivi.webserver.controllers.EventController
import org.genivi.webserver.controllers.messaging.MessageBusConnection
import org.scalatestplus.play.{OneServerPerSuite, PlaySpec}
import play.api.inject.bind
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.mvc._
import play.api.test.FakeRequest
import play.api.test.Helpers._

object MessagingData {
  val deviceUUID = "77a1888b-9bc8-4673-8f23-a51240303db4"
  val deviceId = Device.Id(Refined.unsafeApply(deviceUUID))
  val lastSeen = Instant.now()
  val deviceSeenMessage = new DeviceSeenMessage(deviceId, lastSeen)
}

class EventControllerSpec extends PlaySpec with OneServerPerSuite with Results {

  protected def getDeviceSeenResponse(deviceUUID: String, lastSeen: String): String = {
    "<html><body><script type=\"text/javascript\">parent.deviceSeen({" +
      s"""\"deviceId\":\"$deviceUUID\",\"lastSeen\":\"$lastSeen\"});</script>"""
  }

  val mockMsgSrc = new MessageBusConnection {
    def getSource(system: ActorSystem)(implicit mat: Materializer)
        : (Device.Id) => Source[DeviceSeenMessage, _] = {
      device => Source.single(MessagingData.deviceSeenMessage)
    }
  }

  val application = new GuiceApplicationBuilder()
    .overrides(bind[MessageBusConnection].to(mockMsgSrc))
    .build

  implicit val mat = application.injector.instanceOf[Materializer]

  val controller = application.injector.instanceOf[EventController]

  val emptyRequest = FakeRequest().withBody(RawBuffer(0, ByteString()))

  "EventController" should {
    "route messages from akka bus to client" in {
      val request = FakeRequest(GET, s"/events/devices/${MessagingData.deviceUUID}")
      val result = call(controller.subDeviceSeen(MessagingData.deviceId), request)

      status(result) must be(OK)
      contentAsString(result).trim mustBe
          getDeviceSeenResponse(MessagingData.deviceUUID, MessagingData.lastSeen.toString)
    }
  }
}
