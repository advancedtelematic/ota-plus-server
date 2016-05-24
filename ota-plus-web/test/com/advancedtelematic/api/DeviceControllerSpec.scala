package com.advancedtelematic.api

import java.util.UUID

import akka.util.ByteString
import eu.timepit.refined.api.Refined
import mockws.{MockWS, Route}
import org.genivi.sota.data.Vehicle
import org.genivi.webserver.controllers.DeviceController
import org.scalatestplus.play.{OneServerPerSuite, PlaySpec}
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.libs.ws.WSClient
import play.api.mvc._

import play.api.test.FakeRequest
import play.api.test.Helpers._
import play.api.inject.bind

class DeviceControllerSpec extends PlaySpec with OneServerPerSuite with Results {

  val vin: Vehicle.Vin = Refined.unsafeApply("WBAYE4C55ED138164")

  val mockClient = {
    val deviceRegistry = Route {
      case (POST, p) if p == s"http://localhost:8083/api/v1/devices" =>
        Action { Created("Created In Device Registry") }
      case (GET, "http://localhost:8080/api/v1/vehicles") =>
        Action { Ok("Core Search") }
    }

    val resolver = Route {
      case (PUT, p) if p == s"http://localhost:8081/api/v1/vehicles/${vin.get}" =>
        Action { Created("") }
      case (GET, "http://localhost:8081/api/v1/vehicles") =>
        Action { Ok("Resolver Search") }
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

    MockWS(deviceRegistry orElse resolver orElse authPlus)
  }

  val application = new GuiceApplicationBuilder()
    .overrides(bind[WSClient].to(mockClient))
    .build

  val controller = application.injector.instanceOf[DeviceController]

  val emptyRequest = FakeRequest().withBody(RawBuffer(0, ByteString()))

  "DeviceController" should {
    "create forwards request to both core and resolver" in {
      val result = controller.create(vin).apply(emptyRequest)

      status(result) must be(201)
      contentAsString(result) must be("Created In Device Registry")
    }

    "search gets search results from resolver" in {
      val result = controller.search().apply(emptyRequest)

      status(result) must be(200)
      contentAsString(result) must be("Resolver Search")
    }

    "listDeviceAttributes gets results from core" in {
      val result = controller.listDeviceAttributes().apply(emptyRequest)

      status(result) must be(200)
      contentAsString(result) must be("Core Search")
    }
  }
}
