package com.advancedtelematic.web_events.http

import akka.NotUsed
import akka.actor.ActorSystem
import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.server.Directives
import akka.http.scaladsl.model.ws.{Message, TextMessage}
import akka.http.scaladsl.testkit.WSProbe
import akka.stream.scaladsl.{Keep, Source}
import akka.stream.scaladsl.{Flow, Sink}
import akka.stream.testkit.scaladsl.{TestSink, TestSource}
import com.advancedtelematic.web_events.daemon.MessageSourceProvider
import com.advancedtelematic.util.{ResourceSpec, WebEventsSpec}
import eu.timepit.refined.api.Refined
import io.circe.generic.auto._
import io.circe.Json
import java.time.Instant
import java.util.UUID
import org.genivi.sota.data.{Device, Namespace, PackageId, Uuid}
import org.genivi.sota.http.AuthedNamespaceScope
import org.genivi.sota.marshalling.CirceMarshallingSupport._
import org.genivi.sota.messaging.Messages.MessageLike
import org.genivi.sota.messaging.Messages.{DeviceCreated, DeviceDeleted, DeviceSeen, PackageCreated,
  PackageBlacklisted, UpdateSpec}
import org.scalatest.time.SpanSugar._
import scala.reflect.ClassTag

import Device.{DeviceName, DeviceId, DeviceType}

object MessagingData {
  val deviceUuid = Uuid(Refined.unsafeApply("77a1888b-9bc8-4673-8f23-a51240303db4"))
  val nonMatchingDeviceUuid = Uuid(Refined.unsafeApply("99a1888b-9bc8-4673-8f23-a51240303db4"))
  val deviceName = DeviceName("testDevice")
  val namespace = Namespace("default")
  val lastSeen = Instant.now()
  val deviceSeenMessage = DeviceSeen(namespace, deviceUuid, lastSeen)
  val deviceId = Some(DeviceId("testVin"))
  val deviceType = DeviceType.Vehicle
  val packageId = PackageId(Refined.unsafeApply("ghc"), Refined.unsafeApply("1.0.0"))
  val packageUuid = UUID.fromString("b82ca6a4-5422-47e0-85d0-8f931006a307")
  val deviceCreatedMessage = DeviceCreated(namespace, deviceUuid, deviceName, deviceId, deviceType)
  val deviceDeletedMessage = DeviceDeleted(namespace, deviceUuid)
  val updateSpecMessage = UpdateSpec(namespace, deviceUuid, packageUuid, "Finished")
  val packageBlacklistedMessage = PackageBlacklisted(namespace, packageId)
  val packageCreatedMessage = PackageCreated(namespace, packageId, Some("description"), Some("ghc"), None)
}

class WebSocketResourceSpec extends WebEventsSpec with ResourceSpec {
  val mockMsgSrc = new MessageSourceProvider {
    override def getSource[T]()(implicit system: ActorSystem, tag: ClassTag[T]): Source[T, _] = {
      def is[M <: AnyRef : Manifest] = tag.runtimeClass.equals(manifest[M].runtimeClass)

      if (is[DeviceSeen]) {
        Source.single(MessagingData.deviceSeenMessage.asInstanceOf[T])
      } else if(is[DeviceCreated]) {
        Source.single(MessagingData.deviceCreatedMessage.asInstanceOf[T])
      } else if(is[DeviceDeleted]) {
        Source.single(MessagingData.deviceDeletedMessage.asInstanceOf[T])
      } else if(is[UpdateSpec]) {
        Source.single(MessagingData.updateSpecMessage.asInstanceOf[T])
      } else if(is[PackageBlacklisted]) {
        Source.single(MessagingData.packageBlacklistedMessage.asInstanceOf[T])
      } else if(is[PackageCreated]) {
        Source.single(MessagingData.packageCreatedMessage.asInstanceOf[T])
      } else { throw new IllegalArgumentException("[test] Event class not supported " +
                                                 s"${tag.runtimeClass.getSimpleName}")
      }
    }
  }

  def mkJs[T](x: T)(implicit ml: MessageLike[T]): Message = {
    val js = Json.obj("type" -> Json.fromString(ml.tag.runtimeClass.getSimpleName),
                      "event" -> ml.encoder(x))
    TextMessage(js.noSpaces)
  }

  val nsExtractor = Directives.provide(AuthedNamespaceScope(MessagingData.namespace))
  val wsRoute = new WebSocketResource(nsExtractor, mockMsgSrc).route

  test("route web socket to client") {

    val wsClient = WSProbe()

    WS("/events/ws", wsClient.flow) ~> wsRoute ~> check {

      isWebSocketUpgrade shouldEqual true

      val sub = wsClient.inProbe

      sub.request(n = 6)
      sub.expectNextUnordered(mkJs(MessagingData.deviceSeenMessage),
                              mkJs(MessagingData.deviceCreatedMessage),
                              mkJs(MessagingData.deviceDeletedMessage),
                              mkJs(MessagingData.updateSpecMessage),
                              mkJs(MessagingData.packageBlacklistedMessage),
                              mkJs(MessagingData.packageCreatedMessage))

      wsClient.sendCompletion()
      wsClient.expectCompletion()
    }
  }
}
