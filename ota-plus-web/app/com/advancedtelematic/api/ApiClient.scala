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

  def withBearerToken(request: WSRequest, token: Option[String]): WSRequest =
    token match {
      case Some(token) => request.withHeaders(("Authorization", "Bearer " + token))
      case None => request
    }

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

  def createVehicle(token: Option[String], vin: Vin): Future[Result] = apiProxyOp {
    withBearerToken(apiRequest(s"vehicles/${vin.get}").withMethod("PUT"), token)
  }

  def search(token: Option[String], params: Seq[(String, String)]): Future[Result] = apiProxyOp {
    withBearerToken(apiRequest("vehicles").withQueryString(params:_*), token)
  }
}


class ResolverApi(val conf: Configuration, val ws: WSClient, val apiExec: ApiClientExec) extends ApiClient
  with OtaPlusConfig {
  val baseUrl = resolverApiUri

  def createVehicle(token: Option[String], vin: Vin): Future[Result] = apiProxyOp {
    withBearerToken(apiRequest(s"vehicles/${vin.get}").withMethod("PUT"), token)
  }

  def search(token: Option[String], params: Seq[(String, String)]): Future[Result] = apiProxyOp {
    withBearerToken(apiRequest("vehicles").withQueryString(params: _*), token)
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

  def changePassword(token: Option[String], email: String, oldPassword: String, newPassword: String): Future[Result] =
  apiProxyOp {
    val params = Json.obj(
      "oldPassword" -> oldPassword,
      "newPassword" -> newPassword
    )

    withBearerToken(apiRequest(s"users/${email}/password").withBody(params).withMethod("PUT"), token)
  }
}
