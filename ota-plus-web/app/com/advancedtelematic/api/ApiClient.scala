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

  def apiRequest(path: String): ApiOp = new ApiOp {
    override def build = ws => ws.url(baseUrl + apiPrefix + path).withFollowRedirects(false)
  }
}

trait ApiOp { self =>
  def build: WSClient => WSRequest

  def withToken(token: Option[String]): ApiOp =
    token match {
      case Some(t) => transform(request => request.withHeaders(("Authorization", "Bearer " + t)))
      case None => self
    }

  def transform(f: WSRequest => WSRequest): ApiOp = new ApiOp {
    override def build = ws => f(self.build(ws))
  }

  def execResponse(apiExec: ApiClientExec): Future[WSResponse] = {
    apiExec.runSafe(build)
  }

  def execResult(apiExec: ApiClientExec): Future[Result] = {
    apiExec.runApiResult(build)
  }

  def execJson[T](apiExec: ApiClientExec)(implicit ev: Reads[T]): Future[T] = {
    apiExec.runApiJson[T](build)
  }
}

class CoreApi(val conf: Configuration, val apiExec: ApiClientExec) extends ApiClient
  with OtaPlusConfig {
  val baseUrl = coreApiUri

  def createVehicle(token: Option[String], vin: Vin): Future[Result] =
    apiRequest(s"vehicles/${vin.get}")
      .withToken(token)
      .transform(_.withMethod("PUT"))
      .execResult(apiExec)

  def search(token: Option[String], params: Seq[(String, String)]): Future[Result] =
    apiRequest("vehicles")
      .withToken(token)
      .transform(_.withQueryString(params:_*))
      .execResult(apiExec)
}


class ResolverApi(val conf: Configuration, val apiExec: ApiClientExec) extends ApiClient
  with OtaPlusConfig {
  val baseUrl = resolverApiUri

  def createVehicle(token: Option[String], vin: Vin): Future[Result] =
    apiRequest(s"vehicles/${vin.get}")
      .withToken(token)
      .transform(_.withMethod("PUT"))
      .execResult(apiExec)

  def search(token: Option[String], params: Seq[(String, String)]): Future[Result] =
    apiRequest("vehicles")
      .withToken(token)
      .transform(_.withQueryString(params: _*))
      .execResult(apiExec)
}

class AuthPlusApi(val conf: Configuration, val apiExec: ApiClientExec) extends ApiClient
  with OtaPlusConfig {

  val baseUrl = authPlusApiUri

  override val apiPrefix = "/"

  def createClient(vin: Vin)(implicit ev: Reads[ClientInfo]): Future[ClientInfo] = {
    val request = Json.obj(
      "grant_types" -> List("client_credentials"),
      "client_name" -> vin.get,
      "scope" -> List(s"ota-core.${vin.get}.write", s"ota-core.${vin.get}.read")
    )

    apiRequest("clients")
      .transform(_.withBody(request).withMethod("POST"))
      .execJson(apiExec)
  }

  def changePassword(token: Option[String], email: String, oldPassword: String, newPassword: String): Future[Result] = {
      val params = Json.obj(
        "oldPassword" -> oldPassword,
        "newPassword" -> newPassword
      )

    apiRequest(s"users/$email/password")
      .transform(_.withBody(params).withMethod("PUT"))
      .execResult(apiExec)
  }
}
