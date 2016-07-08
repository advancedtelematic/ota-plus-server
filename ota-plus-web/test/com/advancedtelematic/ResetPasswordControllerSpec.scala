package com.advancedtelematic

import org.scalatestplus.play.{OneServerPerSuite, PlaySpec}
import play.api.Application
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.mvc.Results.Ok
import play.api.test.FakeRequest
import play.api.test.Helpers._

import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global
import org.genivi.webserver.controllers.ConfigurationException

class ResetPasswordControllerSpec extends PlaySpec with OneServerPerSuite {

  implicit override lazy val app: Application = new GuiceApplicationBuilder().build()

  val controller = app.injector.instanceOf[ResetPasswordController]

  "ResetPasswordController" should {
    "load the email entry form" in {
      val res = controller.forgotPassword(FakeRequest())
      assert(status(res) == OK)
    }

    "load the password entry form" in {
      val res = controller.resetPasswordForm("token")(FakeRequest())
      assert(status(res) == OK)
    }

    "send token without crashing" in {
      try {
        controller.sendEmail("to@mail.com", "token")
      } catch {
        case e: ConfigurationException =>
      }
    }

    "handle reset password error" in {
      val res = controller.handleResetPassword(Future {
        throw new Exception("test exception")
      })
      assert(contentAsString(res) == "test exception")
    }

    "handle reset password success" in {
      val res = controller.handleResetPassword(Future {
        Ok
      })
      assert(status(res) == SEE_OTHER)
    }
  }
}
