package com.advancedtelematic.controllers

import brave.play.ZipkinTraceServiceLike
import com.advancedtelematic.TokenUtils
import com.advancedtelematic.auth.oidc.ProviderMetadata
import com.advancedtelematic.provisioning.NoOpZipkinTraceService
import mockws.{MockWS, MockWSHelpers}
import org.jose4j.jwk.{JsonWebKey, JsonWebKeySet}
import org.scalatest.BeforeAndAfterAll
import org.scalatestplus.play._
import org.scalatestplus.play.guice.GuiceOneAppPerSuite
import play.api.Configuration
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.libs.json.{JsSuccess, Json}
import play.api.libs.ws.WSClient
import play.api.mvc.Cookie
import play.api.test.FakeRequest
import play.api.test.Helpers._

class LoginSpec extends PlaySpec with GuiceOneAppPerSuite with MockWSHelpers with BeforeAndAfterAll {

  import play.api.inject.bind
  import play.api.mvc.Results._

  implicit override lazy val app: play.api.Application = new GuiceApplicationBuilder()
    .overrides(bind[WSClient].toInstance(mockClient))
    .overrides(bind[ZipkinTraceServiceLike].to(new NoOpZipkinTraceService))
    .build()

  lazy val providerMeta = ProviderMetadata.fromConfig(app.configuration.get[Configuration]("oidc.fallback"))

  val secret = TokenUtils.genKeyPair()
  val keyId = "secret"
  val defaultToken = TokenUtils.signToken(Json.obj("sub" -> "test"), secret.getPrivate, keyId)
  val rateLimitToken = TokenUtils.signToken(Json.obj("sub" -> "test"), secret.getPrivate, keyId)

  import play.api.data.Forms._
  import play.api.data._
  val tokenRequestForm = Form(
    tuple(
      "grant_type" -> nonEmptyText,
      "assertion"  -> nonEmptyText
    )
  )

  lazy val namespace: String = "Login|Spec"

  lazy val idToken: String = TokenUtils.identityTokenFor(namespace, secret.getPrivate, keyId)

  val mockClient = MockWS {
    case ("POST", url) if url == providerMeta.tokenEndpoint =>
      Action(BodyParser.formUrlEncoded) { implicit request =>
        request.body("code").head match {
          case "AUTHORIZATIONCODE" =>
            code(defaultToken)

          case "RATELIMIT" =>
            code(rateLimitToken)

          case "ERROR" =>
            Forbidden(Json.obj("error" -> "invalid_grant", "error_description" -> "Invalid authorization code"))

          case x =>
            Ok(Json.obj("id_token" -> idToken, "access_token" -> x, "expires_in" -> 3600))
        }
      }

    case ("GET", url) if url == providerMeta.userInfoEndpoint =>
      Action { implicit request =>
        if(request.headers("Authorization").contains(rateLimitToken)) {
          BadGateway
        } else {
          Ok(Json.obj("email" -> "email@email.email"))
        }
      }

    case ("GET", url) if url == providerMeta.jwksUri =>
      val key = JsonWebKey.Factory.newJwk(secret.getPublic)
      key.setKeyId(keyId)
      val jwks = new JsonWebKeySet(key).toJson
      Action(Ok(jwks))

    case ("GET", url) if ".*/api/v1/users/.*/organizations".r.findFirstIn(url).isDefined =>
      Action(_ => Ok(Json.arr(
        Json.obj(
        "namespace" -> namespace,
        "name" -> "My Organization",
      ))))

    case ("GET", url) if ".*/api/v1/users/.*".r.findFirstIn(url).isDefined =>
      Action(_ => Ok(Json.obj(
        "defaultNamespace" -> namespace,
        "userId" -> "abc",
        "isActive" -> true
      )))

    case (method, url) =>
      Action {
        NotFound(s"No handler for ' $method $url'")
      }
  }

  private def code(token: String) =
    Ok(
      Json.obj(
        "id_token" -> idToken,
        "access_token" -> token,
        "expires_in" -> 3600
      )
    )

  "Login" should {
    val controller = app.injector.instanceOf[OAuthOidcController]
    val testState = "SomeTestState"
    val stateCookies = Cookie(Data.StateCookieName, testState)

    "redirect to login if neither error or code passed" in {
      val result = controller.callback()()(FakeRequest("GET", s"/?state=$testState").withCookies(stateCookies))
      status(result) mustBe SEE_OTHER
      redirectLocation(result) mustBe Some("/login")
    }

    "redirect to login if state mismatch" in {
      val result = controller.callback()()(FakeRequest("GET", "/?state=SomeAnotherState").withCookies(stateCookies))
      status(result) mustBe SEE_OTHER
      redirectLocation(result) mustBe Some("/login")
    }

    "redirect to login if state is absent" in {
      val result = controller.callback()()(FakeRequest("GET", "/").withCookies(stateCookies))
      status(result) mustBe SEE_OTHER
      redirectLocation(result) mustBe Some("/login")
    }

    "redirect to authorization error if error passed to callback" in {
      val req = FakeRequest("GET", "/callback?error=unauthorized&error_description=Ups&state=$testState")
        .withCookies(stateCookies)

      val result = controller.callback()()(req)
      status(result) mustBe SEE_OTHER
      redirectLocation(result) mustBe Some("/authorization_error")
    }

    "redirect to login if Auth0 responds with error to the token request" in {
      val req = FakeRequest("GET", s"/callback?code=ERROR&state=$testState").withCookies(stateCookies)

      val result = controller.callback()()(req)
      status(result) mustBe SEE_OTHER
      redirectLocation(result) mustBe Some("/login")
    }

    "set session token" in {
      val req    = FakeRequest("POST", s"/?code=AUTHORIZATIONCODE&state=$testState").withCookies(stateCookies)
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

    "handle rate limiting from Auth0" in {
      val req = FakeRequest("GET", s"/callback?code=RATELIMIT&state=$testState").withCookies(stateCookies)

      val result = controller.callback()()(req)
      status(result) mustBe SEE_OTHER
      redirectLocation(result) mustBe Some("/")
    }
  }

}
