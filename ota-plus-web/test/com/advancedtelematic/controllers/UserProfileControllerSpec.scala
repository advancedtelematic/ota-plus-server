package com.advancedtelematic.controllers

import brave.play.ZipkinTraceServiceLike
import com.advancedtelematic.auth.oidc.ProviderMetadata
import com.advancedtelematic.controllers.AuthUtils._
import com.advancedtelematic.provisioning.NoOpZipkinTraceService
import mockws.{MockWS, MockWSHelpers}
import org.scalatest.BeforeAndAfterAll
import org.scalatestplus.play.PlaySpec
import org.scalatestplus.play.guice.GuiceOneAppPerSuite
import play.api.Configuration
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.libs.ws.WSClient
import play.api.test.FakeRequest
import play.api.test.Helpers.{call, status, _}

class UserProfileControllerSpec extends PlaySpec with GuiceOneAppPerSuite with MockWSHelpers with BeforeAndAfterAll {
  import play.api.inject.bind
  import play.api.mvc.Results._

  implicit override lazy val app: play.api.Application = new GuiceApplicationBuilder()
    .overrides(bind[WSClient].toInstance(mockClient))
    .overrides(bind[ZipkinTraceServiceLike].to(new NoOpZipkinTraceService))
    .build()

  lazy val providerMeta = ProviderMetadata.fromConfig(app.configuration.get[Configuration]("oidc.fallback"))

  val mockClient = MockWS {

    case ("GET", url) if url == providerMeta.userInfoEndpoint =>
      Action { implicit request =>
        TooManyRequests("from auth0")
      }

    case (method, url) =>
      Action {
        NotFound(s"No handler for ' $method $url'")
      }
  }

  "Controller" should {
    val controller = app.injector.instanceOf[UserProfileController]

    "handle auth0 error correctly" in {
      val req = FakeRequest("GET", "/user/profile").withAuthSession("namespace")

      val result = call(controller.getUserProfile, req)
      status(result) mustBe TOO_MANY_REQUESTS
    }

  }

}
