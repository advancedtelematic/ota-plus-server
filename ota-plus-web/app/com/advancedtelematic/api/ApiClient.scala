package com.advancedtelematic.api

import java.util.UUID

import com.advancedtelematic.{AuthPlusAccessToken, IdToken}
import com.advancedtelematic.api.ApiRequest.UserOptions
import com.advancedtelematic.ota.device.Devices._
import com.advancedtelematic.ota.vehicle.ClientInfo
import org.genivi.sota.data.{Device, DeviceT, Namespace, Uuid}
import org.genivi.webserver.controllers.OtaPlusConfig
import play.api.Configuration
import play.api.libs.json._
import play.api.libs.ws.{WSAuthScheme, WSClient, WSRequest, WSResponse}
import play.api.mvc.Result

import scala.concurrent.{ExecutionContext, Future}
import scala.util.control.NoStackTrace
import cats.syntax.show.toShowOps

import scala.util.Try

case class RemoteApiIOError(cause: Throwable) extends Exception(cause) with NoStackTrace

case class RemoteApiError(result: Result, msg: String = "") extends Exception(msg) with NoStackTrace

case class RemoteApiParseError(msg: String) extends Exception(msg) with NoStackTrace

case class UserPass(user: String, pass: String)

object ApiRequest {
  case class UserOptions(token: Option[String] = None,
                         authuser: Option[UserPass] = None,
                         traceId: Option[String] = None,
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
    self.withAuth(userOptions.authuser)
      .withNamespace(userOptions.namespace)
      .withToken(userOptions.token)
      .withTraceId(userOptions.traceId)
  }

  def withAuth(auth: Option[UserPass]): ApiRequest = {
    auth map { u =>
      transform(_.withAuth(u.user, u.pass, WSAuthScheme.BASIC))
    } getOrElse self
  }

  def withNamespace(ns: Option[Namespace]): ApiRequest = {
    ns map { n =>
      transform(_.withHeaders("x-ats-namespace" -> n.get))
    } getOrElse self
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

  def execJsonValue(apiExec: ApiClientExec): Future[JsValue] = {
    apiExec.runApiJsonValue(build)
  }

  def execJson[T](apiExec: ApiClientExec)(implicit ev: Reads[T]): Future[T] = {
    apiExec.runApiJson[T](build)
  }
}


/**
  * Controllers extending [[ApiClientSupport]] access [[DevicesApi]] endpoints using a singleton.
  */
class DevicesApi(val conf: Configuration, val apiExec: ApiClientExec) extends OtaPlusConfig {
  private val devicesRequest = ApiRequest.base(devicesApiUri + "/api/v1/")

  def getDevice(options: UserOptions, id: Uuid): Future[Device] = {
    devicesRequest("devices/" + id.show)
      .withUserOptions(options)
      .execJson(apiExec)(DeviceR)
  }
}

/**
  * Controllers extending [[ApiClientSupport]] access [[AuthPlusApi]] endpoints using a singleton.
  */
class AuthPlusApi(val conf: Configuration, val apiExec: ApiClientExec) extends OtaPlusConfig {

  private val clientId: String     = conf.getString("authplus.client_id").get
  private val clientSecret: String = conf.getString("authplus.secret").get

  private val authPlusRequest = ApiRequest.base(authPlusApiUri + "/")

  def createClient(body: JsValue, token: AuthPlusAccessToken)(implicit ev: Reads[ClientInfo]): Future[ClientInfo] = {
    authPlusRequest("clients")
      .withToken(token.value)
      .transform(_.withBody(body).withMethod("POST"))
      .execJson(apiExec)(ev)
  }

  def createClient(device: Uuid, token: AuthPlusAccessToken)(implicit ev: Reads[ClientInfo]): Future[ClientInfo] = {
    val body = Json.obj(
        "grant_types" -> List("client_credentials"),
        "client_name" -> device.show,
        "scope"       -> s"ota-core.${device.show}.write ota-core.${device.show}.read"
    )
    createClient(body, token)
  }

  def createClientForUser(ns: Namespace, clientName: String, token: AuthPlusAccessToken)(implicit ev: Reads[ClientInfo])
    : Future[ClientInfo] = {
    val body = Json.obj(
        "grant_types" -> List("client_credentials"),
        "client_name" -> clientName,
        "scope"       -> s"namespace.${ns.get}"
    )
    createClient(body, token)
  }

  def getClient(clientId: Uuid, token: AuthPlusAccessToken)(implicit ec: ExecutionContext): Future[Result] = {
    authPlusRequest(s"clients/${clientId.underlying.get}")
      .withToken(token.value)
      .transform(_.withMethod("GET"))
      .execResult(apiExec)
  }

  def getClientJsValue(clientId: Uuid, token: AuthPlusAccessToken)(implicit ec: ExecutionContext): Future[JsValue] = {
    authPlusRequest(s"clients/${clientId.underlying.get}")
      .withToken(token.value)
      .transform(_.withMethod("GET"))
      .execJsonValue(apiExec)
  }


  /**
    * The response is json for `com.advancedtelematic.authplus.client.ClientInformationResponse`
    * for a ClientID:
    * <ul>
    *   <li>the ClientID was generated by Auth+ upon registering a DeviceID</li>
    *   <li>the web-app persisted the association DeviceID -> ClientID</li>
    * </ul>
    */
  def fetchClientInfo(clientID: UUID, token: AuthPlusAccessToken)(implicit ec: ExecutionContext): Future[JsValue] = {
    authPlusRequest(s"clients/${clientID.toString}")
      .withToken(token.value)
      .transform(_.withMethod("GET"))
      .execJsonValue(apiExec)
  }

  def fetchSecret(clientID: UUID, token: AuthPlusAccessToken)(implicit ec: ExecutionContext): Future[String] = {
    fetchClientInfo(clientID, token).flatMap { parsed =>
      val t2: Try[String] = Try((parsed \ "client_secret").validate[String].get)
      Future.fromTry(t2)
    }
  }

}

class Auth0Api(val conf: Configuration, val apiExec: ApiClientExec) extends OtaPlusConfig {

  private val domain: String       = conf.getString("auth0.domain").get
  private val auth0Request         = ApiRequest.base(s"https://${domain}/")
  private val auth0RequestUserData = ApiRequest.base(s"https://${domain}/api/v2/users/")

  def getUserMetadata(userId: String, idToken: IdToken, key: String)
  (implicit ec: ExecutionContext) : Future[JsValue] = {
    auth0RequestUserData(userId)
      .withToken(idToken.value)
      .transform(_.withMethod("GET"))
      .execJsonValue(apiExec)
      .flatMap { value =>
        Future.fromTry(Try((value \ "user_metadata" \ key).validate[JsValue].get))
      }
  }

  def saveUserMetadata(userId: String, idToken: IdToken, key: String, value: JsValue) : Future[Result] = {
    val body = Json.obj("user_metadata" -> Json.obj(key -> value))
    auth0RequestUserData(userId)
      .withToken(idToken.value)
      .transform(_.withMethod("PATCH").withBody(body))
      .execResult(apiExec)
  }

}
