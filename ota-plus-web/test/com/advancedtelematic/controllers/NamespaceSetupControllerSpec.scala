package com.advancedtelematic.controllers

import java.util.concurrent.ConcurrentHashMap

import mockws.MockWS
import org.scalatestplus.play.PlaySpec
import org.scalatestplus.play.guice.GuiceOneServerPerSuite
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.libs.ws.WSClient
import play.api.mvc.Results
import play.api.test.FakeRequest
import play.api.test.Helpers._
import play.api.inject.bind
import AuthUtils._
import com.advancedtelematic.libtuf.data.TufDataType.{Ed25519KeyType, RsaKeyType}
import mockws.MockWS.Routes
import play.api.libs.json.{JsValue, Json}

class NamespaceSetupControllerSpec extends PlaySpec with GuiceOneServerPerSuite with Results {

  import mockws.MockWSHelpers._

  implicit override lazy val app: play.api.Application =
    new GuiceApplicationBuilder()
      .overrides(bind[WSClient].to(mockClient))
      .configure("oidc.namespace" -> "test-namespace")
      .configure("oidc.loginAction" -> "com.advancedtelematic.auth.garage.NoLoginAction")
      .configure("oidc.tokenVerification" -> "com.advancedtelematic.auth.oidc.NoTokenIntrospection")
      .configure("repo.uri" -> "http://test-reposerver")
      .configure("director.uri" -> "http://test-director")
      .configure("crypt.uri" -> "http://test-crypt")
      .configure("crypt.create" -> false)
      .configure("authplus.uri" -> "http://test-auth-plus")
      .configure("userprofile.uri" -> "http://test-userprofile")
      .configure("namespace_setup.check_retries" -> 1)
      .build

  val namespace = "test-default"

  val tufRoots = new ConcurrentHashMap[String, JsValue]()

  val directorRoots = new ConcurrentHashMap[String, JsValue]()

  val userProfileClients = new ConcurrentHashMap[String, JsValue]()

  val cryptRoutes: Routes = {
    case (_, r) if r.startsWith("http://test-crypt/accounts/") => Action { request =>
      NotFound("crypt not implemented")
    }
  }

  val directorRoutes: Routes = {
    case (POST, "http://test-director/api/v1/admin/repo") => Action { request =>
      request.headers.get("x-ats-namespace") match {
        case Some(ns) =>
          directorRoots.put(ns, Json.obj())
          Created(s"director repo created for $ns")
        case _ =>
          BadRequest("no namespace to create director repo for")
      }
    }
    case (GET, "http://test-director/api/v1/admin/repo/root.json") => Action { request =>
      request.headers.get("x-ats-namespace") match {
        case Some(ns) if directorRoots.containsKey(ns) =>
          Ok(directorRoots.get(ns))
        case Some(ns) =>
          NotFound(s"no director root for $ns")
        case _ =>
          NotFound("Namespace not found")
      }
    }
  }

  val reposerverRoutes: Routes = {
    case (POST, "http://test-reposerver/api/v1/user_repo") => Action { request =>
      request.headers.get("x-ats-namespace") match {
        case Some(ns) if ns.contains("error-ns") =>
          BadRequest(s"Error creating repo for $ns")
        case Some(ns) =>
          tufRoots.put(ns, Json.obj())
          Ok(s"repo created for $ns")
        case _ =>
          BadRequest("no namespace to create repo for")
      }
    }
    case (GET, "http://test-reposerver/api/v1/user_repo/root.json") => Action { request =>
      request.headers.get("x-ats-namespace") match {
        case Some(ns) if ns.contains("error-get-ns") =>
          BadRequest(s"Error checking repo for $ns")
        case Some(ns) if tufRoots.containsKey(ns) =>
          Ok(tufRoots.get(ns))
        case Some(ns) =>
          NotFound(s"no root for $ns")
        case _ =>
          NotFound("Namespace not found")
      }
    }
  }

  val userProfilePathRegex = """^http://test-userprofile/api/v1/users/([^/]+)/features""".r
  val userProfileFeaturePathRegex = """^http://test-userprofile/api/v1/users/([^/]+)/features/treehub""".r
  val userProfileRoutes: Routes = {
    case (GET, url) => Action { _ =>
      url match {
        case userProfileFeaturePathRegex(namespace) if (userProfileClients.containsKey(namespace)) =>
          Ok(userProfileClients.get(namespace))
        case _ => NotFound
      }
    }
    case (POST, url) => Action { _ =>
      url match {
        case userProfilePathRegex(namespace) if namespace != "ns-without-user" => {
          userProfileClients.put(
            namespace,
            Json.obj(
              "feature" -> "treehub",
              "client_id" -> "0f570b85-4d4d-4e61-9540-d8ac7389b4b6",
              "enabled" -> true))
          Ok(userProfileClients.get(namespace))
        }
        case _ => NotFound
      }
    }
  }

  val authPlusRoutes: Routes = {
    case (POST, "http://test-auth-plus/clients") => Action { request =>
      Ok(Json.obj(
        "client_id" -> "0f570b85-4d4d-4e61-9540-d8ac7389b4b6",
        "registration_client_uri" -> "http://test-auth-plus",
        "registration_access_token" -> "aoeuaoeu"))
    }
  }

  val mockClient = MockWS(reposerverRoutes orElse
    directorRoutes orElse
    cryptRoutes orElse
    authPlusRoutes orElse
    userProfileRoutes)

  "NamespaceSetupController" should {
    val controller = app.injector.instanceOf[NamespaceSetupController]

    "return status of resources with bad gateway when setup failed" in {
      val result = controller.status()(FakeRequest("GET", "/").withAuthSession(namespace))

      status(result) mustBe BAD_GATEWAY

      val resourceStatus = contentAsJson(result).as[Map[String, Boolean]]

      resourceStatus.get("tuf") must contain(false)
      resourceStatus.get("director") must contain(false)
      resourceStatus.get("treehub") must contain(false)
    }

    "return status of resources with ok when setup was sucessful " in {
      val setupResult = controller.setup(Ed25519KeyType)(FakeRequest("GET", "/").withAuthSession(namespace))

      status(setupResult) mustBe OK

      val result = controller.status()(FakeRequest("GET", "/").withAuthSession(namespace))

      status(result) mustBe OK

      val resourceStatus = contentAsJson(result).as[Map[String, Boolean]]

      resourceStatus.get("tuf") must contain(true)
      resourceStatus.get("director") must contain(true)
      resourceStatus.get("treehub") must contain(true)
    }

    "return failure errors when check fails" in {
      val ns = "error-get-ns"
      val result = controller.setup(RsaKeyType)(FakeRequest("GET", "/").withAuthSession(ns))

      status(result) mustBe BAD_GATEWAY

      val resourceStatus = contentAsJson(result).as[Map[String, String]]

      resourceStatus("tuf") must include("Failed to wait for resource creation")
    }

    "return failure errors when create fails" in {
      val ns = "error-ns"
      val result = controller.setup(RsaKeyType)(FakeRequest("GET", "/").withAuthSession(ns))

      status(result) mustBe BAD_GATEWAY

      val resourceStatus = contentAsJson(result).as[Map[String, String]]

      resourceStatus("tuf") must include("Failed: Error creating repo")
    }

    "return failure errors when create treehub client fails" in {
      val ns = "ns-without-user"
      val result = controller.setup(RsaKeyType)(FakeRequest("GET", "/").withAuthSession(ns))

      status(result) mustBe BAD_GATEWAY

      val resourceStatus = contentAsJson(result).as[Map[String, String]]

      resourceStatus("treehub") must include("Failed to wait for resource creation")
    }

    "create resources when they do not exist" in {
      val ns = "test-ns-create"
      val result = controller.setup(RsaKeyType)(FakeRequest("GET", "/").withAuthSession(ns))

      status(result) mustBe OK

      val resourceStatus = contentAsJson(result).as[Map[String, String]]

      resourceStatus.get("tuf") must contain("Created")
      resourceStatus.get("director") must contain("Created")
      resourceStatus.get("treehub") must contain("Created")
    }
  }
}
