/**
 * Copyright: Copyright (C) 2015, Jaguar Land Rover
 * License: MPL-2.0
 */

import java.io.File
import java.security.InvalidParameterException
import java.util.UUID
import javax.inject.Inject

import com.advancedtelematic.ota.Generators
import org.asynchttpclient.AsyncHttpClient
import org.asynchttpclient.request.body.multipart.FilePart
import org.joda.time.DateTime
import org.joda.time.format.DateTimeFormat
import org.scalatest.Tag
import org.scalatest.prop.GeneratorDrivenPropertyChecks
import org.scalatestplus.play._
import play.api.libs.json._
import play.api.libs.functional.syntax._
import play.api.libs.json.Reads._
import play.api.libs.ws.{WSClient, WS, WSResponse}
import play.api.test.Helpers._

object APITests extends Tag("APITests")

/**
 * Integration tests for the API
 *
 * These tests assume a blank, migrated database, as well as a webserver running on port 80
 */
class APIFunTests @Inject() (wsClient: WSClient)
  extends PlaySpec with OneServerPerSuite with GeneratorDrivenPropertyChecks {

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
  val componentJson = Json.obj(
    "partNumber" -> testComponentName,
    "description" -> testComponentDescription
  )

  val webserverHost = "localhost"
  override lazy val port = app.configuration.getString("test.webserver.port").map(_.toInt).getOrElse(9000)

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
    val req = wsClient.url("http://" + webserverHost + s":$port/api/v1/" + path)
    method match {
      case PUT => await(req.put(""))
      case GET => await(req.get())
      case DELETE => await(req.delete())
      case _ => throw new InvalidParameterException("POST is not supported by this method")
    }
  }

  def makeJsonRequest(path: String,  method: Method, data: JsObject) : WSResponse = {
    val req = wsClient.url("http://" + webserverHost + s":$port/api/v1/" + path)
    method match {
      case PUT => await(req.put(data))
      case POST => await(req.post(data))
      case _ => throw new InvalidParameterException("POST is not supported by this method")
    }
  }

  def addVin(vin: String): Unit = {
    val vehiclesResponse = makeRequest("vehicles/" + vin, PUT)
    vehiclesResponse.status mustBe NO_CONTENT
  }

  def addPackage(packageName: String, packageVersion: String): Unit = {
    val asyncHttpClient:AsyncHttpClient = wsClient.underlying
    val putBuilder = asyncHttpClient
        .preparePut("http://" + webserverHost + s":$port/api/v1/packages/" + packageName + "/" +
          packageVersion + "?description=test&vendor=ACME")
    val builder = putBuilder.addBodyPart(new FilePart("file", new File("../packages/ghc-7.6.3-18.3.el7.x86_64.rpm")))
    val response = asyncHttpClient.executeRequest(builder.build()).get()
    response.getStatusCode mustBe NO_CONTENT
  }

  def addFilter(filterName : String): Unit = {
    val data = Json.obj(
      "name" -> filterName,
      "expression" -> testFilterExpression
    )
    val filtersResponse = makeJsonRequest("filters", POST, data)
    filtersResponse.status mustBe OK
    filtersResponse.json.mustEqual(data)
  }

  def addFilterToPackage(packageName : String): Unit = {
    val data = Json.obj(
      "filterName" -> testFilterName,
      "packageName" -> packageName,
      "packageVersion" -> testPackageVersion
    )
    val packageFiltersResponse = makeJsonRequest("packageFilters", POST, data)
    packageFiltersResponse.status mustBe OK
    packageFiltersResponse.json.equals(data) mustBe true
  }

  def addComponent(partNumber : String, description : String): Unit = {
    val data = Json.obj(
      "partNumber" -> partNumber,
      "description" -> description
    )
    val componentResponse = makeJsonRequest("components/" + partNumber, PUT, data)
    componentResponse.status mustBe OK
    componentResponse.json mustEqual data
  }

  "test adding vins" taggedAs APITests in {
    addVin(testVin)
    //add second vin to aid in testing filtering later on
    addVin(testVinAlt)
  }

  "test searching vins" taggedAs APITests in {
    val searchResponse = makeRequest("vehicles?regex=" + testVin, GET)
    searchResponse.status mustBe OK
    searchResponse.json.toString() mustEqual "[{\"vin\":\"" + testVin + "\"}]"
  }

  "test adding packages" taggedAs APITests in {
    addPackage(testPackageName, testPackageVersion)
    //add second package to aid in testing filtering later on
    addPackage(testPackageNameAlt, testPackageVersion)
  }

  "test adding manually installed packages" taggedAs APITests in {
    val packageResponse = makeRequest("vehicles/" + testVinAlt + "/package/" + testPackageNameAlt +
      "/" + testPackageVersion, PUT)
    packageResponse.status mustBe OK
  }

  "test viewing manually installed packages" taggedAs APITests in {
    val searchResponse = makeRequest("vehicles/" + testVinAlt + "/package", GET)
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
    val viewResponse = makeRequest("vehicles?packageName=" + testPackageNameAlt + "&packageVersion=" +
      testPackageVersion, GET)
    viewResponse.status mustBe OK
    //TODO: need to make sure we only get a single vin back
    (viewResponse.json \\ "vin").head.toString() mustEqual "\"" + testVinAlt + "\""
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
    val deleteResponse = makeRequest("filters/" + testFilterNameDelete, DELETE)
    println(deleteResponse.body)
    deleteResponse.status mustBe OK
    val searchResponse = makeRequest("filters?regex=" + testFilterNameDelete, GET)
    searchResponse.status mustBe OK
    searchResponse.body.toString mustEqual "[]"
  }

  "test searching filters" taggedAs APITests in {
    val searchResponse = makeRequest("filters?regex=" + testFilterName, GET)
    searchResponse.status mustBe OK
  }

  "test changing filter expressions" taggedAs APITests in {
    val data = Json.obj(
      "name" -> testFilterName,
      "expression" -> testFilterAlternateExpression
    )
    val filtersChangeResponse = makeJsonRequest("filters/" + testFilterName, PUT, data)
    filtersChangeResponse.status mustBe OK
  }

  "test adding filters to a package" taggedAs APITests in {
    addFilterToPackage(testPackageName)
  }

  "test removing filters from a package" taggedAs APITests in {
    val removeResponse = makeRequest("packageFilters/" + testPackageName + "/" + testPackageVersion + "/" +
      testFilterName, DELETE)
    removeResponse.status mustBe OK
  }

  "test re-adding filters to a package" taggedAs APITests in {
    //we also re-add the filter to test whether updates filter vins properly
    addFilterToPackage(testPackageName)
  }

  "test removing package from a filter" taggedAs APITests in {
    val deleteResponse = makeRequest("packageFilters/" + testPackageName + "/" + testPackageVersion + "/" +
      testFilterName, DELETE)
    deleteResponse.status mustBe OK
  }

  "test viewing packages with a given filter" taggedAs APITests in {
    val searchResponse = makeRequest("packageFilters?filter=" + testFilterName, GET)
    searchResponse.status mustBe OK
    searchResponse.body.toString mustEqual "[]"
  }

  "test re-adding a package to a filter" taggedAs APITests in {
    addFilterToPackage(testPackageName)
  }

  "test creating components" taggedAs APITests in {
    addComponent(testComponentName, testComponentDescription)
  }

  "test searching components" taggedAs APITests in {
    val searchResponse = makeRequest("components/regex=" + testComponentName, GET)
    searchResponse.status mustBe OK
    searchResponse.json.equals(componentJson)
  }

  "test deleting components" taggedAs APITests in {
    addComponent(testComponentNameAlt, testComponentDescriptionAlt)
    val deleteResponse = makeRequest("components/" + testComponentNameAlt, DELETE)
    deleteResponse.status mustBe OK
    val searchResponse = makeRequest("components?regex=" + testComponentNameAlt, GET)
    searchResponse.status mustBe OK
    searchResponse.body.toString mustEqual "[]"
  }

  "test adding component to vin" taggedAs APITests in {
    addComponent(testComponentName, testComponentDescription)
    val addResponse = makeRequest("vehicles/" + testVin + "/component/" + testComponentName, PUT)
    addResponse.status mustBe OK
  }

  "test viewing components installed on vin" taggedAs APITests in {
    val listResponse = makeRequest("vehicles/" + testVin + "/component", GET)
    listResponse.status mustBe OK
    //TODO: parse this body as json
    listResponse.body.toString mustEqual "[\"" + testComponentName + "\"]"
  }

  "test listing vins with component installed" taggedAs APITests in {
    val listResponse = makeRequest("vehicles?component=" + testComponentName, GET)
    listResponse.status mustBe OK
    //TODO: need to make sure we only get a single vin back
    (listResponse.json \\ "vin").head.toString mustEqual "\"" + testVin + "\""
  }

  "test creating install campaigns" taggedAs APITests in {
    val pattern = "yyyy-MM-dd'T'HH:mm:ssZZ"
    val currentTimestamp = DateTimeFormat.forPattern(pattern).print(new DateTime())
    val tomorrowTimestamp = DateTimeFormat.forPattern(pattern).print(new DateTime().plusDays(1))
    val uuid = UUID.randomUUID()
    val data = Json.obj(
      "creationTime" -> currentTimestamp,
      "id" -> uuid,
      "packageId" -> Json.obj("name" -> testPackageName, "version" -> testPackageVersion),
      "periodOfValidity" -> (currentTimestamp + "/" + tomorrowTimestamp),
      "priority" -> 1 //this could be anything from 1-10; picked at random in this case
    )
    val response = await(wsClient.url("http://" + webserverHost + s":$port/api/v1/updates")
      .post(data))
    response.status mustBe OK
  }

  "test install queue for a vin" taggedAs APITests in {
    val queueResponse = makeRequest("vehicles/" + testVin + "/queued", GET)
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

  "test getting package queue for vin" taggedAs APITests in {
    val packageQueueResponse = makeRequest("vehicles/" + testVin + "/queued", GET)
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

  "test list of vins affected by update" taggedAs APITests in {
    val listResponse = makeRequest("resolve/" + testPackageName + "/" + testPackageVersion, GET)
    listResponse.status mustBe OK
    //TODO: parse this properly. The issue is the root key for each list in the response is a vin, not a static string.
    listResponse.body.contains(testVin) && !listResponse.body.contains(testVinAlt) mustBe true
  }

}
