package com.advancedtelematic.controllers

import java.io.ByteArrayInputStream
import java.security.Security
import java.util.UUID
import java.util.zip.ZipInputStream
import java.net.URL

import com.advancedtelematic.TokenUtils.NoVerification
import com.advancedtelematic.api.{RemoteApiError, UnexpectedResponse}
import com.advancedtelematic.auth.TokenVerification
import com.advancedtelematic.libtuf.crypt.TufCrypto
import com.advancedtelematic.libtuf.data.TufDataType.RsaKeyType
import com.advancedtelematic.provisioning.MockCrypt.{CryptHost, TestAccountJson}
import mockws.{MockWSHelpers, Route}
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

class ClientToolControllerSpec extends PlaySpec with GuiceOneServerPerSuite with ScalaFutures with MockWSHelpers
  with Results {

  Security.addProvider(new BouncyCastleProvider)

  val auth0Domain = "auth0test"
  val authPlusUri = "http://auth-plus.com"
  val userProfileUri = "http://user-profile.com"
  val keyServerUri = "http://keyserver"
  val repoServerUri = "http://reposerver"
  val namespaceWithOnlineKeys = "namespace-online"
  val namespaceWithOfflineKeys = "namespace-offline"

  import mockws.MockWS

  val clientId = UUID.randomUUID().toString

  val cryptAccountUrl  = s"$CryptHost/accounts/"
  val registrationUrl = s"$CryptHost/accounts/$namespaceWithOnlineKeys/credentials/registration"

  val authPlusClientUrl =  s"$authPlusUri/clients/$clientId"
  val treehubJsonUrl = s"$userProfileUri/api/v1/users/$namespaceWithOnlineKeys/features/treehub"
  val treehubJsonOfflineUrl = s"$userProfileUri/api/v1/users/$namespaceWithOfflineKeys/features/treehub"

  val rootJsonUrl = s"$repoServerUri/api/v1/user_repo/root.json"
  val keyPairsUrl = s"$keyServerUri/api/v1/root/$namespaceWithOnlineKeys/keys/targets/pairs"
  val keyOfflineUrl = s"$keyServerUri/api/v1/root/$namespaceWithOfflineKeys/keys/targets/pairs"

  val TreehubFeatureJson = Json.obj("feature" -> "feature",
                                    "client_id" -> clientId,
                                    "enabled" -> true)
  val KeyPairJson = Json.arr(Json.obj("publicKey" -> "bla", "privateKey" -> "bla", "keytype" -> "type"))

  val ClientSecret = Json.obj("client_secret" -> "secret")

  val keyPair = TufCrypto.generateKeyPair(RsaKeyType, 2048)

  import com.advancedtelematic.libtuf.data.TufCodecs.tufKeyPairEncoder

  val defaultCryptRoutes = Route {
    case (GET, url) if url.startsWith(cryptAccountUrl) =>
      if (url.contains("/credentials/registration/")) {
        Action(_ => Ok("registration"))
      } else {
        Action(_ => Ok(TestAccountJson))
      }
  }

  val failingCryptRoutes = Route {
    case (GET, url) if url.startsWith(cryptAccountUrl) =>
      if (url.contains("/credentials/registration/")) {
        Action(_ => InternalServerError("error message"))
      } else {
        Action(_ => Ok(TestAccountJson))
      }
  }

  val defaultRoutes = Route {
    case (GET, `treehubJsonUrl`) =>
      Action(_ => Ok(TreehubFeatureJson))

    case (GET, `treehubJsonOfflineUrl`) =>
      Action(_ => Ok(TreehubFeatureJson))

    case (GET, `rootJsonUrl`) =>
      Action { request =>
        val ns = request.headers.get("x-ats-namespace").getOrElse(throw new Exception("missing namespace"))
        Ok("{}").withHeaders("x-ats-tuf-repo-id" -> ns)
      }

    case (GET, `authPlusClientUrl`) =>
      Action(_ => Ok(ClientSecret))

    case (GET, `keyPairsUrl`) =>
      Action(_ => Ok(s"[${tufKeyPairEncoder(keyPair).noSpaces}]"))

    case (GET, `keyOfflineUrl`) =>
      Action(_ => NotFound)
  }

  val mockClient = MockWS(defaultCryptRoutes orElse defaultRoutes)

  val failingClient = MockWS {
    case _ => Action(_ => InternalServerError)
  }

  val mockClientFailingCrypt = MockWS(failingCryptRoutes orElse defaultRoutes)

  val builder = new GuiceApplicationBuilder()
    .configure("auth0.domain" -> auth0Domain)
    .configure("authplus.host" -> "auth-plus")
    .configure("authplus.uri" -> authPlusUri)
    .configure("userprofile.uri" -> userProfileUri)
    .configure("crypt.host" -> "crypt")
    .configure("crypt.uri" -> CryptHost)
    .configure("keyserver.uri" -> keyServerUri)
    .configure("repo.pub.host" -> "http://reposerver")
    .configure("repo.uri" -> repoServerUri)
    .configure("repo.pub.uri" -> repoServerUri)
    .configure("director.uri" -> "http://director")
    .configure("api_gateway.uri" -> "http://api-gateway")
    .overrides(bind[TokenVerification].to[NoVerification])
  val application = builder.overrides(bind[WSClient].to(mockClient)).build
  val controller = application.injector.instanceOf[ClientToolController]

  "GET /api/v1/clienttools/provisioning" should {
    val request = FakeRequest(GET, "/api/v1/clienttools/provisioning").withAuthSession(namespaceWithOnlineKeys)

    "return a ZIP archive" in {
      val result = call(controller.downloadClientToolBundle(UUID.randomUUID()), request)
      status(result) mustBe OK
      contentType(result).get mustBe "application/zip"

      val zip = new ZipInputStream(new ByteArrayInputStream(contentAsBytes(result).toArray))

      val nonJsonFiles = Seq("autoprov.url", "autoprov_credentials.p12", "api_gateway.url",
                             "tufrepo.url")
      nonJsonFiles.foreach { entry =>
        zip.getNextEntry.getName mustBe entry

        if (entry.contains(".url")) {
          val content = Source.fromInputStream(zip).mkString
          val url = new URL(content)
          assert(url.getHost != "")
        }

        zip.closeEntry()
      }

      val jsonFiles = Seq("root.json", "targets.pub", "targets.sec", "treehub.json")
      jsonFiles.foreach { entry =>
        zip.getNextEntry.getName mustBe entry
        Json.parse(Source.fromInputStream(zip).mkString) mustBe a[JsObject]
        zip.closeEntry()
      }

    }

    "throw an exception when a client returns a 500" in {
      val application = builder.overrides(bind[WSClient].to(failingClient)).build
      val controller = application.injector.instanceOf[ClientToolController]

      try {
        status(call(controller.downloadClientToolBundle(UUID.randomUUID()), request))
        throw new Exception("shouldn't happen")
      } catch {
        case _: UnexpectedResponse =>
      }
    }

    "return a ZIP archive even when TUF keys are offline" in {
      val request = FakeRequest(GET, "/api/v1/clienttools/provisioning")
        .withAuthSession(namespaceWithOfflineKeys)

      val result = call(controller.downloadClientToolBundle(UUID.randomUUID()), request)
      status(result) mustBe OK
      contentType(result).get mustBe "application/zip"
    }

    "error when when crypt client can't connect to crypt server" in {
      val application = builder.overrides(bind[WSClient].to(mockClientFailingCrypt)).build
      val controller = application.injector.instanceOf[ClientToolController]
      an [RemoteApiError] should be thrownBy
        status(call(controller.downloadClientToolBundle(UUID.randomUUID()), request))
    }

  }

}
