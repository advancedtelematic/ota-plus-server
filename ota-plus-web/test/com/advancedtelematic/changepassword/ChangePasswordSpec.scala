package com.advancedtelematic.changepassword

import mockws.MockWS
import org.scalatestplus.play.{OneServerPerSuite, PlaySpec}
import play.api.Application
import play.api.inject._
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.libs.ws.WSClient
import play.api.mvc.Results._
import play.api.test.FakeRequest
import play.api.test.Helpers._
import play.api.mvc.Action

class ChangePasswordSpec extends PlaySpec with OneServerPerSuite {
  val mockClient = MockWS {
    case _ =>
      Action {
        Ok
      }
  }

  implicit override lazy val app: Application = new GuiceApplicationBuilder()
    .overrides(bind[WSClient].toInstance(mockClient))
    // the following 2 entries should come from the environment in production
    .configure("authplus.client_id" -> "")
    .configure("authplus.secret" -> "")
    .build()

  val controller = app.injector.instanceOf[ChangePasswordController]

  "ChangePasswordController" should {

    "change password" in {
      val req = FakeRequest().withFormUrlEncodedBody("oldPassword" -> "oldPassword",
        "newPassword" -> "newPassword", "passwordConfirmation" -> "newPassword")
        .withSession("access_token" -> "access_token", "username" -> "username")
      val result = controller.changePassword()(req)
      status(result) mustBe SEE_OTHER
    }

    "fail on different passwordConfirmation" in {
      val req = FakeRequest().withFormUrlEncodedBody("oldPassword" -> "oldPassword",
        "newPassword" -> "newPassword", "passwordConfirmation" -> "differentPassword")
        .withSession("access_token" -> "access_token", "username" -> "username")
      val result = controller.changePassword()(req)
      status(result) mustBe BAD_REQUEST
    }

    "fail on missing username in session" in {
      val req = FakeRequest().withFormUrlEncodedBody("oldPassword" -> "oldPassword",
        "newPassword" -> "newPassword", "passwordConfirmation" -> "newPassword")
        .withSession("access_token" -> "access_token")
      an[NoSuchElementException] should be thrownBy controller.changePassword()(req)
    }

    "fail on missing token in session" in {
      val req = FakeRequest().withFormUrlEncodedBody("oldPassword" -> "oldPassword",
        "newPassword" -> "newPassword", "passwordConfirmation" -> "newPassword")
        .withSession("username" -> "username")
      an[NoSuchElementException] should be thrownBy controller.changePassword()(req)
    }

  }
}
