package com.advancedtelematic.controllers

import java.io.ByteArrayInputStream
import java.security.Security
import java.time.Instant
import java.util.UUID
import java.util.zip.ZipInputStream

import com.advancedtelematic.TokenUtils
import com.advancedtelematic.TokenUtils.NoVerification
import com.advancedtelematic.api.UnexpectedResponse
import com.advancedtelematic.auth.{AccessToken, TokenVerification}
import com.advancedtelematic.libtuf.crypt.TufCrypto
import com.advancedtelematic.libtuf.data.TufDataType.RsaKeyType
import com.advancedtelematic.provisioning.MockCrypt.{CryptHost, TestAccountJson}
import mockws.MockWSHelpers
import org.bouncycastle.jce.provider.BouncyCastleProvider
import org.scalatest.concurrent.ScalaFutures
import org.scalatestplus.play.PlaySpec
import org.scalatestplus.play.guice.GuiceOneServerPerSuite
import play.api.inject.bind
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.libs.json.{JsObject, Json}
import play.api.libs.ws.WSClient
import play.api.mvc.Results
import play.api.test.FakeRequest
import play.api.test.Helpers._

import scala.io.Source
import AuthUtils._

import scala.concurrent.Await

class ProvisioningControllerSpec extends PlaySpec with GuiceOneServerPerSuite with ScalaFutures with MockWSHelpers
  with Results {

  Security.addProvider(new BouncyCastleProvider)

  val webServer = "http://localhost:80"
  val auth0Domain = "auth0test"
  val authPlusUri = "http://auth-plus.com"
  val userProfileUri = "http://user-profile.com"
  val keyServerUri = "http://localhost:8084"
  val namespace = "ns"

  import mockws.MockWS

  val clientId = UUID.randomUUID().toString

  val testAccountUrl  = s"$CryptHost/accounts/ns"
  val treehubJsonUrl = s"$userProfileUri/api/v1/users/ns/features/treehub"
  val rootJsonUrl = s"$webServer/api/v1/user_repo/root.json"
  val authPlusClientUrl =  s"$authPlusUri/clients/$clientId"
  val treehubDownloadUrl = "http://localhost:9200/api/v1/artifacts/treehub/download"
  val registrationUrl = s"$CryptHost/accounts/ns/credentials/registration"
  val keyPairsUrl = s"$keyServerUri/api/v1/root/repoid/keys/targets/pairs"

  val TreehubFeatureJson = Json.obj("feature" -> "feature",
                                    "client_id" -> clientId,
                                    "enabled" -> true)
  val KeyPairJson = Json.arr(Json.obj("publicKey" -> "bla", "privateKey" -> "bla", "keytype" -> "type"))

  val ClientSecret = Json.obj("client_secret" -> "secret")

  val keyPair = TufCrypto.generateKeyPair(RsaKeyType, 2048)

  import com.advancedtelematic.libtuf.data.TufCodecs.tufKeyPairEncoder

  val mockClient = MockWS {
    case (GET, `testAccountUrl`) =>
      Action(_ => Ok(TestAccountJson))

    case (GET, `treehubJsonUrl`) =>
      Action(_ => Ok(TreehubFeatureJson))

    case (GET, `rootJsonUrl`) =>
      Action { request =>
        request.headers.get("x-ats-namespace").getOrElse(throw new Exception("missing namespace"))
        Ok("{}").withHeaders("x-ats-tuf-repo-id" -> "repoid")
      }

    case (GET, `authPlusClientUrl`) =>
      Action(_ => Ok(ClientSecret))

    case (POST, `treehubDownloadUrl`) =>
      Action(_ => Ok("{}"))

    case (GET, url) if url.startsWith(registrationUrl) =>
      Action(_ => Ok("registration"))

    case (GET, `keyPairsUrl`) =>
      Action(_ => Ok(s"[${tufKeyPairEncoder(keyPair).noSpaces}]"))
  }

  val failingClient = MockWS {
    case _ => Action(_ => InternalServerError)
  }

  val builder = new GuiceApplicationBuilder()
    .configure("auth0.domain" -> auth0Domain)
    .configure("authplus.uri" -> authPlusUri)
    .configure("userprofile.uri" -> userProfileUri)
    .configure("crypt.uri" -> CryptHost)
    .overrides(bind[TokenVerification].to[NoVerification])
  val application = builder.overrides(bind[WSClient].to(mockClient)).build
  val controller = application.injector.instanceOf[ProvisioningController]

  "GET /api/v1/provisioning/credentials/archive" should {
    val request = FakeRequest(GET, "/api/v1/provisioning/credentials/archive").withAuthSession(namespace)

    "return a ZIP archive" in {
      val result = call(controller.downloadCredentialArchive(UUID.randomUUID()), request)
      status(result) mustBe OK
      contentType(result).get mustBe "application/zip"

      val zip = new ZipInputStream(new ByteArrayInputStream(contentAsBytes(result).toArray))

      val nonJsonFiles = Seq("tufrepo.url", "autoprov.url", "autoprov_credentials.p12")
      nonJsonFiles.foreach(zip.getNextEntry.getName mustBe _)

      val jsonFiles = Seq("root.json", "targets.pub", "targets.sec", "treehub.json")
      jsonFiles.foreach { entry =>
        zip.getNextEntry.getName mustBe entry
        Json.parse(Source.fromInputStream(zip).mkString) mustBe a[JsObject]
        zip.closeEntry()
      }

    }

    "throw an exception when a client returns a 500" in {
      val application = builder.overrides(bind[WSClient].to(failingClient)).build
      val controller = application.injector.instanceOf[ProvisioningController]

      try {
        status(call(controller.downloadCredentialArchive(UUID.randomUUID()), request))
        throw new Exception("shouldn't happen")
      } catch {
        case _: UnexpectedResponse =>
      }
    }
  }

}
