package com.advancedtelematic.api

import com.advancedtelematic.api.ApiRequest.UserOptions
import cats.Show
import com.advancedtelematic.ota.device.Devices._
import com.advancedtelematic.ota.vehicle.ClientInfo
import org.genivi.sota.data.{Device, DeviceT}
import org.genivi.sota.data.Vehicle.Vin
import org.genivi.sota.data.Namespace.Namespace
import org.genivi.webserver.controllers.OtaPlusConfig
import play.api.Configuration
import play.api.libs.json._
import play.api.libs.ws.{WSClient, WSRequest, WSResponse}
import play.api.mvc.{Result, Results}
import scala.concurrent.Future
import scala.util.control.NoStackTrace
import cats.syntax.show.toShowOps


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

class CoreApi(val conf: Configuration, val apiExec: ApiClientExec) extends OtaPlusConfig {
  val apiRequest = ApiRequest.base(coreApiUri + "/api/v1/")

  def search(options: UserOptions, params: Seq[(String, String)]): Future[Result] =
    apiRequest("devices")
      .withUserOptions(options)
      .transform(_.withQueryString(params:_*))
      .execResult(apiExec)
}

class ResolverApi(val conf: Configuration, val apiExec: ApiClientExec) extends OtaPlusConfig {
  val apiRequest = ApiRequest.base(resolverApiUri + "/api/v1/")

  def createDevice(options: UserOptions, device: DeviceT): Future[Result] =
    device.deviceId match {
      case Some(id) =>
        apiRequest("vehicles/" + implicitly[Show[Device.DeviceId]].show(id))
          .withUserOptions(options)
          .transform(_.withMethod("PUT"))
          .execResult(apiExec)
      case None => Future.successful(Results.NoContent) // TODO handle empty device Ids
    }
}

class DevicesApi(val conf: Configuration, val apiExec: ApiClientExec) extends OtaPlusConfig {
  val apiRequest = ApiRequest.base(devicesApiUri + "/api/v1/")

  def createDevice(options: UserOptions, device: DeviceT): Future[Device.Id] = {
    import com.advancedtelematic.ota.device.Devices.idReads

    apiRequest("devices")
      .withUserOptions(options)
      .transform(_.withMethod("POST").withBody(Json.toJson(device)))
      .execJson(apiExec)(idReads)
  }

  def search(options: UserOptions, params: Seq[(String, String)]): Future[Result] = {
    val _params = params ++ options.namespace.map(n => "namespace" -> n.get.toString).toSeq

    apiRequest("devices")
      .withUserOptions(options)
      .transform(_.withQueryString(_params:_*))
      .execResult(apiExec)
  }
}

class AuthPlusApi(val conf: Configuration, val apiExec: ApiClientExec) extends OtaPlusConfig {

  val apiRequest = ApiRequest.base(authPlusApiUri + "/")

  def createClient(device: Device.Id)(implicit ev: Reads[ClientInfo]): Future[ClientInfo] = {
    val request = Json.obj(
      "grant_types" -> List("client_credentials"),
      "client_name" -> device.show,
      "scope" -> List(s"ota-core.${device.show}.write", s"ota-core.${device.show}.read")
    )

    apiRequest("clients")
      .transform(_.withBody(request).withMethod("POST"))
      .execJson(apiExec)(ev)
  }

  def changePassword(token: String, email: String, oldPassword: String, newPassword: String): Future[Result] = {
      val params = Json.obj(
        "oldPassword" -> oldPassword,
        "newPassword" -> newPassword
      )

    apiRequest(s"users/$email/password")
      .withToken(token)
      .transform(_.withBody(params).withMethod("PUT"))
      .execResult(apiExec)
  }
}
