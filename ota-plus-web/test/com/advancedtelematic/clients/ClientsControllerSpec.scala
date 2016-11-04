package com.advancedtelematic.clients

import akka.stream.Materializer
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


class ClientsControllerSpec extends PlaySpec with OneServerPerSuite with Results {

  val userId = "auth0|userid1"
  val clientId = Uuid.generate()
  val clientIds = Seq(clientId.underlying.get)

  val auth0Domain = "auth0test"
  val auth0Url = s"https://$auth0Domain/api/v2/users/$userId"
  def auth0UserMetadata(value: JsValue) = Json.obj("user_metadata" -> value)

  val authPlusUri = "http://localhost:9001/clients"
  val authPlusClientUri = s"$authPlusUri/${clientId.underlying.get}"
  val authPlusClient = Json.obj(
    "client_id" -> clientId.underlying.get,
    "client_name" -> "Test Client",
    "registration_client_uri" -> authPlusClientUri,
    "registration_access_token" -> "something")

  val userIdWithNoClients = "auth0|useridwithnoclients"
  val auth0UrlWithNoClients = s"https://auth0test/api/v2/users/$userIdWithNoClients"

  val mockClient = MockWS {
    case (GET, `auth0Url`) =>
        Action { Ok(auth0UserMetadata(Json.obj("client_ids" -> Json.toJson(clientIds)))) }
    case (PATCH, `auth0Url`) =>
        Action { Ok(auth0UserMetadata(Json.obj("client_ids" -> Json.toJson(clientIds)))) }
    case (GET, `auth0UrlWithNoClients`) =>
        Action { Ok(auth0UserMetadata(Json.obj("no_client_ids" -> ""))) }
    case (PATCH, `auth0UrlWithNoClients`) =>
        Action { Ok(auth0UserMetadata(Json.obj("client_ids" -> Json.toJson(clientIds)))) }
    case (POST, `authPlusUri`) =>
      Action { Ok(authPlusClient) }
    case (GET, `authPlusClientUri`) =>
      Action { Ok(authPlusClient) }
    case (GET, path) =>
      Action { NotFound }
  }

  val application = new GuiceApplicationBuilder()
    .configure("auth0.domain" -> auth0Domain)
    .overrides(bind[WSClient].to(mockClient))
    .build

  implicit val mat = application.injector.instanceOf[Materializer]

  val controller = application.injector.instanceOf[ClientsController]

  implicit class RequestSyntax[A](request: FakeRequest[A]) {
    def withAuthSession(ns: String): FakeRequest[A] =
      request.withSession("id_token" -> "", "access_token" -> "", "auth_plus_access_token" -> "", "namespace" -> ns)
  }

  "ClientsController" should {
    "create a client" in {
      val request = FakeRequest(POST, "/")
        .withAuthSession(userIdWithNoClients)
        .withBody(Json.obj("client_name" -> "Test Client"))
      val result = call(controller.createClient(), request)

      status(result) must be(201)
      contentAsJson(result).as[Seq[String]] must be(clientIds)
    }

    "return info for a valid clientId" in {
      val request = FakeRequest(POST, "/").withAuthSession(userId)
      val result = call(controller.getClient(clientId), request)

      status(result) must be(200)
      contentAsJson(result) must be(authPlusClient)
    }

    "return 404 for an invalid clientId" in {
      val request = FakeRequest(POST, "/").withAuthSession(userId)
      val result = call(controller.getClient(Uuid.generate()), request)

      status(result) must be(404)
    }

    "return all clients" in {
      val request = FakeRequest(POST, "/").withAuthSession(userId)
      val result = call(controller.getClients(), request)

      status(result) must be(200)
      contentAsJson(result).as[Seq[JsValue]] must be(Seq(authPlusClient))
    }

    "return no clients for user with no clients" in {
      val request = FakeRequest(POST, "/").withAuthSession(userIdWithNoClients)
      val result = call(controller.getClients(), request)

      status(result) must be(200)
      contentAsJson(result).as[Seq[JsValue]] must be(Seq.empty)
    }
  }
}

