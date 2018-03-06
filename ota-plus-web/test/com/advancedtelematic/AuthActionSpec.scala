package com.advancedtelematic

import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.UUID

import _root_.akka.stream.Materializer
import com.advancedtelematic.auth.{AccessTokenBuilder, ApiAuthAction, SessionCodecs}
import org.scalatestplus.play.PlaySpec
import org.scalatestplus.play.guice.GuiceOneServerPerSuite
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.libs.json._
import play.api.mvc._
import play.api.test.FakeRequest
import play.api.test.Helpers._

import scala.concurrent.Future

class AuthActionSpec extends PlaySpec with GuiceOneServerPerSuite with Results {

  val application = new GuiceApplicationBuilder()
    .configure(
      "oidc.tokenVerification" -> "com.advancedtelematic.auth.oidc.NoTokenIntrospection",
      "authplus.client_id" -> UUID.randomUUID().toString
    )
    .build

  implicit val mat = application.injector.instanceOf[Materializer]

  val namespace = "authActionSpec"
  val jwtSecret = "AyM1SysPpbyDfgZld3umj1qzKObwVMkoqQ-EstJQLr_T-1qS0gZH75aKtMN3Yj0iPS4hcgUuTwjAzZr1Z9CAow"
  private[this] val tokenBuilder = application.injector.instanceOf[AccessTokenBuilder]
  val accessToken = tokenBuilder.mkToken(namespace, Instant.now().plus(5, ChronoUnit.MINUTES), Set.empty)
  val authAction = application.injector.instanceOf[ApiAuthAction]

  def fakeRoute() : Action[AnyContent] = authAction.async { implicit request =>
    Future.successful(Ok(""))
  }

  implicit class RequestSyntax[A](request: FakeRequest[A]) {
    def withAuthSession(): FakeRequest[A] =
      request.withSession(
        "id_token" -> TokenUtils.identityTokenFor("test"),
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
