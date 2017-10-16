package com.advancedtelematic.api

import akka.Done
import cats.syntax.show.toShowOps
import com.advancedtelematic.api.ApiRequest.UserOptions
import com.advancedtelematic.api.Devices._
import com.advancedtelematic.controllers.FeatureName
import com.advancedtelematic.controllers.Auth0Config
import com.advancedtelematic.persistence.ClientInfo
import com.advancedtelematic.controllers.{UserId, UserProfile}
import com.advancedtelematic.{Auth0AccessToken, AuthPlusAccessToken, IdToken}
import java.util.UUID

import org.genivi.sota.data.{Device, Namespace, Uuid}
import play.api.libs.json._
import play.api.libs.ws.{WSAuthScheme, WSClient, WSRequest, WSResponse}
import play.api.mvc.Result
import play.api.Configuration
import play.shaded.ahc.org.asynchttpclient.util.HttpConstants.ResponseStatusCodes

import scala.concurrent.{ExecutionContext, Future}
import scala.util.Try
import scala.util.control.NoStackTrace

object ApiVersion extends Enumeration {
  type ApiVersion = Value
  val v1, v2 = Value
}

case class RemoteApiIOError(cause: Throwable) extends Exception(cause) with NoStackTrace

case class RemoteApiError(result: Result, msg: String = "") extends Exception(msg) with NoStackTrace

case class RemoteApiParseError(msg: String) extends Exception(msg) with NoStackTrace

case class UserPass(user: String, pass: String)

case class Feature(feature: FeatureName, client_id: Option[Uuid], enabled: Boolean)

object ApiRequest {
  case class UserOptions(token: Option[String] = None,
                         authuser: Option[UserPass] = None,
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
      .withAuth(userOptions.authuser)
      .withNamespace(userOptions.namespace)
      .withToken(userOptions.token)
  }

  def withAuth(auth: Option[UserPass]): ApiRequest = {
    auth map { u =>
      transform(_.withAuth(u.user, u.pass, WSAuthScheme.BASIC))
    } getOrElse self
  }

  def withNamespace(ns: Option[Namespace]): ApiRequest = {
    ns map { n =>
      transform(_.addHttpHeaders("x-ats-namespace" -> n.get))
    } getOrElse self
  }

  def withToken(token: String): ApiRequest =
    transform(_.addHttpHeaders(("Authorization", "Bearer " + token)))

  def withToken(token: Option[String]): ApiRequest =
    token.map(withToken).getOrElse(self)

  def transform(f: WSRequest => WSRequest): ApiRequest = new ApiRequest {
    override def build = ws => f(self.build(ws))
  }

  def execResponse(apiExec: ApiClientExec): Future[WSResponse] = {
    apiExec.runUnsafe(build)
  }

  def execResult(apiExec: ApiClientExec): Future[Result] = {
    apiExec.runApiResult(build)
  }

  def execStreamedResult(apiExec: ApiClientExec): Future[Result] = {
    apiExec.runStreamedResult(build)
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
    devicesRequest("devices/" + id.show).withUserOptions(options).execJson(apiExec)(DeviceR)
  }
}

/**
  * Controllers extending [[ApiClientSupport]] access [[AuthPlusApi]] endpoints using a singleton.
  */
class AuthPlusApi(val conf: Configuration, val apiExec: ApiClientExec) extends OtaPlusConfig {

  private val clientId: String     = conf.get[String]("authplus.client_id")
  private val clientSecret: String = conf.get[String]("authplus.secret")

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

  def createClientForUser(clientName: String, scope: String, token: AuthPlusAccessToken)(
      implicit ev: Reads[ClientInfo]): Future[ClientInfo] = {
    val body = Json.obj(
      "grant_types" -> List("client_credentials"),
      "client_name" -> clientName,
      "scope"       -> scope
    )
    createClient(body, token)
  }

  def getClient(clientId: Uuid, token: AuthPlusAccessToken)(implicit ec: ExecutionContext): Future[Result] = {
    authPlusRequest(s"clients/${clientId.underlying.value}")
      .withToken(token.value)
      .transform(_.withMethod("GET"))
      .execResult(apiExec)
  }

  def getClientJsValue(clientId: Uuid, token: AuthPlusAccessToken)(implicit ec: ExecutionContext): Future[JsValue] = {
    authPlusRequest(s"clients/${clientId.underlying.value}")
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

  private[this] val auth0Config    = Auth0Config(conf).get
  private val domain: String       = auth0Config.domain
  private val auth0Request         = ApiRequest.base(s"https://$domain/")
  private val auth0RequestUserData = ApiRequest.base(s"https://$domain/api/v2/users/")

  def getUserMetadata(idToken: IdToken, key: String)(implicit ec: ExecutionContext): Future[JsValue] = {
    auth0RequestUserData(idToken.userId.id)
      .withToken(idToken.value)
      .transform(_.withMethod("GET"))
      .execJsonValue(apiExec)
      .flatMap { value =>
        Future.fromTry(Try((value \ "user_metadata" \ key).validate[JsValue].get))
      }
  }

  def saveUserMetadata(idToken: IdToken, key: String, value: JsValue)(
      implicit executionContext: ExecutionContext): Future[UserProfile] = {
    val body = Json.obj("user_metadata" -> Json.obj(key -> value))
    auth0RequestUserData(idToken.userId.id)
      .withToken(idToken.value)
      .transform(_.withMethod("PATCH").withBody(body))
      .execResponse(apiExec)
      .flatMap { response =>
        if (response.status == ResponseStatusCodes.OK_200) {
          Future.successful(response.json.as(UserProfile.FromUserInfoReads))
        } else {
          Future.failed(UnexpectedResponse(response))
        }
      }
  }

  def getUserInfo(token: Auth0AccessToken): Future[JsValue] = {
    auth0Request("userinfo").withToken(token.value).transform(_.withMethod("GET")).execJsonValue(apiExec)
  }

  def queryUserProfile[A](accessToken: Auth0AccessToken)(implicit exec: ExecutionContext): Future[UserProfile] =
    getUserInfo(accessToken).map(UserProfile.FromUserInfoReads.reads).flatMap[UserProfile] {
      case JsSuccess(profile, _) =>
        Future.successful(profile)
      case JsError(errors) =>
        Future.failed(new Throwable(errors.toString()))
    }

  def changePassword(email: String)(implicit executionContext: ExecutionContext): Future[Done] = {
    val requestBody =
      Json.obj("client_id" -> auth0Config.clientId, "email" -> email, "connection" -> auth0Config.dbConnection)
    auth0Request("dbconnections/change_password")
      .transform(_.withMethod("POST").withBody(requestBody))
      .execResponse(apiExec)
      .flatMap { response =>
        if (response.status == ResponseStatusCodes.OK_200) {
          Future.successful(Done)
        } else {
          Future.failed(UnexpectedResponse(response))
        }
      }
  }
}

class UserProfileApi(val conf: Configuration, val apiExec: ApiClientExec) extends OtaPlusConfig {

  import play.api.libs.functional.syntax._

  private val userProfileRequest = ApiRequest.base(userProfileApiUri + "/api/v1/")

  implicit val featureNameR: Reads[FeatureName] = Reads.StringReads.map(FeatureName)
  implicit val featureNameW: Writes[FeatureName] = Writes.StringWrites.contramap(_.get)
  implicit val featureR: Reads[Feature] = {(
    (__ \ "feature").read[FeatureName] and
    (__ \ "client_id").readNullable[Uuid] and
    (__ \ "enabled").read[Boolean]
  )(Feature.apply _)}

  def getUser(userId: UserId): Future[JsValue] =
    userProfileRequest("users/" + userId.id).execJsonValue(apiExec)

  def getFeature(userId: UserId, feature: FeatureName): Future[Feature] =
    userProfileRequest("users/" + userId.id + "/features/" + feature.get).execJson[Feature](apiExec)

  def getFeatures(userId: UserId): Future[Seq[FeatureName]] =
    userProfileRequest("users/" + userId.id + "/features").execJson[Seq[FeatureName]](apiExec)

  def activateFeature(userId: UserId, feature: FeatureName, clientId: Uuid)
                     (implicit executionContext: ExecutionContext): Future[Result] = {
    val requestBody = Json.obj("feature" -> feature.get, "client_id" -> clientId)

    userProfileRequest(s"users/${userId.id}/features")
      .transform(_.withMethod("POST").withBody(requestBody))
      .execResult(apiExec)
  }

  def updateBillingInfo[T](userId: UserId, query: Map[String,Seq[String]], body: JsValue)
                          (implicit executionContext: ExecutionContext): Future[Result] =
    userProfileRequest(s"users/${userId.id}/billing_info")
      .transform(
        _.withMethod("PUT")
          .withQueryStringParameters(query.mapValues(_.head).toSeq :_*)
          .withBody(body))
      .execResult(apiExec)

  def getApplicationIds(userId: UserId): Future[Seq[Uuid]] =
    userProfileRequest(s"users/${userId.id}/applications").execJson[Seq[Uuid]](apiExec)

  private def applicationIdRequest(method: String, userId: UserId, clientId: Uuid): Future[Result] =
    userProfileRequest(s"users/${userId.id}/applications/${clientId.underlying.value}").transform(_.withMethod(method))
      .execResult(apiExec)

  def addApplicationId(userId: UserId, clientId: Uuid): Future[Result] =
    applicationIdRequest("PUT", userId, clientId)

  def removeApplicationId(userId: UserId, clientId: Uuid): Future[Result] =
    applicationIdRequest("DELETE", userId, clientId)
}

class BuildSrvApi(val conf: Configuration, val apiExec: ApiClientExec) extends OtaPlusConfig {

  private val buildSrvRequest = ApiRequest.base(buildSrvApiUri + "/")

  def download(artifact_type: String, params: Map[String, Seq[String]])
    (implicit ec: ExecutionContext) : Future[Result] = {

    buildSrvRequest(s"api/v1/artifacts/$artifact_type/download")
      .transform(
        _.withMethod("POST")
          .withBody(params))
      .execStreamedResult(apiExec)
  }

  def download(artifact_type: String, clientId: Uuid, clientSecret: String)
    (implicit ec: ExecutionContext) : Future[Result] = {

    buildSrvRequest(s"api/v1/artifacts/$artifact_type/download")
      .transform(
        _.withMethod("POST")
          .withBody(Map("client_id" -> Seq(clientId.underlying.value), "client_secret" -> Seq(clientSecret))))
      .execStreamedResult(apiExec)
  }
}
