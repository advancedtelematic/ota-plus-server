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
      .configure("namespace_setup.check_retries" -> 1)
      .build

  val namespace = "test-default"

  val tufRoots = new ConcurrentHashMap[String, JsValue]()

  val directorRoots = new ConcurrentHashMap[String, JsValue]()

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

  val mockClient = MockWS(reposerverRoutes orElse directorRoutes orElse cryptRoutes)

  "NamespaceSetupController" should {
    val controller = app.injector.instanceOf[NamespaceSetupController]

    "return status of resources" in {
      val result = controller.status()(FakeRequest("GET", "/").withAuthSession(namespace))

      status(result) mustBe OK

      val resourceStatus = contentAsJson(result).as[Map[String, Boolean]]

      resourceStatus.get("tuf") must contain(false)
      resourceStatus.get("director") must contain(false)
    }

    "return failure errors when check fails" in {
      val ns = "error-get-ns"
      val result = controller.setup()(FakeRequest("GET", "/").withAuthSession(ns))

      status(result) mustBe BAD_GATEWAY

      val resourceStatus = contentAsJson(result).as[Map[String, String]]

      resourceStatus("tuf") must include("Failed to wait for resource creation")
    }

    "return failure errors when create fails" in {
      val ns = "error-ns"
      val result = controller.setup()(FakeRequest("GET", "/").withAuthSession(ns))

      status(result) mustBe BAD_GATEWAY

      val resourceStatus = contentAsJson(result).as[Map[String, String]]

      resourceStatus("tuf") must include("Failed: Error creating repo")
    }

    "create resources when they do not exist" in {
      val ns = "test-ns-create"
      val result = controller.setup()(FakeRequest("GET", "/").withAuthSession(ns))

      status(result) mustBe OK

      val resourceStatus = contentAsJson(result).as[Map[String, String]]

      resourceStatus.get("tuf") must contain("Created")
      resourceStatus.get("director") must contain("Created")
    }
  }
}
