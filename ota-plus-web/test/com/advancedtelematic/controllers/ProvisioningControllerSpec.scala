package com.advancedtelematic.controllers

import brave.play.ZipkinTraceServiceLike
import com.advancedtelematic.controllers.AuthUtils._
import com.advancedtelematic.libats.data.DataType.Namespace
import com.advancedtelematic.provisioning.NoOpZipkinTraceService
import mockws.{MockWS, MockWSHelpers}
import org.scalacheck.Gen
import org.scalatest.BeforeAndAfterAll
import org.scalatestplus.play.PlaySpec
import org.scalatestplus.play.guice.GuiceOneAppPerSuite
import play.api.inject.bind
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.libs.json.Json
import play.api.libs.ws.WSClient
import play.api.mvc.Results
import play.api.test.FakeRequest
import play.api.test.Helpers._

class ProvisioningControllerSpec extends PlaySpec
  with GuiceOneAppPerSuite
  with BeforeAndAfterAll
  with MockWSHelpers
  with Results {

  val reposerverUri = "http://tuf-reposerver.com"
  val keyserverUri = "http://tuf-keyserver.com"

  val (onlineNs, onlineRepoId) = (Namespace.generate,  Gen.uuid.sample.get.toString)
  val (offlineNs, offlineRepoId) = (Namespace.generate,  Gen.uuid.sample.get.toString)

  val mock = MockWS {
    case (HEAD, url) if s"$reposerverUri/api/v1/user_repo/root.json".r.findFirstIn(url).isDefined =>
      Action(BodyParser.defaultBodyParser) { implicit request =>
        val repoId = request.headers.headers.find(_._1 == "x-ats-namespace").map(_._2).fold("") {
          case ns if ns == onlineNs.get => onlineRepoId
          case ns if ns == offlineNs.get => offlineRepoId
          case _ => ""

        }
        NoContent.withHeaders("x-ats-tuf-repo-id" -> repoId)
      }

    case (HEAD, url) if s"$keyserverUri/api/v1/root/(.*)/keys/targets/pairs".r.findFirstIn(url).isDefined =>
      val repoId = s"$keyserverUri/api/v1/root/(.*)/keys/targets/pairs".
        r.findAllIn(url).matchData.map(_.group(1)).toSeq.head
      Action { _ =>
        if (repoId == offlineRepoId) NotFound
        else Ok
      }
  }

  implicit override lazy val app: play.api.Application =
    new GuiceApplicationBuilder()
      .configure("repo.uri" -> reposerverUri)
      .configure("keyserver.uri" -> keyserverUri)
      .overrides(bind[WSClient].to(mock))
      .overrides(bind[ZipkinTraceServiceLike].to(new NoOpZipkinTraceService))
      .build()

  "ProvisioningController" should {
    val controller = app.injector.instanceOf[ProvisioningController]

    "detect when the signing keys are online" in {
      val request =
        FakeRequest("GET", "/api/v1/keys/status").withAuthSession(onlineNs.get)
      val result = call(controller.keysStatus, request)
      status(result) mustBe OK
      contentAsJson(result) mustBe Json.obj("keys-online" -> true)
    }

    "detect when the signing keys are offline" in {
      val request =
        FakeRequest("GET", "/api/v1/keys/status").withAuthSession(offlineNs.get)
      val result = call(controller.keysStatus, request)
      status(result) mustBe OK
      contentAsJson(result) mustBe Json.obj("keys-online" -> false)
    }
  }

}
