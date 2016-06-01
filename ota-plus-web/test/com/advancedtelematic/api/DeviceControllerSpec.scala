package com.advancedtelematic.api

import akka.stream.Materializer
import akka.util.ByteString
import cats.Show
import com.advancedtelematic.ota.device.Devices._
import eu.timepit.refined.api.Refined
import java.util.UUID
import mockws.{MockWS, Route}
import org.genivi.sota.data.{Device, DeviceT}
import org.genivi.webserver.controllers.DeviceController
import org.scalatestplus.play.{OneServerPerSuite, PlaySpec}
import play.api.inject.bind
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.libs.json._
import play.api.libs.ws.WSClient
import play.api.mvc._
import play.api.test.FakeRequest
import play.api.test.Helpers._


class DeviceControllerSpec extends PlaySpec with OneServerPerSuite with Results {

  import Device._

  val device: DeviceT = DeviceT(DeviceName("some device"), Some(DeviceId("WBAYE4C55ED138164")))

  val mockClient = {
    val core = Route {
      case (GET, "http://localhost:8080/api/v1/devices") =>
        Action { Ok("Core Search") }
    }

    val resolver = Route {
      case (PUT, p) if p == s"http://localhost:8081/api/v1/vehicles/${implicitly[Show[DeviceId]].show(device.deviceId.get)}" =>
        Action { Created("") }
      case (GET, "http://localhost:8081/api/v1/vehicles") =>
        Action { Ok("Resolver Search") }
    }

    val deviceRegistry = Route {
      case (POST, p) if p == s"http://localhost:8083/api/v1/devices" =>
        Action { Created("Created In device registry") }
      case (GET, "http://localhost:8080/api/v1/devices") =>
        Action { Ok("Device registry Search") }
    }

    val authPlus = Route {
      case (POST, s) if s.endsWith("/clients") =>
        val json = s"""
            {
              "client_id" : "${UUID.randomUUID()}",
              "registration_client_uri": "http://ats.com",
              "registration_access_token": "something"
            }"""

        Action { Ok(json) }
    }

    MockWS(core orElse resolver orElse deviceRegistry orElse authPlus)
  }

  val application = new GuiceApplicationBuilder()
    .overrides(bind[WSClient].to(mockClient))
    .build

  implicit val mat = application.injector.instanceOf[Materializer]

  val controller = application.injector.instanceOf[DeviceController]

  val emptyRequest = FakeRequest().withBody(RawBuffer(0, ByteString()))

  "DeviceController" should {
    "create forwards request to both device registry and resolver" in {

      val request = FakeRequest(POST, "/").withJsonBody(Json.toJson(device))
      val result = call(controller.create(), request)

      status(result) must be(201)
      contentAsString(result) must be("Created In device registry")
    }

    "listDeviceAttributes gets results from core" in {
      val result = controller.listDeviceAttributes().apply(emptyRequest)

      status(result) must be(200)
      contentAsString(result) must be("Core Search")
    }
  }
}
