package com.advancedtelematic.api

import com.advancedtelematic.ota.vehicle.ClientInfo
import org.genivi.sota.data.Vehicle.Vin
import org.genivi.webserver.controllers.OtaPlusConfig
import play.api.Configuration
import play.api.libs.ws.{WSClient, WSRequest, WSResponse}
import play.api.libs.json._
import play.api.mvc.Result

import scala.concurrent.Future
import scala.util.control.NoStackTrace

case class RemoteApiIOError(cause: Throwable) extends Exception(cause) with NoStackTrace

case class RemoteApiError(result: Result, msg: String = "") extends Exception(msg) with NoStackTrace

case class RemoteApiParseError(msg: String) extends Exception(msg) with NoStackTrace

trait ApiClient { self =>
  val baseUrl: String

  val apiPrefix = "/api/v1/"

  val ws: WSClient

  val apiExec: ApiClientExec

  def apiRequest(path: String): WSRequest =
    ws.url(baseUrl + apiPrefix + path)
      .withFollowRedirects(false)

  def apiOp(apiRequest: => WSRequest): Future[WSResponse] = {
    apiExec.runSafe(apiRequest)
  }

  def apiProxyOp(apiRequest: => WSRequest): Future[Result] = {
    apiExec.runApiResult(apiRequest)
  }

  def apiJsonOp[T](apiRequest: => WSRequest)(implicit ev: Reads[T]): Future[T] = {
    apiExec.runApiJson[T](apiRequest)
  }
}


class CoreApi(val conf: Configuration, val ws: WSClient, val apiExec: ApiClientExec) extends ApiClient
  with OtaPlusConfig {
  val baseUrl = coreApiUri

  def createVehicle(vin: Vin): Future[Result] = apiProxyOp {
    apiRequest(s"vehicles/${vin.get}").withMethod("PUT")
  }

  def search(params: Seq[(String, String)]): Future[Result] = apiProxyOp {
    apiRequest("vehicles").withQueryString(params:_*)
  }
}


class ResolverApi(val conf: Configuration, val ws: WSClient, val apiExec: ApiClientExec) extends ApiClient
  with OtaPlusConfig {
  val baseUrl = resolverApiUri

  def createVehicle(vin: Vin): Future[Result] = apiProxyOp {
    apiRequest(s"vehicles/${vin.get}").withMethod("PUT")
  }

  def search(params: Seq[(String, String)]): Future[Result] = apiProxyOp {
    apiRequest("vehicles").withQueryString(params: _*)
  }
}

class AuthPlusApi(val conf: Configuration, val ws: WSClient, val apiExec: ApiClientExec) extends ApiClient
  with OtaPlusConfig {

  val baseUrl = authPlusApiUri

  override val apiPrefix = "/"

  def createClient(vin: Vin)(implicit ev: Reads[ClientInfo]): Future[ClientInfo] = apiJsonOp {
    val request = Json.obj(
      "grant_types" -> List("client_credentials"),
      "client_name" -> vin.get,
      "scope" -> List(s"ota-core.${vin.get}.write", s"ota-core.${vin.get}.read")
    )

    apiRequest("clients")
      .withBody(request)
      .withMethod("POST")
  }
}

