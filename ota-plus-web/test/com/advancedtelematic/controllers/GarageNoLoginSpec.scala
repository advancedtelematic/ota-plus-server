package com.advancedtelematic.controllers

import java.util.Base64

import _root_.akka.stream.Materializer
import com.advancedtelematic.auth.UiAuthAction
import org.scalatestplus.play.PlaySpec
import org.scalatestplus.play.guice.GuiceOneServerPerSuite
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}
import com.advancedtelematic.auth.garage.NoLoginAction
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.test.FakeRequest
import play.api.test.Helpers._

class GarageNoLoginSpec extends PlaySpec with GuiceOneServerPerSuite with Results {
  val application = new GuiceApplicationBuilder()
    .configure("authplus.token" -> "AyM1SysPpbyDfgZld3umj1qzKObwVMkoqQ-EstJQLr_T-1qS0gZH75aKtMN3Yj0iPS4hcgUuTwjAzZr1Z9CAow")
    .configure("oidc.namespace" -> "test-namespace")
    .configure("oidc.loginAction" -> "com.advancedtelematic.auth.garage.NoLoginAction")
    .configure("oidc.tokenVerification" -> "com.advancedtelematic.auth.oidc.NoTokenIntrospection")
    .build

  implicit val mat = application.injector.instanceOf[Materializer]
  implicit val ec = application.injector.instanceOf[ExecutionContext]

  val BodyParser: PlayBodyParsers = PlayBodyParsers()

  val Action: DefaultActionBuilder = DefaultActionBuilder(BodyParser.anyContent)

  val authAction = application.injector.instanceOf[UiAuthAction]

  val loginAction = application.injector.instanceOf[NoLoginAction]

  def fakeRoute() : Action[AnyContent] = authAction.async { implicit request =>
    Future.successful(Ok(""))
  }

  "UiAuthAction" should {
    "redirect to /login when no session exists" in {
      val request = FakeRequest(GET, "/")
      val result = call(fakeRoute(), request)
      status(result) must be(303)

    }

    "accept requests with a valid session" in {
      val request = FakeRequest(GET, "/login")
      val result = call(loginAction, request)
      status(result) must be(303)

      val authenticatedRequest = FakeRequest(GET, "/").withSession(session(result).data.toList:_*)
      val authenticatedResult = call(fakeRoute(), authenticatedRequest)

      status(authenticatedResult) must be(200)
    }
  }

  "NoLoginAction" should {
    "set a session on GET /login" in {
      val request = FakeRequest(GET, "/login")
      val result = call(loginAction, request)
      status(result) must be(303)
      redirectLocation(result) must contain("/")

      session(result).data.keys must contain("id_token")
      session(result).data.keys must contain("namespace")
      session(result).data.keys must contain("access_token")
    }

    "set namespace from basic auth if set" in {
      val auth = Base64.getEncoder.encodeToString("MyNamespace:mypass".getBytes())
      val request = FakeRequest(GET, "/login").withHeaders("Authorization" -> s"Basic $auth")
      val result = call(loginAction, request)

      session(result).data("namespace") must be("MyNamespace")
    }

    "set namespace from config" in {
      val request = FakeRequest(GET, "/login")
      val result = call(loginAction, request)
      status(result) must be(303)
      redirectLocation(result) must contain("/")

      session(result).data("namespace") must be("test-namespace")
    }
  }
}
