package com.advancedtelematic.controllers

import com.advancedtelematic.TokenUtils
import com.advancedtelematic.auth.OAuthConfig
import com.advancedtelematic.auth.oidc.ProviderMetadata
import mockws.{MockWS, MockWSHelpers}
import org.jose4j.jwk.{JsonWebKey, JsonWebKeySet}
import org.scalatest.BeforeAndAfterAll
import org.scalatestplus.play._
import org.scalatestplus.play.guice.GuiceOneAppPerSuite
import play.api.Configuration
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.libs.json.{Json, JsSuccess}
import play.api.libs.ws.WSClient
import play.api.test.FakeRequest
import play.api.test.Helpers._

class GarageLoginSpec extends PlaySpec with GuiceOneAppPerSuite with MockWSHelpers with BeforeAndAfterAll {

  import play.api.inject.bind
  import play.api.mvc.Results._

  val AuthPlusUri = "http://auth-plus.com"

  implicit override lazy val app: play.api.Application = new GuiceApplicationBuilder()
    .overrides(bind[WSClient].toInstance(mockClient))
    // the following 2 entries should come from the environment in production
    .configure("authplus.client_id" -> "")
    .configure("authplus.secret" -> "")
    .configure("authplus.uri" -> AuthPlusUri)
    .build()

  lazy val auth0Config: OAuthConfig = OAuthConfig(app.configuration)

  lazy val providerMeta = ProviderMetadata.fromConfig(app.configuration.get[Configuration]("oidc.fallback"))

  val secret = TokenUtils.genKeyPair()
  val keyId = "secret"

  import play.api.data._
  import play.api.data.Forms._
  val tokenRequestForm = Form(
    tuple(
      "grant_type" -> nonEmptyText,
      "assertion"  -> nonEmptyText
    )
  )

  lazy val namespace: String = "LoginSpec"

  lazy val idToken: String = TokenUtils.identityTokenFor(namespace, secret.getPrivate, keyId)

  val mockClient = MockWS {
    case ("POST", url) if url == providerMeta.tokenEndpoint =>
      Action(BodyParser.formUrlEncoded) { implicit request =>
        request.body("code").head match {
          case "AUTHORIZATIONCODE" =>
            Ok(
              Json.obj(
                "id_token" -> idToken,
                "access_token" -> TokenUtils.signToken(Json.obj("sub" -> "test"), secret.getPrivate, keyId),
                "expires_in" -> 3600
              )
            )

          case "ERROR" =>
            Forbidden(Json.obj("error" -> "invalid_grant", "error_description" -> "Invalid authorization code"))

          case x =>
            Ok(Json.obj("id_token" -> idToken, "access_token" -> x, "expires_in" -> 3600))
        }
      }

    case ("GET", url) if url == providerMeta.userInfoEndpoint =>
      Action { implicit request =>
        Ok(Json.obj("email" -> "email@email.email"))
      }

    case ("GET", url) if url == providerMeta.jwksUri =>
      val key = JsonWebKey.Factory.newJwk(secret.getPublic)
      key.setKeyId(keyId)
      val jwks = new JsonWebKeySet(key).toJson
      Action(Ok(jwks))

    case (method, url) =>
      Action {
        NotFound(s"No handler for ' $method $url'")
      }
  }

  "Login" should {
    val controller = app.injector.instanceOf[OAuthOidcController]

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

    "set session token" in {
      val req    = FakeRequest("POST", "/?code=AUTHORIZATIONCODE")
      val result = controller.callback()()(req)
      status(result) mustBe SEE_OTHER
      // redirects to login page on correct user data:
      redirectLocation(result) mustBe Some("/")
      val sess = session(result)
      (Json.parse(sess("access_token")) \ "access_token").validate[String] must matchPattern {
        case JsSuccess(_, _) =>
      }
      sess.get("id_token") mustBe Some(idToken)
      sess.get("namespace") mustBe Some(namespace)
    }
  }

}
