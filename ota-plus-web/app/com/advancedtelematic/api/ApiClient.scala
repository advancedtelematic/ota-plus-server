package com.advancedtelematic.api

import java.util.UUID

import com.advancedtelematic.api.ApiRequest.UserOptions
import com.advancedtelematic.ota.device.Devices._
import com.advancedtelematic.ota.vehicle.ClientInfo
import org.genivi.sota.data.{Device, DeviceT, Namespace}
import org.genivi.webserver.controllers.OtaPlusConfig
import play.api.Configuration
import play.api.libs.json._
import play.api.libs.ws.WSAuthScheme.BASIC
import play.api.libs.ws.{WSClient, WSRequest, WSResponse}
import play.api.mvc.{Result, Results}

import scala.concurrent.{ExecutionContext, Future}
import scala.util.control.NoStackTrace
import cats.syntax.show.toShowOps

import scala.util.Try


case class RemoteApiIOError(cause: Throwable) extends Exception(cause) with NoStackTrace

case class RemoteApiError(result: Result, msg: String = "") extends Exception(msg) with NoStackTrace

case class RemoteApiParseError(msg: String) extends Exception(msg) with NoStackTrace

object ApiRequest {
  case class UserOptions(token: Option[String] = None, traceId: Option[String] = None,
                         namespace: Option[Namespace] = None)

  def base(baserUrl: String): String => ApiRequest = apply(baserUrl)

  def apply(baseUrl: String)(path: String): ApiRequest = new ApiRequest {
    override def build = ws => ws.url(baseUrl + path).withFollowRedirects(false)
  }
}

/**
  * Common utilities to simplify building requests for micro-services.
  * <p>
  * Each [[OtaPlusConfig]] subclass ( one each for core, resolver, device-registry, and auth-plus )
  * owns a dedicated [[ApiRequest]] created via [[ApiRequest.apply]].
  */
trait ApiRequest { self =>
  def build: WSClient => WSRequest

  def withUserOptions(userOptions: UserOptions): ApiRequest = {
    self
      .withToken(userOptions.token)
      .withTraceId(userOptions.traceId)
  }

  def withTraceId(traceId: Option[String]): ApiRequest = {
    traceId map { t =>
      transform(_.withHeaders("x-ats-traceid" -> t))
    } getOrElse self
  }

  def withToken(token: String): ApiRequest =
    transform(_.withHeaders(("Authorization", "Bearer " + token)))

  def withToken(token: Option[String]): ApiRequest =
    token.map(withToken).getOrElse(self)

  def transform(f: WSRequest => WSRequest): ApiRequest = new ApiRequest {
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

/**
  * Controllers extending [[ApiClientSupport]] access [[CoreApi]] endpoints using a singleton.
  */
class CoreApi(val conf: Configuration, val apiExec: ApiClientExec) extends OtaPlusConfig {
  private val coreRequest = ApiRequest.base(coreApiUri + "/api/v1/")

  def search(options: UserOptions, params: Seq[(String, String)]): Future[Result] =
    coreRequest("devices")
      .withUserOptions(options)
      .transform(_.withQueryString(params:_*))
      .execResult(apiExec)
}

/**
  * Controllers extending [[ApiClientSupport]] access [[DevicesApi]] endpoints using a singleton.
  */
class DevicesApi(val conf: Configuration, val apiExec: ApiClientExec) extends OtaPlusConfig {
  private val devicesRequest = ApiRequest.base(devicesApiUri + "/api/v1/")

  def getDevice(options: UserOptions, id: Device.Id): Future[Result] = {
    devicesRequest("devices/" + id.show)
      .withUserOptions(options)
      .execResult(apiExec)
  }

  def createDevice(options: UserOptions, device: DeviceT): Future[Device.Id] = {
    import com.advancedtelematic.ota.device.Devices.idReads

    devicesRequest("devices")
      .withUserOptions(options)
      .transform(_.withMethod("POST").withBody(Json.toJson(device)))
      .execJson(apiExec)(idReads)
  }

  def search(options: UserOptions, params: Seq[(String, String)]): Future[Result] = {
    val _params = params ++ options.namespace.map(n => "namespace" -> n.get.toString).toSeq

    devicesRequest("devices")
      .withUserOptions(options)
      .transform(_.withQueryString(_params:_*))
      .execResult(apiExec)
  }
}

/**
  * Controllers extending [[ApiClientSupport]] access [[AuthPlusApi]] endpoints using a singleton.
  */
class AuthPlusApi(val conf: Configuration, val apiExec: ApiClientExec) extends OtaPlusConfig {

  private val authPlusRequest = ApiRequest.base(authPlusApiUri + "/")

  def createClient(device: Device.Id)(implicit ev: Reads[ClientInfo]): Future[ClientInfo] = {
    val request = Json.obj(
      "grant_types" -> List("client_credentials"),
      "client_name" -> device.show,
      "scope" -> List(s"ota-core.${device.show}.write", s"ota-core.${device.show}.read")
    )

    authPlusRequest("clients")
      .transform(_.withBody(request).withMethod("POST"))
      .execJson(apiExec)(ev)
  }

  def changePassword(token: String, email: String, oldPassword: String, newPassword: String): Future[Result] = {
    val params = Json.obj(
      "oldPassword" -> oldPassword,
      "newPassword" -> newPassword
    )

    authPlusRequest(s"users/$email/password")
      .withToken(token)
      .transform(_.withBody(params).withMethod("PUT"))
      .execResult(apiExec)
  }

  def passwordResetToken(client_id: String, secret: String, email: String)
                        (implicit ec: ExecutionContext) : Future[Option[String]] =
    authPlusRequest(s"users/$email/password_reset").transform(_.withAuth(client_id, secret, BASIC))
      .execResponse(apiExec)
      .map {
        res => (res.json \ "tokenValue").asOpt[String]
      }

  def resetPassword(passwordResetToken: String, newPassword: String): Future[Result] = {
    val params = Json.obj(
      "tokenValue" -> passwordResetToken,
      "newPassword" -> newPassword
    )

    authPlusRequest(s"password_reset")
      .transform(_.withBody(params).withMethod("POST"))
      .execResult(apiExec)
  }

  /**
    * The response is json for `com.advancedtelematic.authplus.client.ClientInformationResponse`
    * for a ClientID:
    * <ul>
    *   <li>the ClientID was generated by Auth+ upon registering a DeviceID</li>
    *   <li>the web-app persisted the association DeviceID -> ClientID</li>
    * </ul>
    */
  def fetchClientInfo(clientID: UUID)(implicit ec: ExecutionContext): Future[JsValue] = {
    authPlusRequest(s"clients/${clientID.toString}")
      .transform(_.withMethod("GET"))
      .execResponse(apiExec)
      .flatMap { wresp =>
        val t2: Try[JsValue] = Try( wresp.json )
        Future.fromTry(t2)
      }
  }

  def fetchSecret(clientID: UUID)(implicit ec: ExecutionContext): Future[String] = {
    fetchClientInfo(clientID)
      .flatMap { parsed =>
        val t2: Try[String] = Try( (parsed \ "client_secret").validate[String].get )
        Future.fromTry(t2)
      }
  }

}
