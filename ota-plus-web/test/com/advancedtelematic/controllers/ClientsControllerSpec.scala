package com.advancedtelematic.controllers

import java.time.Instant

import akka.stream.Materializer
import com.advancedtelematic.TokenUtils
import com.advancedtelematic.auth.{AccessToken, Tokens, TokenVerification}
import com.advancedtelematic.TokenUtils.NoVerification
import mockws.{MockWS, MockWSHelpers}
import org.genivi.sota.data.Uuid
import org.scalatestplus.play.{OneServerPerSuite, PlaySpec}
import org.scalatestplus.play.guice.GuiceOneServerPerSuite
import play.api.inject.bind
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.libs.json._
import play.api.libs.ws.WSClient
import play.api.mvc._
import play.api.test.FakeRequest
import play.api.test.Helpers._

class ClientsControllerSpec extends PlaySpec with GuiceOneServerPerSuite with MockWSHelpers with Results {

  val userId    = "auth0|userid1"
  val clientId  = Uuid.generate()
  val clientIds = Seq(clientId.underlying.value)

  val auth0Domain = "auth0test"
  val auth0Url    = s"https://$auth0Domain/api/v2/users/$userId"
  def auth0UserMetadata(value: JsValue): JsValue = JsArray()

  val authPlusUri = "http://auth-plus.com"
  val authPlusClientsUri = s"$authPlusUri/clients"
  val authPlusClientUri = s"$authPlusClientsUri/${clientId.underlying.value}"
  val clientInfo = Json.obj(
    "client_id"                 -> clientId.underlying.value,
    "client_name"               -> "Test Client",
    "registration_client_uri"   -> authPlusClientUri,
    "registration_access_token" -> "something")

  val userIdWithNoClients   = "auth0|useridwithnoclients"
  val auth0UrlWithNoClients = s"https://auth0test/api/v2/users/$userIdWithNoClients"

  val userProfileUri = "http://user-profile.com"
  val userApplications = s"$userProfileUri/api/v1/users/${userId}/applications"
  val userNoApplications = s"$userProfileUri/api/v1/users/${userIdWithNoClients}/applications"
  val userNoApplicationsClientId = s"${userNoApplications}/${clientId.underlying.value}"

  val mockClient = MockWS {
    case (POST, `authPlusClientsUri`) =>
      Action { Ok(clientInfo) }
    case (GET, `authPlusClientUri`) =>
      Action { Ok(clientInfo) }
    case (PUT, `userNoApplicationsClientId`) =>
      Action { Ok }
    case (GET, `userApplications`) =>
      Action { Ok(Json.toJson(clientIds)) }
    case (GET, `userNoApplications`) =>
      Action { Ok("[]") }
    case (GET, path) =>
      Action { NotFound }
  }

  val application = new GuiceApplicationBuilder()
    .configure("auth0.domain" -> auth0Domain)
    .configure("authplus.uri" -> authPlusUri)
    .configure("userprofile.uri" -> userProfileUri)
    .overrides(bind[WSClient].to(mockClient))
    .overrides(bind[TokenVerification].to[NoVerification])
    .build

  val controller = application.injector.instanceOf[ClientsController]

  implicit class RequestSyntax[A](request: FakeRequest[A]) {
    def withAuthSession(ns: String): FakeRequest[A] = {
      import com.advancedtelematic.auth.SessionCodecs.AccessTokenFormat
      request.withSession(
        "id_token"               -> TokenUtils.identityTokenFor(ns).value,
        "access_token"           -> Json.toJson(AccessToken("XXXX", Instant.now().plusSeconds(3600))).toString(),
        "auth_plus_access_token" -> "",
        "namespace"              -> ns)
    }
  }

  "ClientsController" should {
    "create a client" in {
      val request = FakeRequest(POST, "/")
        .withAuthSession(userIdWithNoClients)
        .withBody(Json.obj("client_name" -> "Test Client", "scope" -> "https://www.atsgarage.com/api/packages"))
      val result = call(controller.createClient(), request)

      status(result) must be(201)
    }

    "return info for a valid clientId" in {
      val request = FakeRequest(POST, "/").withAuthSession(userId)
      val result  = call(controller.getClient(clientId), request)

      status(result) must be(200)
      contentAsJson(result) must be(clientInfo)
    }

    "return 404 for an invalid clientId" in {
      val request = FakeRequest(POST, "/").withAuthSession(userId)
      val result  = call(controller.getClient(Uuid.generate()), request)

      status(result) must be(404)
    }

    "return all clients" in {
      val request = FakeRequest(POST, "/").withAuthSession(userId)
      val result  = call(controller.getClients(), request)

      status(result) must be(200)
      contentAsJson(result).as[Seq[JsValue]] must be(Seq(clientInfo))
    }

    "return no clients for user with no clients" in {
      val request = FakeRequest(POST, "/").withAuthSession(userIdWithNoClients)
      val result  = call(controller.getClients(), request)

      status(result) must be(200)
      contentAsJson(result).as[Seq[JsValue]] must be(Seq.empty)
    }
  }
}
