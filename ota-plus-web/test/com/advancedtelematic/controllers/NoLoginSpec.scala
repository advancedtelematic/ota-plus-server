package com.advancedtelematic.controllers

import java.util.Base64

import _root_.akka.stream.Materializer
import com.advancedtelematic.auth.{NoLoginAction, UiAuthAction}
import mockws.MockWS
import org.scalatestplus.play.PlaySpec
import org.scalatestplus.play.guice.GuiceOneServerPerSuite
import play.api.inject.bind
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.libs.json.Json
import play.api.libs.ws.WSClient
import play.api.mvc._
import play.api.test.FakeRequest
import play.api.test.Helpers._

import scala.concurrent.{ExecutionContext, Future}

class NoLoginSpec extends PlaySpec with GuiceOneServerPerSuite with Results {
  private val userProfileUri = "http://user-profile.com"
  private val testNamespace = "test-namespace"

  private val mock = MockWS {
    case (GET, url) if s"$userProfileUri/api/v1/users/(.*)".r.findAllIn(url).nonEmpty =>
      val ns = s"$userProfileUri/api/v1/users/(.*)".r.findAllIn(url).matchData.map(_.group(1)).toSeq.head
      val response =
        if (ns == testNamespace) Ok(Json.obj())
        else NotFound(Json.obj())
      Action(_ => response)

    case (POST, url) if s"$userProfileUri/api/v1/users/(.*)".r.findAllIn(url).nonEmpty =>
      Action(_ => Ok(Json.obj()))
  }

  lazy val application = new GuiceApplicationBuilder()
    .overrides(bind[WSClient].to(mock))
    .configure("userprofile.uri" -> userProfileUri)
    .configure("oauth.token" -> "AyM1SysPpbyDfgZld3umj1qzKObwVMkoqQ-EstJQLr_T-1qS0gZH75aKtMN3Yj0iPS4hcgUuTwjAzZr1Z9CAow")
    .configure("oidc.namespace" -> testNamespace)
    .configure("oidc.loginAction" -> "com.advancedtelematic.auth.NoLoginAction")
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

    "set namespace from config" in {
      val request = FakeRequest(GET, "/login")
      val result = call(loginAction, request)
      status(result) must be(303)
      redirectLocation(result) must contain("/")

      session(result).data("namespace") mustBe testNamespace
    }
  }
}
