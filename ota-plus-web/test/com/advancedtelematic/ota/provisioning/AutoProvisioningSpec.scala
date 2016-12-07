package com.advancedtelematic.ota.provisioning

import com.advancedtelematic.Tokens
import org.scalatest.concurrent.ScalaFutures
import org.scalatest.time.{ Millis, Seconds, Span }
import org.scalatestplus.play.{ OneServerPerSuite, PlaySpec }
import play.api.Application
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.libs.json.Json
import play.api.libs.ws.WSClient
import play.api.mvc.Results.EmptyContent
import play.api.mvc.{ Cookies, Session }
import play.api.test.WsTestClient
import play.filters.csrf.CSRF

class AutoProvisioningSpec extends PlaySpec with OneServerPerSuite with ScalaFutures {
  import play.api.inject.bind
  import play.api.test.Helpers._

  implicit override lazy val app: Application =
    new GuiceApplicationBuilder()
      .configure("crypt.host" -> MockCrypt.CryptHost)
      .overrides(bind[WSClient].toInstance(MockCrypt.mockClient))
      .build()

  implicit val defaultPatience =
    PatienceConfig(timeout = Span(5, Seconds), interval = Span(200, Millis))

  val csrfTokenProvider = app.injector.instanceOf[CSRF.TokenProvider]

  val csrfToken = csrfTokenProvider.generateToken

  def makeSessionCookie(subj: String): String = {
    val session = Session(
      Map(
        "id_token"               -> Tokens.identityTokenFor(subj).value,
        "access_token"           -> "",
        "auth_plus_access_token" -> "",
        "namespace"              -> "",
        "csrfToken"              -> csrfToken
      ))
    Cookies.encodeCookieHeader(Seq(Session.encodeAsCookie(session)))
  }

  val endpointAddress = s"localhost:$port"

  "GET /api/v1/provisioning/status" should {
    "respond with 200 and active=true if auto provisioning was activated" in {
      val response = WsTestClient.withClient { wsClient =>
        wsClient
          .url(s"http://$endpointAddress/api/v1/provisioning/status")
          .withFollowRedirects(false)
          .withHeaders("Cookie" -> makeSessionCookie(MockCrypt.TestAccount.name), "Csrf-Token" -> csrfToken)
          .get()
          .futureValue
      }
      response.status mustBe OK
      response.json mustBe Json.obj("active" -> true)
    }

    "respond with 200 and active=false if auto provisioning was not activated" in {
      val response = WsTestClient.withClient { wsClient =>
        wsClient
          .url(s"http://$endpointAddress/api/v1/provisioning/status")
          .withFollowRedirects(false)
          .withHeaders("Cookie" -> makeSessionCookie("not|registered"), "Csrf-Token" -> csrfToken)
          .get()
          .futureValue
      }
      response.status mustBe OK
      response.json mustBe Json.obj("active" -> false)
    }
  }

  "GET /api/v1/provisioning" should {
    "respond with 200 and json if provisioning active" in {
      val response = WsTestClient.withClient { wsClient =>
        wsClient
          .url(s"http://$endpointAddress/api/v1/provisioning")
          .withFollowRedirects(false)
          .withHeaders("Cookie" -> makeSessionCookie(MockCrypt.TestAccount.name), "Csrf-Token" -> csrfToken)
          .get()
          .futureValue
      }
      response.status mustBe OK
      (response.json \ "subject").as[String] mustEqual MockCrypt.TestAccount.name
      (response.json \ "hostName").asOpt[String] mustBe defined
    }

    "respond with 404 and if provisioning is not active" in {
      val response = WsTestClient.withClient { wsClient =>
        wsClient
          .url(s"http://$endpointAddress/api/v1/provisioning")
          .withFollowRedirects(false)
          .withHeaders("Cookie" -> makeSessionCookie("not_active"), "Csrf-Token" -> csrfToken)
          .get()
          .futureValue
      }
      response.status mustBe NOT_FOUND
    }
  }

  "PUT /api/v1/provisioning/activate" should {
    "respond with 200 and json" in {
      val response = WsTestClient.withClient { wsClient =>
        wsClient
          .url(s"http://$endpointAddress/api/v1/provisioning/activate")
          .withFollowRedirects(false)
          .withHeaders("Cookie" -> makeSessionCookie(MockCrypt.TestAccount.name), "Csrf-Token" -> csrfToken)
          .put(EmptyContent())
          .futureValue
      }
      response.status mustBe OK
      (response.json \ "subject").as[String] mustEqual MockCrypt.TestAccount.name
      (response.json \ "hostName").asOpt[String] mustBe defined
    }
  }
}
