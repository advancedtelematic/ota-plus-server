package com.advancedtelematic.controllers

import com.advancedtelematic.Tokens
import mockws.{MockWS, MockWSHelpers}
import org.scalatest.BeforeAndAfterAll
import org.scalatestplus.play._
import org.scalatestplus.play.guice.GuiceOneAppPerSuite
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.libs.json.Json
import play.api.libs.ws.WSClient
import play.api.test.FakeRequest
import play.api.test.Helpers._

class LoginSpec extends PlaySpec with GuiceOneAppPerSuite with MockWSHelpers with BeforeAndAfterAll {

  import play.api.inject.bind
  import play.api.mvc.Results._

  val AuthPlusUri = "http://auth-plus.com"

  implicit override lazy val app: play.api.Application = new GuiceApplicationBuilder()
    .overrides(bind[WSClient].toInstance(mockClient))
    // the following 2 entries should come from the environment in production
    .configure("authplus.client_id" -> "")
    .configure("authplus.secret"    -> "")
    .configure("authplus.uri"      -> AuthPlusUri)
    .build()

  lazy val auth0Config: Auth0Config = Auth0Config(app.configuration).get

  lazy val tokenEndpointUrl: String = s"https://${auth0Config.domain}/oauth/token"

  lazy val userInfoUrl: String = s"https://${auth0Config.domain}/userinfo"

  lazy val delegatEndpointUrl: String = s"https://${auth0Config.domain}/delegation"

  val authPlusTokenEndpoint = s"$AuthPlusUri/token"

  import play.api.data._
  import play.api.data.Forms._
  val tokenRequestForm = Form(
      tuple(
          "grant_type" -> nonEmptyText,
          "assertion"  -> nonEmptyText
      )
  )

  lazy val namespace : String = "LoginSpec"

  lazy val idToken : String = Tokens.identityTokenFor(namespace).value

  val mockClient = MockWS {
    case ("POST", `tokenEndpointUrl`) =>
      Action(BodyParser.tolerantJson) { implicit request =>
        (request.body \ "code").as[String] match {
          case "AUTHORIZATIONCODE" =>
            Ok(Json.obj("id_token" -> idToken, "access_token" -> "AUTH0_ACCESS_TOKEN"))

          case "ERROR" =>
            Forbidden(Json.obj("error" -> "invalid_grant", "error_description" -> "Invalid authorization code"))

          case x =>
            Ok(Json.obj("id_token" -> x, "access_token" -> "AUTH0_ACCESS_TOKEN"))
        }
      }

    case ("POST", `delegatEndpointUrl`) =>
      Action(BodyParser.tolerantJson) { implicit request =>
        (request.body \ "id_token").as[String] match {
          case "DELEGATION_FAIL" =>
            Unauthorized(
                Json.obj("error" -> "invalid_token", "error_description" -> "jwt expired", "statusCode" -> 401))
          case x =>
            Ok(Json.obj("id_token" -> x))
        }
      }

    case ("POST", `authPlusTokenEndpoint`) =>
      Action(BodyParser.form(tokenRequestForm)) { implicit request =>
        request.body match {
          case (_, token) if token == idToken =>
            Ok(Json.obj("access_token" -> "AUTHPLUS_ACCESS_TOKEN"))

          case (_, "AUTHPLUS_FAIL") =>
            BadRequest(Json.obj("error" -> "invalid_grant"))

          case form =>
            BadRequest(s"Auth+ token request not mocked for $form")
        }
      }

    case ("GET", `userInfoUrl`) =>
      Action { implicit request =>
        Ok(Json.obj("email" -> "email@email.email"))
      }
    case (method, url) =>
      Action {
        NotFound(s"No handler for ' $method $url'")
      }
  }

  "Login" should {
    val controller = app.injector.instanceOf[LoginController]

    "redirect to login if neither error or code passed" in {
      val result = controller.callback()()(FakeRequest("GET", "/"))
      status(result) mustBe SEE_OTHER
      redirectLocation(result) mustBe Some("/login")
    }

    "redirect to authorization error if error passed to callback" in {
      val req = FakeRequest("GET", "/callback?error=unauthorized&error_description=Ups")

      val result = controller.callback()()(req)
      status(result) mustBe SEE_OTHER
      redirectLocation(result) mustBe Some("/authorization_error")
    }

    "redirect to login if Auth0 responds with error to the token request" in {
      val req = FakeRequest("GET", "/callback?code=ERROR")

      val result = controller.callback()()(req)
      status(result) mustBe SEE_OTHER
      redirectLocation(result) mustBe Some("/login")
    }

    "redirect to login if delegation token request fails" in {
      val req = FakeRequest("GET", "/callback?code=DELEGATION_FAIL")

      val result = controller.callback()()(req)
      status(result) mustBe SEE_OTHER
      redirectLocation(result) mustBe Some("/login")
    }

    "redirect to login if Auth+ returns an error" in {
      val req = FakeRequest("GET", "/callback?code=AUTHPLUS_FAIL")

      val result = controller.callback()()(req)
      status(result) mustBe SEE_OTHER
      redirectLocation(result) mustBe Some("/login")
    }

    "set session token" in {
      val req    = FakeRequest("POST", "/?code=AUTHORIZATIONCODE")
      val result = controller.callback()()(req)
      status(result) mustBe SEE_OTHER
      // redirects to login page on correct user data:
      redirectLocation(result) mustBe Some("/")
      val sess = session(result)
      sess.get("access_token") mustBe Some("AUTH0_ACCESS_TOKEN")
      sess.get("auth_plus_access_token") mustBe Some("AUTHPLUS_ACCESS_TOKEN")
      sess.get("id_token") mustBe Some(idToken)
      sess.get("namespace") mustBe Some(namespace)
    }
  }

}
