package com.advancedtelematic.login

import mockws.MockWS
import org.scalatest.BeforeAndAfterAll
import org.scalatestplus.play._
import play.api.Application
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.libs.json.Json
import play.api.libs.ws.WSClient
import play.api.mvc.Action
import play.api.test.FakeRequest
import play.api.test.Helpers._

class LoginSpec extends PlaySpec with OneAppPerSuite with BeforeAndAfterAll {

  import play.api.inject.bind
  import play.api.mvc.Results._

  implicit override lazy val app: Application = new GuiceApplicationBuilder()
    .overrides(bind[WSClient].toInstance(mockClient))
    // the following 2 entries should come from the environment in production
    .configure("authplus.client_id" -> "")
    .configure("authplus.secret"    -> "")
    .build()

  lazy val auth0Config: Auth0Config = Auth0Config(app.configuration).get

  lazy val tokenEndpointUrl: String = s"https://${auth0Config.domain}/oauth/token"

  lazy val userInfoUrl: String = s"https://${auth0Config.domain}/userinfo"

  val mockClient = MockWS {
    case ("POST", tokenEndpointUrl) =>
      Action { implicit request =>
        Ok(Json.obj("id_token" -> "IDTOKEN", "access_token" -> "ACCESS_TOKEN"))
      }
    case ("GET", userInfoUrl) =>
      Action { implicit request =>
        Ok(Json.obj("email" -> "email@email.email"))
      }
    case _ =>
      Action {
        NotFound(EmptyContent())
      }
  }

  "Login" should {
    val controller = app.injector.instanceOf[LoginController]

    "set session token" in {
      val req    = FakeRequest("POST", "/?code=AUTHORIZATIONCODE")
      val result = controller.callback()()(req)
      status(result) mustBe SEE_OTHER
      // redirects to login page on correct user data:
      redirectLocation(result) mustBe Some("/")
      val sess = session(result)
      sess.get("access_token") mustBe defined
      sess.get("id_token") mustBe defined
    }
  }

}
