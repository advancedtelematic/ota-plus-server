package com.advancedtelematic.controllers

import java.time.Instant

import brave.play.ZipkinTraceServiceLike
import com.advancedtelematic.controllers.AuthUtils.RequestSyntax
import com.advancedtelematic.controllers.Data.FeedResource
import com.advancedtelematic.provisioning.NoOpZipkinTraceService
import mockws.{MockWS, MockWSHelpers}
import org.scalacheck.Gen
import org.scalatest.BeforeAndAfterAll
import org.scalatest.concurrent.ScalaFutures
import org.scalatestplus.play.PlaySpec
import org.scalatestplus.play.guice.{GuiceOneAppPerSuite, GuiceOneServerPerSuite}
import play.api.inject.bind
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.libs.json.{JsObject, Json, Reads}
import play.api.libs.ws.WSClient
import play.api.mvc.Results
import play.api.test.FakeRequest
import play.api.test.Helpers.{GET, _}

class FeedControllerSpec extends PlaySpec
  with GuiceOneAppPerSuite
  with BeforeAndAfterAll
  with MockWSHelpers
  with GuiceOneServerPerSuite
  with ScalaFutures
  with Results {

  private val campaignerUri = "http://campaigner.com"
  private val deviceRegistryUri = "http://device-registry.com"
  private val repoServerUri = "http://repo-server.com"
  private val testNamespace = Gen.uuid.map(_.toString).map(uuid => s"HERE-$uuid").sample.get

  private val genInstant = Gen.resize(1000000000, Gen.posNum[Long]).map(Instant.ofEpochSecond)

  private val genDevice = for {
    uuid <- Gen.uuid
    deviceId <- Gen.alphaNumStr
    deviceName <- Gen.alphaNumStr
    deviceType = "Other"
    lastSeen <- genInstant
    createdAt <- genInstant
  } yield FeedResource(createdAt, "device", Json.obj(
    "namespace" -> testNamespace,
    "uuid" -> uuid,
    "deviceId" -> deviceId,
    "deviceName" -> deviceName,
    "deviceType" -> deviceType,
    "lastSeen" -> lastSeen,
    "createdAt" -> createdAt,
  ))

  private val genDeviceGroup = for {
    id <- Gen.uuid
    groupName <- Gen.alphaNumStr
    deviceCount <- Gen.posNum[Int]
    groupType <- Gen.alphaNumStr
    createdAt <- genInstant
  } yield FeedResource(createdAt, "device_group", Json.obj(
    "id" -> id,
    "groupName" -> groupName,
    "deviceCount" -> deviceCount,
    "groupType" -> groupType,
    "createdAt" -> createdAt,
  ))

  private val genCampaign = for {
    id <- Gen.uuid
    name <- Gen.alphaNumStr
    deviceCount <- Gen.posNum[Int]
    updateId <- Gen.uuid
    status <- Gen.alphaNumStr
    createdAt <- genInstant
  } yield FeedResource(createdAt, "campaign", Json.obj(
    "namespace" -> testNamespace,
    "id" -> id,
    "name" -> name,
    "deviceCount" -> deviceCount,
    "updateId" -> updateId,
    "status" -> status,
    "createdAt" -> createdAt,
  ))

  private val genUpdate = for {
    uuid <- Gen.uuid
    name <- Gen.alphaNumStr
    description <- Gen.alphaNumStr
    createdAt <- genInstant
  } yield FeedResource(createdAt, "update" , Json.obj(
    "namespace" -> testNamespace,
    "uuid" -> uuid,
    "name" -> name,
    "description" -> description,
    "createdAt" -> createdAt,
  ))

  private val genSoftware = for {
    name <- Gen.alphaNumStr
    version <- Gen.alphaNumStr
    targetFormat <- Gen.alphaNumStr
    hardwareId = Gen.resize(20, Gen.alphaNumStr)
    hardwareIds <- Gen.resize(4, Gen.nonEmptyListOf(hardwareId))
    createdAt <- genInstant
  } yield FeedResource(createdAt, "software", Json.obj(
    "name" -> name,
    "version" -> version,
    "hardwareIds" -> hardwareIds,
    "targetFormat" -> targetFormat,
    "updatedAt" -> createdAt,
    "createdAt" -> createdAt,
  ))

  private val devices = Gen.listOf(genDevice).sample.get
  private val deviceGroups = Gen.listOf(genDeviceGroup).sample.get
  private val campaigns = Gen.listOf(genCampaign).sample.get
  private val updates = Gen.listOf(genUpdate).sample.get
  private val softwares = Gen.listOf(genSoftware).sample.get

  val mock = MockWS {
    case (GET, url) if url == s"$deviceRegistryUri/api/v1/devices" =>
      Action(_ => Ok(Json.obj(
        "total" -> devices.length,
        "values" -> devices.map(_.resource)
      )))

    case (GET, url) if url == s"$deviceRegistryUri/api/v1/device_groups" =>
      Action(_ => Ok(Json.obj(
        "total" -> deviceGroups.length,
        "values" -> deviceGroups.map(_.resource).map(_ - "deviceCount")
      )))

    case (GET, url) if s"$deviceRegistryUri/api/v1/device_groups/(.*)/count".r.findAllIn(url).nonEmpty =>
      val uuid = s"$deviceRegistryUri/api/v1/device_groups/(.*)/count".r.findAllIn(url).matchData.map(_.group(1)).toSeq.head
      val deviceCount = deviceGroups.map(_.resource)
        .filter(j => (j \ "id").as[String] == uuid)
        .map(j => (j \ "deviceCount").as[Int]).head
      Action(_ => Ok(Json.toJson(deviceCount)))

    case (GET, url) if url == s"$campaignerUri/api/v2/campaigns" =>
      Action(_ => Ok(Json.obj(
        "total" -> campaigns.length,
        "values" -> campaigns.map(_.resource).map(_ - "deviceCount")
      )))

    case (GET, url) if s"$campaignerUri/api/v2/campaigns/(.*)/stats".r.findAllIn(url).nonEmpty =>
      val uuid = s"$campaignerUri/api/v2/campaigns/(.*)/stats".r.findAllIn(url).matchData.map(_.group(1)).toSeq.head
      val deviceCount = campaigns.map(_.resource)
        .filter(j => (j \ "id").as[String] == uuid)
        .map(j => (j \ "deviceCount").as[Int]).head
      Action(_ => Ok(Json.obj(
        "campaign" -> uuid,
        "processed" -> deviceCount,
        "affected" -> deviceCount,
      )))

    case (GET, url) if url == s"$campaignerUri/api/v2/updates" =>
      Action(_ => Ok(Json.obj(
          "total" -> updates.length,
          "values" -> updates.map(_.resource)
      )))

    case (GET, url) if url == s"$repoServerUri/api/v1/user_repo/targets.json" =>
      Action(_ => Ok(Json.obj(
        "signatures" -> Json.obj(
          "keyId" -> "1e0d575e9f73008bf0721c599bab1e1999a5fecc05dd193e62718cb21f15d7df",
          "method" -> "rsassa-pss-sha256",
          "sig" -> "HRXokAlhWocQgDyB4tHA7Nkhgz8o8gacrhcLnX3b5Een0yku3aBINPLdQw59JpUNgsRD3G0aA8QOK39puXnMOC8M9GffoLP4Jk6CGKawpydSLL32BdpS6cXahxPdz8R/jViTwSsmjvDIqSZUib5PnZOrfoC/8FFXscGf2efTUmrMoCQd/oa/yVDnTu6BOvOmIdtsXqAnCQDehLzp+QZKlh5/DZONnaFb3nd7ZMdkaKp2/JDdAXoiECU+fCi8Wkr61vi9CLJdn8hmpFZ+3J++PgUnI3oUUSBTCoB8H6GtIXqMmP1x453Q9ncpq7x0FLHtxAyAo8/ttTDHsN17Pi3xyA==",
        ),
        "signed" -> Json.obj(
          "_type" -> "Targets",
          "targets" -> JsObject(
            softwares.map(_.resource).map { j =>
              val name = (j \ "name").as[String]
              val version = (j \ "version").as[String]
              s"${name}_$version" -> Json.obj("length" -> 123456, "custom" -> j)
            }
          ))
      )))
  }

  implicit override lazy val app: play.api.Application =
    new GuiceApplicationBuilder()
      .configure("campaigner.uri" -> campaignerUri)
      .configure("deviceregistry.uri" -> deviceRegistryUri)
      .configure("repo.uri" -> repoServerUri)
      .overrides(bind[WSClient].to(mock))
      .overrides(bind[ZipkinTraceServiceLike].to(new NoOpZipkinTraceService))
      .build()

  "The FeedController" should {
    val controller = app.injector.instanceOf[FeedController]
    val defaultLimit = 6
    implicit val frr: Reads[FeedResource] = Json.reads[FeedResource]

    val resourcesByType: Map[String, List[FeedResource]] = Seq(
      "device" -> devices,
      "device_group" -> deviceGroups,
      "campaign" -> campaigns,
      "update" -> updates,
      "software" -> softwares,
    ).toMap

    "find `defaultLimit` more recently created resources of any type" in {
      val request = FakeRequest("GET", s"/recently_created").withAuthSession(testNamespace)
      val result = call(controller.activityFeed(None, None), request)

      status(result) mustBe OK

      val actual = contentAsJson(result).as[Seq[FeedResource]]
      val expected: Seq[FeedResource] = resourcesByType
        .values
        .reduce(_ ++ _)
        .sortBy(_.createdAt)
        .reverse
        .take(defaultLimit)

      expected.map(_.createdAt) must contain theSameElementsInOrderAs actual.map(_.createdAt)
      expected.map(_.resource) must contain theSameElementsInOrderAs actual.map(_.resource)
    }

    "find `defaultLimit` more recently created resources of specific types" in {
      val types = Gen.someOf(resourcesByType.keys).sample.get
      val request = FakeRequest("GET", s"/recently_created").withAuthSession(testNamespace)
      val result = call(controller.activityFeed(Some(types.mkString(",")), None), request)

      status(result) mustBe OK

      val actual = contentAsJson(result).as[Seq[FeedResource]]
      val expected: Seq[FeedResource] = resourcesByType
        .filterKeys(types.contains)
        .values
        .fold(Seq.empty)(_ ++ _)
        .sortBy(_.createdAt)
        .reverse
        .take(defaultLimit)

      expected.map(_.createdAt) must contain theSameElementsInOrderAs actual.map(_.createdAt)
      expected.map(_.resource) must contain theSameElementsInOrderAs actual.map(_.resource)
    }

    "find `n` more recently created resources of specific types" in {
      val n = Gen.posNum[Int].sample.get
      val types = Gen.someOf(resourcesByType.keys).sample.get
      val request = FakeRequest("GET", s"/recently_created").withAuthSession(testNamespace)
      val result = call(controller.activityFeed(Some(types.mkString(",")), Some(n)), request)

      status(result) mustBe OK

      val actual = contentAsJson(result).as[Seq[FeedResource]]
      val expected: Seq[FeedResource] = resourcesByType
        .filterKeys(types.contains)
        .values
        .fold(Seq.empty)(_ ++ _)
        .sortBy(_.createdAt)
        .reverse
        .take(Math.min(n, actual.length)) // There might not be as many as `n` recent resources.

      expected.map(_.createdAt) must contain theSameElementsInOrderAs actual.map(_.createdAt)
      expected.map(_.resource) must contain theSameElementsInOrderAs actual.map(_.resource)
    }
  }
}
