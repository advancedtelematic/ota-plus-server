package com.advancedtelematic

import java.time.Instant

import _root_.akka.stream.Materializer
import cats.syntax.show._
import com.advancedtelematic.auth.{AccessToken, ApiAuthAction, SessionCodecs}
import com.advancedtelematic.auth.garage.AuthPlusSignature

import org.scalatestplus.play.{OneServerPerSuite, PlaySpec}
import org.scalatestplus.play.guice.GuiceOneServerPerSuite
import play.api.inject.bind
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.libs.json._
import play.api.libs.ws.WSClient
import play.api.mvc._
import play.api.test.FakeRequest
import play.api.test.Helpers._

import scala.concurrent.{ExecutionContext, Future}

class AuthActionSpec extends PlaySpec with GuiceOneServerPerSuite with Results {

  val application = new GuiceApplicationBuilder()
    .configure("oidc.tokenVerification" -> "com.advancedtelematic.auth.oidc.NoTokenIntrospection")
    .build

  implicit val mat = application.injector.instanceOf[Materializer]

  val namespace = "authActionSpec"
  val jwtSecret = "AyM1SysPpbyDfgZld3umj1qzKObwVMkoqQ-EstJQLr_T-1qS0gZH75aKtMN3Yj0iPS4hcgUuTwjAzZr1Z9CAow"
  val accessToken = AuthPlusSignature.fakeSignedToken(jwtSecret, namespace)
  val authAction = application.injector.instanceOf[ApiAuthAction]

  def fakeRoute() : Action[AnyContent] = authAction.async { implicit request =>
    Future.successful(Ok(""))
  }

  implicit class RequestSyntax[A](request: FakeRequest[A]) {
    def withAuthSession(): FakeRequest[A] =
      request.withSession(
        "id_token" -> TokenUtils.identityTokenFor("test").value,
        "access_token" -> Json.stringify(Json.toJson(accessToken)(SessionCodecs.AccessTokenFormat)),
        "namespace" -> namespace
      )
  }

  "ApiAuthAction" should {
    "accept an access token in the session cookie" in {
      val request = FakeRequest(GET, "/")
        .withAuthSession()
      val result = call(fakeRoute(), request)
      status(result) must be(200)
    }

    "accept an access token in Authorization header" in {
      val request = FakeRequest(GET, "/")
        .withHeaders("Authorization" -> s"Bearer ${accessToken.value}")
      val result = call(fakeRoute(), request)
      status(result) must be(200)
    }

    "accept an access token in Authorization header case-insensitive" in {
      val request = FakeRequest(GET, "/")
        .withHeaders("authoriZation" -> s"bearer ${accessToken.value}")
      val result = call(fakeRoute(), request)
      status(result) must be(200)
    }

    "reject an invalid token in Authorization header" in {
      val request = FakeRequest(GET, "/")
        .withHeaders("Authorization" -> "bearer let-me-in")
      val result = call(fakeRoute(), request)
      status(result) must be(403)
    }

    "reject an invalid Authorization header" in {
      val request = FakeRequest(GET, "/")
        .withHeaders("Authorization" -> "bear let-me-in")
      val result = call(fakeRoute(), request)
      status(result) must be(403)
    }

    "reject request without Authorization header or session cookie" in {
      val request = FakeRequest(GET, "/")
      val result = call(fakeRoute(), request)
      status(result) must be(403)
    }
  }
}
