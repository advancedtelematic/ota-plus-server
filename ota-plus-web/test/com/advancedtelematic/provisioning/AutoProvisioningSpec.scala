package com.advancedtelematic.provisioning

import akka.util.ByteString
import java.time.{Instant, LocalDate, ZoneOffset}
import java.time.temporal.ChronoField

import com.advancedtelematic.TokenUtils
import com.advancedtelematic.auth.{AccessToken, TokenVerification}
import com.advancedtelematic.TokenUtils.NoVerification
import org.scalatest.concurrent.ScalaFutures
import org.scalatest.time.{Millis, Seconds, Span}
import org.scalatestplus.play.{OneServerPerSuite, PlaySpec}
import org.scalatestplus.play.guice.GuiceOneServerPerSuite
import play.api.Application
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.libs.json.Json
import play.api.libs.ws.{EmptyBody, WSClient}
import play.api.mvc.{Cookies, Session}
import play.api.test.WsTestClient
import play.filters.csrf.CSRF

class AutoProvisioningSpec extends PlaySpec with GuiceOneServerPerSuite with ScalaFutures {
  import play.api.inject.bind
  import play.api.test.Helpers._

  implicit override lazy val app: Application =
    new GuiceApplicationBuilder()
      .configure("crypt.uri" -> MockCrypt.CryptHost)
      .overrides(bind[WSClient].toInstance(MockCrypt.mockClient))
      .overrides(bind[TokenVerification].to[NoVerification])
      .build()

  implicit val defaultPatience =
    PatienceConfig(timeout = Span(5, Seconds), interval = Span(200, Millis))

  val csrfTokenProvider = app.injector.instanceOf[CSRF.TokenProvider]

  val csrfToken = csrfTokenProvider.generateToken

  def makeSessionCookie(subj: String): String = {
    import com.advancedtelematic.auth.SessionCodecs.AccessTokenFormat
    val session = Session(
      Map(
        "id_token"               -> TokenUtils.identityTokenFor(subj).value,
        "access_token"           -> Json.toJson(AccessToken("XXXX", Instant.now().plusSeconds(3600))).toString(),
        "auth_plus_access_token" -> "",
        "namespace"              -> subj,
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
          .withHttpHeaders("Cookie" -> makeSessionCookie(MockCrypt.TestAccount.name), "Csrf-Token" -> csrfToken)
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
          .withHttpHeaders("Cookie" -> makeSessionCookie("not|registered"), "Csrf-Token" -> csrfToken)
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
          .withHttpHeaders("Cookie" -> makeSessionCookie(MockCrypt.TestAccount.name), "Csrf-Token" -> csrfToken)
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
          .withHttpHeaders("Cookie" -> makeSessionCookie("not_active"), "Csrf-Token" -> csrfToken)
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
          .withHttpHeaders("Cookie" -> makeSessionCookie(MockCrypt.TestAccount.name), "Csrf-Token" -> csrfToken)
          .put(EmptyBody)
          .futureValue
      }
      response.status mustBe OK
      (response.json \ "subject").as[String] mustEqual MockCrypt.TestAccount.name
      (response.json \ "hostName").asOpt[String] mustBe defined
    }
  }

  "POST /api/v1/provisioning/credentials/registration" should {
    "respond with 200 and json" in {
      val untilDate = LocalDate.now().plusDays(2)
      val description = "simple description"
      val response = WsTestClient.withClient { wsClient =>
        wsClient
          .url(s"http://$endpointAddress/api/v1/provisioning/credentials/registration")
          .withFollowRedirects(false)
          .withHttpHeaders("Cookie" -> makeSessionCookie(MockCrypt.TestAccount.name), "Csrf-Token" -> csrfToken)
          .post(Json.obj("description" -> description, "until" -> Json.toJson(untilDate)))
          .futureValue
      }
      response.status mustBe OK
      (response.json \ "id").as[String] mustEqual MockCrypt.TestDeviceUuid
      (response.json \ "description").as[String] mustEqual description
      (response.json \ "validFrom").as[Instant] mustEqual MockCrypt.now
      val validUntilResp = (response.json \ "validUntil").as[Instant].getLong(ChronoField.INSTANT_SECONDS)

      val untilTime = untilDate.plusDays(1).atStartOfDay(ZoneOffset.UTC)
      validUntilResp must be >= untilTime.getLong(ChronoField.INSTANT_SECONDS)
      validUntilResp must be <= untilTime.plusHours(1).getLong(ChronoField.INSTANT_SECONDS)
    }
  }

  "GET /api/v1/provisioning/credentials/registration/uuid" should {
    "respond with 200 and file" in {
      val response = WsTestClient.withClient { wsClient =>
        wsClient
          .url(s"http://$endpointAddress/api/v1/provisioning/credentials/registration/${MockCrypt.TestDeviceUuid}")
          .withFollowRedirects(false)
          .withHttpHeaders("Cookie" -> makeSessionCookie(MockCrypt.TestAccount.name), "Csrf-Token" -> csrfToken)
          .get()
          .futureValue
      }
      response.status mustBe OK
      response.header("Content-Type") mustBe Some("application/x-pkcs12")
      response.bodyAsBytes mustBe ByteString("file-content")
    }
  }
}
