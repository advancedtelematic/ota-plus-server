package com.advancedtelematic.controllers

import java.io.ByteArrayInputStream
import java.net.URL
import java.security.Security
import java.util.UUID
import java.util.zip.ZipInputStream

import akka.util.ByteString
import com.advancedtelematic.TokenUtils.NoVerification
import com.advancedtelematic.api.{RemoteApiError, UnexpectedResponse}
import com.advancedtelematic.auth.TokenVerification
import com.advancedtelematic.controllers.AuthUtils._
import com.advancedtelematic.libtuf.crypt.TufCrypto
import com.advancedtelematic.libtuf.data.TufDataType.RsaKeyType
import com.advancedtelematic.provisioning.MockCrypt.{CryptHost, TestAccountJson}
import mockws.{MockWSHelpers, Route}
import org.apache.commons.io.IOUtils
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

import scala.util.Try

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
  val namespaceWithWithoutClientAuth = "namespace-nomtls"

  import mockws.MockWS

  val clientId = UUID.randomUUID().toString

  val cryptAccountUrl  = s"$CryptHost/accounts/"
  val registrationUrl = s"$CryptHost/accounts/$namespaceWithOnlineKeys/credentials/registration"

  val authPlusClientUrl =  s"$authPlusUri/clients/$clientId"
  val treehubJsonUrls = List(namespaceWithOnlineKeys, namespaceWithWithoutClientAuth).map { ns =>
    s"$userProfileUri/api/v1/organizations/$ns/features/treehub"
  }
  val treehubJsonOfflineUrl = s"$userProfileUri/api/v1/organizations/$namespaceWithOfflineKeys/features/treehub"

  val rootJsonUrl = s"$repoServerUri/api/v1/user_repo/root.json"
  val keyPairsUrls = List(namespaceWithOnlineKeys,namespaceWithWithoutClientAuth).map { ns =>
    s"$keyServerUri/api/v1/root/$ns/keys/targets/pairs"
  }


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
      if (url.contains(s"$namespaceWithWithoutClientAuth/credentials/client")) {
        Action(_ => NotFound("mtls keys for nokeys-ns not found"))
      } else if (url.contains("/credentials/registration")) {
        Action(_ => Ok("client-mtls-creds"))
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
    case (GET, uri) if treehubJsonUrls.contains(uri) =>
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

    case (GET, uri) if keyPairsUrls.contains(uri) =>
      Action(_ => Ok(s"[${tufKeyPairEncoder(keyPair).noSpaces}]"))

    case (GET, `keyOfflineUrl`) =>
      Action(_ => NotFound)

    case (GET, url) if url.endsWith("/userinfo") =>
      Action(_ => Ok(
        Json.obj(
          "email" -> "",
          "sub" -> "",
          "name" -> ""
        )
      ))
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

  private def readZip(zipBytes: ByteString): Map[String, ByteString] = {
    val zip = new ZipInputStream(new ByteArrayInputStream(zipBytes.toArray))

    def asSource: Stream[(String, ByteString)] = Option(zip.getNextEntry) match  {
      case Some(e) =>
        val bytes = ByteString(IOUtils.toByteArray(zip))
        Try(zip.closeEntry())

        (e.getName -> bytes) #:: asSource
      case None => Stream.empty
    }

    asSource.toMap
  }

  "GET /api/v1/clienttools/provisioning" should {
    val request = FakeRequest(GET, "/api/v1/clienttools/provisioning").withAuthSession(namespaceWithOnlineKeys)

    "return a ZIP archive" in {
      val result = call(controller.downloadClientToolBundle(UUID.randomUUID()), request)
      status(result) mustBe OK
      contentType(result).get mustBe "application/zip"

      val zipContents = readZip(contentAsBytes(result))

      val nonJsonFiles = Seq("autoprov.url", "autoprov_credentials.p12", "api_gateway.url", "tufrepo.url")

      nonJsonFiles.foreach { entry =>
        zipContents.get(entry) mustBe defined

        if (entry.contains(".url")) {
          val content = zipContents(entry).utf8String
          val url = new URL(content)
          assert(url.getHost != "")
        }
      }

      val jsonFiles = Seq("root.json", "targets.pub", "targets.sec", "treehub.json")

      jsonFiles.foreach { entry =>
        zipContents.get(entry) mustBe defined
        Json.parse(zipContents(entry).utf8String) mustBe a[JsObject]
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

    "returns a zip archive containing client mTLS credentials if they exist" in {
      val result = call(controller.downloadClientToolBundle(UUID.randomUUID()), request)

      status(result) mustBe OK
      contentType(result).get mustBe "application/zip"

      val zipContents = readZip(contentAsBytes(result))

      zipContents.keys must contain("client_auth.p12")
    }

    "returns a zip archive containing without mTLS credentials if they exist do not exist" in {
      val request = FakeRequest(GET, "/api/v1/clienttools/provisioning").withAuthSession(namespaceWithWithoutClientAuth)

      val result = call(controller.downloadClientToolBundle(UUID.randomUUID()), request)

      status(result) mustBe OK
      contentType(result).get mustBe "application/zip"

      val zipContents = readZip(contentAsBytes(result))

      zipContents.keys mustNot contain("client_auth.p12")
    }

    "error when when crypt client can't connect to crypt server" in {
      val application = builder.overrides(bind[WSClient].to(mockClientFailingCrypt)).build
      val controller = application.injector.instanceOf[ClientToolController]
      an [RemoteApiError] should be thrownBy
        status(call(controller.downloadClientToolBundle(UUID.randomUUID()), request))
    }
  }
}
