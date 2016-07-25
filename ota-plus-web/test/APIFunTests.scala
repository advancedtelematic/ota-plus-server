/**
 * Copyright: Copyright (C) 2015, Jaguar Land Rover
 * License: MPL-2.0
 */

import java.io.File
import java.security.InvalidParameterException
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.UUID
import javax.crypto.SecretKey
import javax.crypto.spec.SecretKeySpec

import com.advancedtelematic.jwa.`HMAC SHA-256`
import com.advancedtelematic.jws.{Jws, KeyInfo, KeyLookup}
import com.advancedtelematic.jwt._
import io.circe.Decoder
import org.asynchttpclient.AsyncHttpClient
import org.asynchttpclient.request.body.multipart.FilePart
import org.genivi.sota.data.Device
import org.genivi.sota.data.Device.{DeviceId, DeviceName, DeviceType}
import org.scalatest.Tag
import org.scalatest.prop.GeneratorDrivenPropertyChecks
import org.scalatestplus.play._
import play.api.libs.json._
import play.api.libs.functional.syntax._
import play.api.libs.json.Reads._
import play.api.libs.ws.{WS, WSClient, WSResponse}
import play.api.test.Helpers._
import play.api.mvc.{Cookies, Session}
import org.scalatest.Tag
import org.scalatestplus.play._
import play.api.Configuration
import play.api.libs.ws.{WSClient, WSResponse}
import play.api.mvc.{Cookie, Cookies}
import play.api.test.Helpers._
import com.advancedtelematic.ota.device.Devices._
import scala.util.Random
import Device._
import cats.syntax.show._

object APITests extends Tag("APITests")

/**
 * Integration tests for the API
 *
 * These tests assume a blank, migrated database, as well as a local webserver running on the port
 * given by test.webserver.port
 */
class APIFunTests extends PlaySpec with OneServerPerSuite with GeneratorDrivenPropertyChecks {

//  val testNamespace = "default"
  val testVin = "TESTSTR0123456789"
  val testVinAlt = "TESTALT0123456789"
  val testPackageName = "TestPkg"
  val testPackageNameAlt = "TestPkgAlt"
  val testPackageVersion = "1.0.0"
  val testFilterName = "TestFilter"
  val testFilterNameDelete = "TestDeleteFilter"
  val testFilterExpression = "vin_matches '^TEST'"
  val testFilterAlternateExpression = "vin_matches '^TESTSTR'"
  val testComponentName = "Radio"
  val testComponentNameAlt = "Satnav"
  val testComponentDescription = "A radio component"
  val testComponentDescriptionAlt = "A satellite navigation component"

  var testId    : Option[String] = None
  var testIdAlt : Option[String] = None

  val webserverHost = "localhost"
  override lazy val port = app.configuration.getString("test.webserver.port").map(_.toInt).getOrElse(9010)

  val wsClient = app.injector.instanceOf[WSClient]

  object Method extends Enumeration {
    type Method = Value
    val GET, PUT, DELETE, POST = Value
  }

  case class PackageId(name: String, version: String)
  case class Vehicle(vin: String)

  implicit val packageIdReads: Reads[PackageId] = (
    (JsPath \ "name").read[String] and
    (JsPath \ "version").read[String]
  )(PackageId.apply _)

  import Method._
  def makeRequest(path: String, method: Method) : WSResponse = {
    val req =
      wsClient.url(s"http://$webserverHost:$port/api/v1/" + path)
        .withHeaders("Cookie" -> sessionCookie)

    method match {
      case PUT => await(req.put(""))
      case GET => await(req.get())
      case DELETE => await(req.delete())
      case _ => throw new InvalidParameterException("POST is not supported by this method")
    }
  }

  def makeJsonRequest(path: String,  method: Method, data: JsObject) : WSResponse = {
    val req = wsClient
      .url(s"http://$webserverHost:$port/api/v1/" + path)
      .withHeaders("Cookie" -> sessionCookie)

    method match {
      case PUT => await(req.put(data))
      case POST => await(req.post(data))
      case _ => throw new InvalidParameterException("POST is not supported by this method")
    }
  }

  def makeCookie(session: (String, String)*) =
    Cookies.encodeCookieHeader(Seq(Session.encodeAsCookie(Session(session.toMap))))

  lazy val sessionCookie = makeCookie("id_token" -> oauthToken, "access_token" -> oauthToken)

  lazy val namespace = Subject("ittests@ats.com")

  lazy val oauthToken : String = {
    import com.advancedtelematic.json.signature.JcaSupport._

    val token = JsonWebToken(
      TokenId("itTestToken"),
      Issuer("ItTests"),
      ClientId(UUID.randomUUID()),
      namespace,
      Audience(Set.empty),
      Instant.now.minusSeconds(1),
      Instant.now.plus(1, ChronoUnit.HOURS),
      Scope(Set.empty)
    )

    val bytes = Array.fill[Byte](16)(Random.nextInt().toByte)
    val key = new SecretKeySpec(bytes, "HmacSHA256")
    val keyInfo = KeyInfo[SecretKey](key, None, None, None)
    Jws.signCompact(token, `HMAC SHA-256`, keyInfo).toString()
  }

  def addVin(vin: String): String = {
    val device = Json.obj("deviceName" -> vin, "deviceId" -> vin, "deviceType" -> "Vehicle")

    // create in device registry
    val response = makeJsonRequest("devices", POST, device)
    response.status mustBe CREATED

    response.json.asOpt[String] match {
      case Some(id: String) => id
      case None => fail("JSON parse error:" + response.body)
    }
  }

  def addPackage(packageName: String, packageVersion: String): Unit = {
    val asyncHttpClient:AsyncHttpClient = wsClient.underlying
    val putBuilder = asyncHttpClient
        .preparePut(s"http://$webserverHost:$port/api/v1/packages/$packageName/" +
          packageVersion + "?description=test&vendor=ACME")
      .addHeader("Cookie", sessionCookie)
    val builder = {
      val tmpFile = {
        val fileName = java.util.UUID.randomUUID().toString
        File.createTempFile(fileName, "tmp")
      }
      tmpFile.exists() mustBe true
      putBuilder.addBodyPart(new FilePart("file", tmpFile))
    }
    val response = asyncHttpClient.executeRequest(builder.build()).get()
    response.getStatusCode mustBe NO_CONTENT
  }

  def addFilter(filterName : String): Unit = {
    val data = Json.obj(
      "namespace"  -> namespace.underlying,
      "name"       -> filterName,
      "expression" -> testFilterExpression
    )
    val filtersResponse = makeJsonRequest("resolver/filters", POST, data)
    filtersResponse.status mustBe OK
    filtersResponse.json.mustEqual(data)
  }

  def addFilterToPackage(packageName : String): Unit = {
    val resp = makeRequest(s"resolver/package_filters/$packageName/$testPackageVersion/$testFilterName", PUT)
    resp.status mustBe OK
  }

  def addComponent(partNumber : String, description : String): Unit = {
    val data = Json.obj(
      "namespace"   -> "ittests@ats.com",
      "partNumber"  -> partNumber,
      "description" -> description
    )
    val componentResponse = makeJsonRequest(s"resolver/components/$partNumber", PUT, data)
    componentResponse.status mustBe OK
    componentResponse.json mustEqual data
  }

  "test adding devices" taggedAs APITests in {
    testId = Some(addVin(testVin))
    //add second vin to aid in testing filtering later on
    testIdAlt = Some(addVin(testVinAlt))
  }

  "test searching devices" taggedAs APITests in {
    val response = makeRequest(s"devices?namespace=${namespace.underlying}&regex=" + testVin, GET)

    response.status mustBe OK

    response.json.asOpt[List[Device]] match {
      case Some(resp : List[Device]) => resp.length mustBe 1
        resp.headOption.flatMap(_.deviceId).map(_.show) must contain(testVin)
      case None => fail("JSON parse error:" + response.body)
    }
  }

  "test adding packages" taggedAs APITests in {
    addPackage(testPackageName, testPackageVersion)
    //add second package to aid in testing filtering later on
    addPackage(testPackageNameAlt, testPackageVersion)
  }

  "test adding manually installed packages" taggedAs APITests in {
    val packageResponse = makeRequest("resolver/devices/" + testIdAlt.get + "/package/" + testPackageNameAlt +
      "/" + testPackageVersion, PUT)
    packageResponse.status mustBe OK
  }

  "test viewing manually installed packages" taggedAs APITests in {
    val searchResponse = makeRequest("resolver/devices/" + testIdAlt.get + "/package", GET)
    searchResponse.status mustBe OK
    val json = Json.parse(searchResponse.body)
    json.validate[Iterable[PackageId]] match {
      case pkg: JsSuccess[Iterable[PackageId]] =>
        pkg.get.size mustBe 1
        pkg.get.head.name mustBe testPackageNameAlt
        pkg.get.head.version mustBe testPackageVersion
      case _ => fail("Invalid installed packages json received from server")
    }
  }

  "test viewing vehicles with a given package installed" taggedAs APITests in {
    val viewResponse = makeRequest("resolver/devices?packageName="
      + testPackageNameAlt + "&packageVersion=" + testPackageVersion, GET)
    viewResponse.status mustBe OK
    //TODO: need to make sure we only get a single vin back
    viewResponse.json.as[Seq[Device.Id]].headOption.map(_.show) must contain(testIdAlt.get)
  }

  "test searching packages" taggedAs APITests in {
    val searchResponse = makeRequest("packages?regex=^" + testPackageName + "$", GET)
    searchResponse.status mustBe OK
  }

  "test adding filters" taggedAs APITests in {
    addFilter(testFilterName)
  }

  "test deleting filters" taggedAs APITests in {
    addFilter(testFilterNameDelete)
    val deleteResponse = makeRequest("resolver/filters/" + testFilterNameDelete, DELETE)
    println(deleteResponse.body)
    deleteResponse.status mustBe OK
    val searchResponse = makeRequest("resolver/filters?regex=" + testFilterNameDelete, GET)
    searchResponse.status mustBe OK
    searchResponse.body.toString mustEqual "[]"
  }

  "test searching filters" taggedAs APITests in {
    val searchResponse = makeRequest("resolver/filters?regex=" + testFilterName, GET)
    searchResponse.status mustBe OK
  }

  "test changing filter expressions" taggedAs APITests in {
    val data = Json.obj(
      "namespace"  -> "default",
      "name"       -> testFilterName,
      "expression" -> testFilterAlternateExpression
    )
    val filtersChangeResponse = makeJsonRequest("resolver/filters/" + testFilterName, PUT, data)
    filtersChangeResponse.status mustBe OK
  }

  "test adding filters to a package" taggedAs APITests in {
    addFilterToPackage(testPackageName)
  }

  "test removing filters from a package" taggedAs APITests in {
    val req = makeRequest(s"resolver/package_filters/$testPackageName/$testPackageVersion/$testFilterName", DELETE)
    req.status mustBe OK
  }

  "test re-adding filters to a package" taggedAs APITests in {
    //we also re-add the filter to test whether updates filter vins properly
    addFilterToPackage(testPackageName)
  }

  "test removing package from a filter" taggedAs APITests in {
    val req = makeRequest(s"resolver/package_filters/$testPackageName/$testPackageVersion/$testFilterName", DELETE)
    req.status mustBe OK
  }

  "test viewing packages with a given filter" taggedAs APITests in {
    val searchResponse = makeRequest("resolver/filters/" + testFilterName + "/package", GET)
    searchResponse.status mustBe OK
    searchResponse.body.toString mustEqual "[]"
  }

  "test re-adding a package to a filter" taggedAs APITests in {
    addFilterToPackage(testPackageName)
  }

  "test creating components" taggedAs APITests in {
    addComponent(testComponentName, testComponentDescription)
  }

  "test searching components" taggedAs APITests in { // TODO PRO-338
    val searchResponse = makeRequest("resolver/components?regex=" + testComponentName, GET)
    val componentJson = Json.obj(
      "partNumber" -> testComponentName,
      "description" -> testComponentDescription
    )
    searchResponse.status mustBe OK
    searchResponse.json.equals(componentJson)
  }

  "test deleting components" taggedAs APITests in {
    addComponent(testComponentNameAlt, testComponentDescriptionAlt)
    val deleteResponse = makeRequest("resolver/components/" + testComponentNameAlt, DELETE)
    deleteResponse.status mustBe OK
    val searchResponse = makeRequest("resolver/components?regex=" + testComponentNameAlt, GET)
    searchResponse.status mustBe OK
    searchResponse.body.toString mustEqual "[]"
  }

  "test adding component to vin" taggedAs APITests in {
    addComponent(testComponentName, testComponentDescription)
    val addResponse = makeRequest("resolver/devices/" + testId.get + "/component/" + testComponentName, PUT)
    addResponse.status mustBe OK
  }

  "test viewing components installed on device" taggedAs APITests in {
    val listResponse = makeRequest("resolver/devices/" + testId.get + "/component", GET)
    listResponse.status mustBe OK
    //TODO: parse this body as json
    listResponse.body.toString mustEqual "[\"" + testComponentName + "\"]"
  }

  "test devices with component installed" taggedAs APITests in {
    val response = makeRequest("resolver/devices?component=" + testComponentName, GET)
    response.status mustBe OK

    val parsed = response.json.as[Seq[Device.Id]]

    parsed.headOption.map(_.show) must contain(testId.get)
  }

  "test creating install campaigns" taggedAs APITests ignore {
    val pattern = "yyyy-MM-dd'T'HH:mm:ssZZ"
    val currentTimestamp = Instant.now.toString
    val tomorrowTimestamp = Instant.now.plus(1, ChronoUnit.DAYS).toString
    val uuid = UUID.randomUUID().toString
    val data = Json.obj(
      "creationTime" -> currentTimestamp,
      "id" -> uuid,
      "packageId" -> Json.obj("name" -> testPackageName, "version" -> testPackageVersion),
      "signature" -> "somesignature",
      "description" -> "somedescription",
      "requestConfirmation" -> false,
      "periodOfValidity" -> (currentTimestamp + "/" + tomorrowTimestamp),
      "priority" -> 1 //this could be anything from 1-10; picked at random in this case
    )
    val response = makeJsonRequest("updates", POST, data)
    response.status mustBe OK
  }

  "test install queue for a device" taggedAs APITests ignore {
    val queueResponse = makeRequest("resolver/devices/" + testId.get + "/queued", GET)
    queueResponse.status mustBe OK
    val json = Json.parse(queueResponse.body)
    json.validate[Iterable[PackageId]] match {
      case pkg: JsSuccess[Iterable[PackageId]] =>
        pkg.get.size mustBe 1
        pkg.get.head.name mustBe testPackageName
        pkg.get.head.version mustBe testPackageVersion
      case _ => fail("Invalid installed packages json received from server")
    }
  }

  "test getting package queue for device" taggedAs APITests ignore {
    val packageQueueResponse = makeRequest("resolver/devices/" + testId.get + "/queued", GET)
    packageQueueResponse.status mustBe OK
    val json = Json.parse(packageQueueResponse.body)
    json.validate[Iterable[PackageId]] match {
      case pkg: JsSuccess[Iterable[PackageId]] =>
        pkg.get.size mustBe 1
        pkg.get.head.name mustBe testPackageName
        pkg.get.head.version mustBe testPackageVersion
      case _ => fail("Invalid package queue json received from server")
    }
  }

  "test list of devices affected by update" taggedAs APITests ignore {
    val listResponse = makeRequest(s"resolve?namespace=${namespace.underlying}&package_name=$testPackageName&package_version=$testPackageVersion", GET)
    //TODO: parse this properly. The issue is the root key for each list in the response is a vin, not a static string.
    listResponse.body.contains(testId.get) && !listResponse.body.contains(testIdAlt.get) mustBe true
  }

}
