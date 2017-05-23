package com.advancedtelematic.web_events.http

import java.time.Instant
import java.util.UUID
import javax.crypto.SecretKey
import javax.crypto.spec.SecretKeySpec

import akka.actor.ActorSystem
import akka.http.scaladsl.model.headers.BasicHttpCredentials
import akka.http.scaladsl.model.ws.{Message, TextMessage}
import akka.http.scaladsl.testkit.WSProbe
import akka.stream.scaladsl.Source
import com.advancedtelematic.libats.messaging.Messages.MessageLike
import com.advancedtelematic.web_events.Messages
import com.advancedtelematic.json.signature.JcaSupport._
import com.advancedtelematic.jwa.{HS256, Hmac}
import com.advancedtelematic.jwk.KeyInfo
import com.advancedtelematic.jwk.KeyOperations.{Sign, _}
import com.advancedtelematic.jwk.KeyTypes.Octet
import com.advancedtelematic.jws.{JwsPayload, _}
import com.advancedtelematic.jwt.{JsonWebToken, _}
import com.advancedtelematic.util.{ResourceSpec, WebEventsSpec}
import com.advancedtelematic.web_events.daemon.MessageSourceProvider
import com.typesafe.config.ConfigFactory
import io.circe.Json
import org.apache.commons.codec.binary.Base64
import scala.reflect.ClassTag
import shapeless._

class WebSocketResourceSpec extends WebEventsSpec with ResourceSpec with Messages {
  val deviceUuid = "77a1888b-9bc8-4673-8f23-a51240303db4"
  val nonMatchingDeviceUuid = "99a1888b-9bc8-4673-8f23-a51240303db4"
  val deviceName = "testDevice"
  val namespace = "default"
  val lastSeen = Instant.now().toString
  val deviceId = Some("testVin")
  val deviceType = "Vehicle"
  val packageId = "ghc-1.0.0"
  val packageUuid = "b82ca6a4-5422-47e0-85d0-8f931006a307"

  val deviceSeenMessage = DeviceSeen(namespace, deviceUuid, lastSeen)
  val deviceCreatedMessage = DeviceCreated(namespace, deviceUuid, deviceName, deviceId, deviceType, "now")
  val updateSpecMessage = UpdateSpec(namespace, deviceUuid, packageUuid, "Finished", "now")
  val packageBlacklistedMessage = PackageBlacklisted(namespace, packageId, "now")
  val packageCreatedMessage = PackageCreated(namespace, packageId, Some("description"), Some("ghc"), None, "now")

  val mockMsgSrc = new MessageSourceProvider {
    override def getSource[T]()(implicit system: ActorSystem, tag: ClassTag[T]): Source[T, _] = {
      def is[M <: AnyRef : Manifest] = tag.runtimeClass.equals(manifest[M].runtimeClass)

      if (is[DeviceSeen]) {
        Source.single(deviceSeenMessage.asInstanceOf[T])
      } else if(is[DeviceCreated]) {
        Source.single(deviceCreatedMessage.asInstanceOf[T])
      } else if(is[UpdateSpec]) {
        Source.single(updateSpecMessage.asInstanceOf[T])
      } else if(is[PackageBlacklisted]) {
        Source.single(packageBlacklistedMessage.asInstanceOf[T])
      } else if(is[PackageCreated]) {
        Source.single(packageCreatedMessage.asInstanceOf[T])
      } else { throw new IllegalArgumentException("[test] Event class not supported " +
                                                 s"${tag.runtimeClass.getSimpleName}")
      }
    }
  }

  def makeJson[T](x: T)(implicit ml: MessageLike[T]): Message = {
    val js = Json.obj("type" -> Json.fromString(ml.tag.runtimeClass.getSimpleName),
      "event" -> ml.encoder(x))
    TextMessage(js.noSpaces)
  }

  def generateKeyJws: CompactSerialization = {
    val token = JsonWebToken(TokenId("token_id"), Issuer("issuer"), ClientId(UUID.randomUUID()),
      Subject(namespace),
      Audience(Set("audience")),
      Instant.now().minusSeconds(120.longValue()), Instant.now().plusSeconds(120.longValue()),
      Scope(Set("scope")))
    val key = new SecretKeySpec(Base64.decodeBase64(config.getString("auth.token.secret")), "HMAC")
    val potKeyInfo = KeyInfo[SecretKey, Octet, Sign :: Verify :: HNil, Hmac.HS256 :: HNil](key)
    val keyInfo = potKeyInfo.right.get
    val payload = JwsPayload(token)
    CompactSerialization(HS256.withKey(payload, keyInfo))
  }

  val config = ConfigFactory.load()

  val wsRoute = new WebSocketResource(mockMsgSrc).route

  test("route web socket to client") {
    val wsClient = WSProbe()

    val basicAuth = BasicHttpCredentials("bearer", generateKeyJws.value)
    WS("/events/ws", wsClient.flow).addCredentials(basicAuth) ~> wsRoute ~> check {

      isWebSocketUpgrade shouldEqual true

      val sub = wsClient.inProbe

      sub.request(n = 5)
      sub.expectNextUnordered(makeJson(deviceSeenMessage),
                              makeJson(deviceCreatedMessage),
                              makeJson(updateSpecMessage),
                              makeJson(packageBlacklistedMessage),
                              makeJson(packageCreatedMessage))

      wsClient.sendCompletion()
      wsClient.expectCompletion()
    }
  }
}
