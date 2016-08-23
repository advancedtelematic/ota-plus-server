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
import com.advancedtelematic.ota.Messages.MessageWriters._
import eu.timepit.refined.api.Refined
import org.genivi.sota.data.Device.{DeviceName, DeviceType}
import org.genivi.sota.data.{Device, Namespace, PackageId}
import org.genivi.sota.messaging.Messages.{DeviceCreated, DeviceDeleted, DeviceSeen, MessageLike, PackageCreated, UpdateSpec}
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
  val deviceSeenMessage = DeviceSeen(deviceId, lastSeen)
  val deviceName = DeviceName("testDevice")
  val namespace = Namespace("default")
  val invalidNamespace = Namespace("invalid")
  val deviceIdOpt = Some(Device.DeviceId(deviceUUID))
  val deviceType = DeviceType.Vehicle
  val packageId = PackageId(Refined.unsafeApply("ghc"), Refined.unsafeApply("1.0.0"))
  val deviceCreatedMessage = DeviceCreated(namespace, deviceName, deviceIdOpt, deviceType)
  val deviceDeletedMessage = DeviceDeleted(namespace, deviceId)
  val updateSpecMessage = UpdateSpec(namespace, deviceId, packageId, "Finished")
  val packageCreatedMessage = PackageCreated(namespace, packageId, Some("description"), Some("ghc"), None, "/root/")
}

class EventControllerSpec extends PlaySpec with OneServerPerSuite with Results {

  protected def getDeviceSeenResponse(msg: DeviceSeen): String = {
    "<html><body><script type=\"text/javascript\">parent.deviceSeen(" + Json.toJson(msg) + ");</script>"
  }

  protected def getDeviceCreatedResponse(msg: DeviceCreated): String = {
    "<html><body><script type=\"text/javascript\">parent.deviceCreated(" + Json.toJson(msg) + ");</script>"
  }

  protected def getDeviceDeletedResponse(msg: DeviceDeleted): String = {
    "<html><body><script type=\"text/javascript\">parent.deviceDeleted(" + Json.toJson(msg) + ");</script>"
  }

  protected def getPackageCreatedResponse(msg: PackageCreated): String = {
    "<html><body><script type=\"text/javascript\">parent.packageCreated(" + Json.toJson(msg) + ");</script>"
  }

  protected def getUpdateSpecResponse(msg: UpdateSpec): String = {
    "<html><body><script type=\"text/javascript\">parent.updateSpec(" + Json.toJson(msg) + ");</script>"
  }

  val mockMsgSrc = new MessageSourceProvider {
    override def getSource[T]()(implicit system: ActorSystem, messageLike: MessageLike[T]): Source[T, _] = {
      if (messageLike.tag.runtimeClass.equals(classOf[DeviceSeen])) {
        Source.single(MessagingData.deviceSeenMessage).asInstanceOf[Source[T, NotUsed]]
      } else if(messageLike.tag.runtimeClass.equals(classOf[DeviceCreated])) {
        Source.single(MessagingData.deviceCreatedMessage).asInstanceOf[Source[T, NotUsed]]
      } else if(messageLike.tag.runtimeClass.equals(classOf[DeviceDeleted])) {
        Source.single(MessagingData.deviceDeletedMessage).asInstanceOf[Source[T, NotUsed]]
      } else if(messageLike.tag.runtimeClass.equals(classOf[UpdateSpec])) {
        Source.single(MessagingData.updateSpecMessage).asInstanceOf[Source[T, NotUsed]]
      } else if(messageLike.tag.runtimeClass.equals(classOf[PackageCreated])) {
        Source.single(MessagingData.packageCreatedMessage).asInstanceOf[Source[T, NotUsed]]
      } else {
        throw new IllegalArgumentException("[test] Event class not supported " +
          s"${messageLike.tag.runtimeClass.getSimpleName}")
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
      val request = FakeRequest(GET, s"/events/devicecreated/${MessagingData.namespace}")
      val result = call(controller.subDeviceCreated(MessagingData.namespace), request)

      status(result) must be(OK)
      contentAsString(result).trim mustBe getDeviceCreatedResponse(MessagingData.deviceCreatedMessage)
    }

    "route DeviceDeleteds from akka bus to client" in {
      val request = FakeRequest(GET, s"/events/devicedeleted/${MessagingData.namespace}")
      val result = call(controller.subDeviceDeleted(MessagingData.namespace), request)

      status(result) must be(OK)
      contentAsString(result).trim mustBe getDeviceDeletedResponse(MessagingData.deviceDeletedMessage)
    }

    "route PackageCreated from akka bus to client" in {
      val request = FakeRequest(GET, s"/events/packagecreated/${MessagingData.namespace}")
      val result = call(controller.subPackageCreated(MessagingData.namespace), request)

      status(result) must be(OK)
      contentAsString(result).trim mustBe getPackageCreatedResponse(MessagingData.packageCreatedMessage)
    }

    "route UpdateSpecs from akka bus to client" in {
      val request = FakeRequest(GET, s"/events/updatespec/${MessagingData.namespace}")
      val result = call(controller.subUpdateSpec(MessagingData.namespace), request)

      status(result) must be(OK)
      contentAsString(result).trim mustBe getUpdateSpecResponse(MessagingData.updateSpecMessage)
    }
  }

}
