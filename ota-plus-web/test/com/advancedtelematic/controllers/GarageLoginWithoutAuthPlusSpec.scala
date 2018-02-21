package com.advancedtelematic.controllers

import javax.crypto.SecretKey
import javax.crypto.spec.SecretKeySpec

import com.advancedtelematic.TokenUtils
import com.advancedtelematic.auth.{OAuthConfig, UiAuthAction}
import com.advancedtelematic.jwa.HS256
import com.advancedtelematic.jws.Jws
import mockws.{MockWS, MockWSHelpers}
import org.scalatestplus.play._
import org.scalatestplus.play.guice.GuiceOneAppPerSuite
import play.api.inject.bind
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.libs.json.Json
import play.api.libs.ws.WSClient
import com.advancedtelematic.json.signature.JcaSupport._
import com.advancedtelematic.jwa.HmacWithSha._
import org.apache.commons.codec.binary.Base64
import play.api.mvc._
import play.api.test.FakeRequest
import play.api.test.Helpers._

class GarageLoginWithoutAuthPlusSpec extends PlaySpec with GuiceOneAppPerSuite with MockWSHelpers with Results {

  val AuthPlusUri = "http://auth-plus.com"
  val AuthPlusToken = "AyM1SysPpbyDfgZld3umj1qzKObwVMkoqQ-EstJQLr_T-1qS0gZH75aKtMN3Yj0iPS4hcgUuTwjAzZr1Z9CAow"

  val mockClient = MockWS {
    case ("POST", `tokenEndpointUrl`) =>
      Action(BodyParser.tolerantJson) { implicit request =>
        (request.body \ "code").as[String] match {
          case "AUTHORIZATIONCODE" =>
            Ok(Json.obj("id_token" -> idToken, "access_token" -> "ACCESS_TOKEN", "expires_in" -> 3600))

          case "ERROR" =>
            Forbidden(Json.obj("error" -> "invalid_grant", "error_description" -> "Invalid authorization code"))

          case x =>
            Ok(Json.obj("id_token" -> idToken, "access_token" -> x, "expires_in" -> 3600))
        }
      }
  }

  override lazy val app = new GuiceApplicationBuilder()
    .overrides(bind[WSClient].toInstance(mockClient))
    .configure("authplus.token" -> AuthPlusToken)
    .configure("oidc.tokenExchange" -> "com.advancedtelematic.auth.garage.OidcToFakeJwtTokenExchange")
    .build

  private val authAction = app.injector.instanceOf[UiAuthAction]

  lazy val namespace: String = "LoginSpec"
  lazy val idToken: String = TokenUtils.identityTokenFor(namespace).value

  lazy val auth0Config: OAuthConfig = OAuthConfig(app.configuration)

  lazy val tokenEndpointUrl: String = s"https://${auth0Config.domain}/oauth/token"
  val authPlusTokenEndpoint = s"$AuthPlusUri/token"

  private val secretKey: SecretKey = new SecretKeySpec(Base64.decodeBase64(AuthPlusToken), "HMAC")
  private val verifyKeyInfo = HS256.verificationKey(secretKey).right.get
  private val verifier = HS256.verifier(verifyKeyInfo)

  "Login" should {
    val controller = app.injector.instanceOf[OAuthOidcController]

    "set session token" in {
      val req    = FakeRequest("POST", "/?code=AUTHORIZATIONCODE")
      val result = controller.callback()()(req)
      status(result) mustBe SEE_OTHER
      // redirects to login page on correct user data:
      redirectLocation(result) mustBe Some("/")

      val sess = session(result)
      val jws = (Json.parse(sess("access_token")) \ "access_token").validate[String].get
      val sig = Jws.readSignatureCompact(jws).right.get
      val payload = sig.payload.data.map(_.toChar).mkString

      (Json.parse(payload) \ "sub").validate[String].get mustBe "ACCESS_TOKEN"
      verifier(sig) mustBe 'right
      sess.get("id_token") mustBe Some(idToken)
      sess.get("namespace") mustBe Some(namespace)
    }
  }
}
