package com.advancedtelematic.controllers

import brave.play.ZipkinTraceServiceLike
import com.advancedtelematic.controllers.AuthUtils._
import com.advancedtelematic.libats.data.DataType.Namespace
import com.advancedtelematic.provisioning.NoOpZipkinTraceService
import mockws.{MockWS, MockWSHelpers}
import org.scalatest.BeforeAndAfterAll
import org.scalatestplus.play.PlaySpec
import org.scalatestplus.play.guice.GuiceOneAppPerSuite
import play.api.inject.bind
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.libs.json.Json
import play.api.libs.ws.WSClient
import play.api.mvc.Results
import play.api.test.FakeRequest
import play.api.test.Helpers._

class OrganizationControllerSpec extends PlaySpec
  with GuiceOneAppPerSuite
  with BeforeAndAfterAll
  with MockWSHelpers
  with Results {

  val userProfileUri = "http://user-profile.com"
  val deviceRegistryUri = "http://device-registry.com"
  val userAllowedNamespace = "another|namespace"

  val deviceTags = Json.arr(
    Json.obj("tag_id" -> 0, "tag_name" -> "Some custom field"),
    Json.obj("tag_id" -> 1, "tag_name" -> "Another custom field")
  )

  val mock = MockWS {
    case (GET, url) if s"$userProfileUri/api/v1/users/.*/organizations".r.findFirstIn(url).isDefined =>
      Action(_ => Ok(Json.arr(
        Json.obj(
          "namespace" -> userAllowedNamespace,
          "name" -> "My Organization",
        ))))
    case (PATCH, url) if s"$userProfileUri/api/v1/users/.*/organizations".r.findFirstIn(url).isDefined =>
      Action(_ => NoContent)
    case (GET, url) if url == s"$deviceRegistryUri/api/v1/device_tags" =>
      Action(_ => Ok(deviceTags))
  }

  implicit override lazy val app: play.api.Application =
    new GuiceApplicationBuilder()
      .configure("userprofile.uri" -> userProfileUri)
      .configure("deviceregistry.uri" -> deviceRegistryUri)
      .overrides(bind[WSClient].to(mock))
      .overrides(bind[ZipkinTraceServiceLike].to(new NoOpZipkinTraceService))
      .build()

  "Switching namespace" should {
    val controller = app.injector.instanceOf[OrganizationController]

    "redirect to index and update the session namespace" in {
      val request =
        FakeRequest("GET", s"/organizations/$userAllowedNamespace/index").withAuthSession(userAllowedNamespace)
      val result = call(controller.switchOrganization(Namespace(userAllowedNamespace)), request)
      status(result) mustBe SEE_OTHER
      redirectLocation(result) mustBe Some("/")
      session(result).apply("namespace") mustBe userAllowedNamespace
    }
  }

  "Getting the device tags in an organization" should {
    val controller = app.injector.instanceOf[OrganizationController]

    "fetch the tags" in {
      val request = FakeRequest("GET", "/organization/custom_device_fields").withAuthSession(userAllowedNamespace)
      val result = call(controller.deviceTagsInOrganization, request)
      status(result) mustBe OK
      contentAsJson(result) mustBe deviceTags
    }
  }

}
