package com.advancedtelematic

import _root_.akka.stream.Materializer
import cats.syntax.show._
import mockws.{MockWS, Route}
import org.genivi.sota.data.Uuid
import org.scalatestplus.play.{OneServerPerSuite, PlaySpec}
import play.api.inject.bind
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.libs.json._
import play.api.libs.ws.WSClient
import play.api.mvc._
import play.api.test.FakeRequest
import play.api.test.Helpers._
import scala.concurrent.Future


class AuthPlusAuthenticationSpec extends PlaySpec with OneServerPerSuite with Results {

  val activeToken = "token.is.valid"
  val inactiveToken = "token.is.invalid"
  val invalidToken = "token.does.not.exist"

  val authPlusUri = "http://auth-plus.com"
  val authPlusIntrospectUri = s"$authPlusUri/introspect"

  val mockClient = MockWS {
    case (POST, `authPlusIntrospectUri`) => Action { request =>
      val result = for {
        params <- request.body.asFormUrlEncoded
        tokens <- params.get("token")
        token <- tokens.headOption
      } yield token match {
        case `activeToken` => Ok(Json.obj("active" -> true))
        case `inactiveToken` => Ok(Json.obj("active" -> false))
        case `invalidToken` => BadRequest("Invalid token")
      }
      result.getOrElse(BadRequest("Missing token"))
    }
  }

  val application = new GuiceApplicationBuilder()
    .configure("authplus.token_verify" -> true)
    .configure("authplus.uri" -> authPlusUri)
    .overrides(bind[WSClient].to(mockClient))
    .build

  implicit val mat = application.injector.instanceOf[Materializer]

  val authAction = application.injector.instanceOf[AuthPlusAuthentication]

  def fakeRoute() : Action[AnyContent] = authAction.AuthenticatedApiAction.async { implicit request =>
    Future.successful(Ok(""))
  }

  implicit class RequestSyntax[A](request: FakeRequest[A]) {
    def withAuthSession(token: String): FakeRequest[A] =
      request.withSession("id_token" -> Tokens.identityTokenFor("test").value, "access_token" -> "", "auth_plus_access_token" -> token, "namespace" -> "")
  }

  "AuthPlusAuthentication" should {
    "accept an active token" in {
      val request = FakeRequest(GET, "/")
        .withAuthSession(activeToken)
      val result = call(fakeRoute(), request)
      status(result) must be(200)
    }

    "reject an inactive token" in {
      val request = FakeRequest(GET, "/")
        .withAuthSession(inactiveToken)
      val result = call(fakeRoute(), request)
      status(result) must be(403)
    }

    "accept an invalid token" in {
      val request = FakeRequest(GET, "/")
        .withAuthSession(invalidToken)
      val result = call(fakeRoute(), request)
      status(result) must be(200)
    }
  }
}
