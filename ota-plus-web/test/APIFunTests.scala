/**
 * Copyright: Copyright (C) 2015, Jaguar Land Rover
 * License: MPL-2.0
 */

import java.io.File
import java.security.InvalidParameterException
import java.util.UUID
import javax.inject.Inject

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
import play.api.libs.ws.{WSClient, WSResponse}
import play.api.test.Helpers._

object APITests extends Tag("APITests")

/**
 * Integration tests for the API
 *
 * These tests assume a blank, migrated database, as well as a local webserver running on the port
 * given by test.webserver.port
 */
class APIFunTests extends PlaySpec with OneServerPerSuite with GeneratorDrivenPropertyChecks {

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
    val req = wsClient.url(s"http://$webserverHost:$port/api/v1/" + path)
    method match {
      case PUT => await(req.put(""))
      case GET => await(req.get())
      case DELETE => await(req.delete())
      case _ => throw new InvalidParameterException("POST is not supported by this method")
    }
  }

  def makeJsonRequest(path: String,  method: Method, data: JsObject) : WSResponse = {
    val req = wsClient.url(s"http://$webserverHost:$port/api/v1/" + path)
    method match {
      case PUT => await(req.put(data))
      case POST => await(req.post(data))
      case _ => throw new InvalidParameterException("POST is not supported by this method")
    }
  }

  def addVin(vin: String): Unit = {
    val vehiclesResponse = makeRequest(s"vehicles/$vin", PUT)
    vehiclesResponse.status mustBe NO_CONTENT
  }

  def addPackage(packageName: String, packageVersion: String): Unit = {
    val asyncHttpClient:AsyncHttpClient = wsClient.underlying
    val putBuilder = asyncHttpClient
        .preparePut(s"http://$webserverHost:$port/api/v1/packages/$packageName/" +
          packageVersion + "?description=test&vendor=ACME")
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
      "namespace"  -> "default",
      "name"       -> filterName,
      "expression" -> testFilterExpression
    )
    val filtersResponse = makeJsonRequest("filters", POST, data)
    filtersResponse.status mustBe OK
    filtersResponse.json.mustEqual(data)
  }

  def addFilterToPackage(packageName : String): Unit = {
    val req = wsClient.url(
      s"http://$webserverHost:$port/api/v1/packages/$packageName/$testPackageVersion/filter/$testFilterName"
    )
    val packageFiltersResponse = await(req.put(""))
    packageFiltersResponse.status mustBe OK
  }

  def addComponent(partNumber : String, description : String): Unit = {
    val data = Json.obj(
      "namespace"   -> "default",
      "partNumber"  -> partNumber,
      "description" -> description
    )
    val componentResponse = makeJsonRequest(s"components/$partNumber", PUT, data)
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
    searchResponse.json.toString() mustEqual s"""[{"namespace":"default","vin":"$testVin","lastSeen":null}]"""
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
      "namespace"  -> "default",
      "name"       -> testFilterName,
      "expression" -> testFilterAlternateExpression
    )
    val filtersChangeResponse = makeJsonRequest("filters/" + testFilterName, PUT, data)
    filtersChangeResponse.status mustBe OK
  }

  "test adding filters to a package" taggedAs APITests ignore { // TODO PRO-333
    addFilterToPackage(testPackageName)
  }

  "test removing filters from a package" taggedAs APITests ignore { // TODO blocked by PRO-333
    val removeResponse = makeRequest("packageFilters/" + testPackageName + "/" + testPackageVersion + "/" +
      testFilterName, DELETE)
    removeResponse.status mustBe OK
  }

  "test re-adding filters to a package" taggedAs APITests ignore { // TODO PRO-333
    //we also re-add the filter to test whether updates filter vins properly
    addFilterToPackage(testPackageName)
  }

  "test removing package from a filter" taggedAs APITests ignore { // TODO blocked by PRO-333
    val deleteResponse = makeRequest("packageFilters/" + testPackageName + "/" + testPackageVersion + "/" +
      testFilterName, DELETE)
    deleteResponse.status mustBe OK
  }

  "test viewing packages with a given filter" taggedAs APITests in {
    val searchResponse = makeRequest("filters/" + testFilterName + "/package", GET)
    searchResponse.status mustBe OK
    searchResponse.body.toString mustEqual "[]"
  }

  "test re-adding a package to a filter" taggedAs APITests ignore { // TODO blocked by PRO-333
    addFilterToPackage(testPackageName)
  }

  "test creating components" taggedAs APITests in {
    addComponent(testComponentName, testComponentDescription)
  }

  "test searching components" taggedAs APITests in { // TODO PRO-338
    val searchResponse = makeRequest("components?regex=" + testComponentName, GET)
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

  "test creating install campaigns" taggedAs APITests ignore {
    val pattern = "yyyy-MM-dd'T'HH:mm:ssZZ"
    val currentTimestamp = DateTimeFormat.forPattern(pattern).print(new DateTime())
    val tomorrowTimestamp = DateTimeFormat.forPattern(pattern).print(new DateTime().plusDays(1))
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
    val response = await(
      wsClient.url(s"http://$webserverHost:$port/api/v1/updates")
      .withHeaders("Content-Type" -> "application/json")
      .post(data)
    )
    response.status mustBe OK
  }

  "test install queue for a vin" taggedAs APITests ignore {
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

  "test getting package queue for vin" taggedAs APITests ignore {
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

  "test list of vins affected by update" taggedAs APITests ignore {
    val listResponse = makeRequest("resolve/" + testPackageName + "/" + testPackageVersion, GET)
    listResponse.status mustBe OK
    //TODO: parse this properly. The issue is the root key for each list in the response is a vin, not a static string.
    listResponse.body.contains(testVin) && !listResponse.body.contains(testVinAlt) mustBe true
  }

}
