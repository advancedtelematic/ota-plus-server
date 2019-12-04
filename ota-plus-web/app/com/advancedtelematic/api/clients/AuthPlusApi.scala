package com.advancedtelematic.api.clients

import java.util.UUID

import brave.play.{TraceData, ZipkinTraceServiceLike}
import com.advancedtelematic.api.{ApiClientExec, ApiRequest, OtaPlusConfig}
import com.advancedtelematic.auth.AccessToken
import play.api.Configuration
import play.api.libs.json.JsValue

import scala.concurrent.{ExecutionContext, Future}
import scala.util.Try

class AuthPlusApi(val conf: Configuration, val apiExec: ApiClientExec)
                 (implicit tracer: ZipkinTraceServiceLike) extends OtaPlusConfig {
  /**
   * The response is json for `com.advancedtelematic.authplus.client.ClientInformationResponse`
   * for a ClientID:
   * <ul>
   *   <li>the ClientID was generated by Auth+ upon registering a DeviceID</li>
   *   <li>the web-app persisted the association DeviceID -> ClientID</li>
   * </ul>
   */
  def fetchClientInfo(clientID: UUID, token: AccessToken)(implicit traceData: TraceData): Future[JsValue] = {
    ApiRequest.traced("auth-plus", authPlusApiUri.uri + s"/clients/${clientID.toString}")
      .withToken(token.value)
      .transform(_.withMethod("GET"))
      .execJsonValue(apiExec)
  }

  def fetchSecret(clientID: UUID, token: AccessToken)
                 (implicit ec: ExecutionContext, traceData: TraceData): Future[String] = {
    fetchClientInfo(clientID, token).flatMap { parsed =>
      val t2: Try[String] = Try((parsed \ "client_secret").validate[String].get)
      Future.fromTry(t2)
    }
  }

}