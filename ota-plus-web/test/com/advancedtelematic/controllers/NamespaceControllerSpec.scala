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

class NamespaceControllerSpec extends PlaySpec
  with GuiceOneAppPerSuite
  with BeforeAndAfterAll
  with MockWSHelpers
  with Results {

  val userProfileUri = "http://user-profile.com"
  val userAllowedNamespace = "another|namespace"

  val mock = MockWS {
    case (GET, url) if s"$userProfileUri/api/v1/users/.*/organizations".r.findFirstIn(url).isDefined =>
      Action(_ => Ok(Json.arr(
        Json.obj(
          "namespace" -> userAllowedNamespace,
          "name" -> "My Organization",
          "isCreator" -> true
        ))))
  }

  implicit override lazy val app: play.api.Application =
    new GuiceApplicationBuilder()
      .configure("userprofile.uri" -> userProfileUri)
      .overrides(bind[WSClient].to(mock))
      .overrides(bind[ZipkinTraceServiceLike].to(new NoOpZipkinTraceService))
      .build()

  "Switching namespace" should {
    val controller = app.injector.instanceOf[NamespaceController]

    "redirect to index and update the session namespace" in {
      val request =
        FakeRequest("GET", s"/organizations/$userAllowedNamespace/index").withAuthSession(userAllowedNamespace)
      val result = call(controller.switchNamespace(Namespace(userAllowedNamespace)), request)
      status(result) mustBe SEE_OTHER
      redirectLocation(result) mustBe Some("/")
      session(result).apply("namespace") mustBe userAllowedNamespace
    }
  }

}
