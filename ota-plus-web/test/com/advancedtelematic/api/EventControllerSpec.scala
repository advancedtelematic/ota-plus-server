/**
  * Copyright: Copyright (C) 2015, Jaguar Land Rover
  * License: MPL-2.0
  */

package com.advancedtelematic.api

import java.time.Instant

import akka.NotUsed
import akka.actor.ActorSystem
import akka.stream.Materializer
import akka.stream.scaladsl.Source
import akka.util.ByteString
import com.advancedtelematic.ota.Messages.Messages._
import eu.timepit.refined.api.Refined
import io.circe.Decoder
import org.genivi.sota.data.Device.{DeviceName, DeviceType}
import org.genivi.sota.data.{Device, Namespace}
import org.genivi.sota.messaging.Messages.{DeviceCreated, DeviceSeen, Message}
import org.genivi.webserver.controllers.EventController
import org.genivi.webserver.controllers.messaging.MessageSourceProvider
import org.scalatestplus.play.{OneServerPerSuite, PlaySpec}
import play.api.inject.bind
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.libs.json._
import play.api.mvc._
import play.api.test.FakeRequest
import play.api.test.Helpers._

import scala.reflect.ClassTag

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
    override def getSource[T <: Message]()(implicit system: ActorSystem,
                                  tag: ClassTag[T],
                                  decoder: Decoder[T]): Source[T, _] = {
      if (tag.runtimeClass.equals(classOf[DeviceSeen])) {
        Source.single(MessagingData.deviceSeenMessage).asInstanceOf[Source[T, NotUsed]]
      } else if(tag.runtimeClass.equals(classOf[DeviceCreated])) {
        Source.single(MessagingData.deviceCreatedMessage).asInstanceOf[Source[T, NotUsed]]
      } else {
        throw new IllegalArgumentException(s"[test] Event class not supported ${tag.runtimeClass.getSimpleName}")
      }
    }
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
