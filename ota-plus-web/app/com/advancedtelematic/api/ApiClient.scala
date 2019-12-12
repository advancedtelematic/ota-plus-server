package com.advancedtelematic.api

import java.util.UUID

import akka.util.ByteString
import brave.play.{TraceData, TraceWSClient, ZipkinTraceServiceLike}
import com.advancedtelematic.api.ApiRequest.UserOptions
import com.advancedtelematic.controllers.{FeatureName, UserId}
import com.advancedtelematic.libats.data.DataType.Namespace
import play.api.libs.json._
import play.api.libs.ws.{BodyWritable, InMemoryBody, WSAuthScheme, WSClient, WSRequest, WSResponse}
import play.api.mvc._

import scala.concurrent.Future

object ApiVersion extends Enumeration {
  type ApiVersion = Value
  val v1, v2 = Value
}

case class UserPass(user: String, pass: String)

case class Feature(feature: FeatureName, client_id: Option[UUID], enabled: Boolean)

case class UserOrganization(namespace: Namespace, name: String, isDefault: Boolean)

object ApiRequest {
  case class UserOptions(token: Option[String] = None,
                         authuser: Option[UserPass] = None,
                         namespace: Option[Namespace] = None)

  def base(baserUrl: String): String => ApiRequest = apply(baserUrl)

  def traced(spanName: String, url: String)
            (implicit traceData: TraceData, tracer: ZipkinTraceServiceLike): ApiRequest = new ApiRequest {
    override def build: WSClient => WSRequest = ws => {
      val tracedClient = new TraceWSClient(ws, tracer)
      tracedClient.url(spanName, url).withFollowRedirects(false)
    }
  }

  def apply(baseUrl: String)(path: String): ApiRequest = new ApiRequest {
    override def build = ws => ws.url(baseUrl + path).withFollowRedirects(false)
  }
}

trait CirceJsonBodyWritables {

  implicit def circeJsonBodyWritable: BodyWritable[io.circe.Json] =
    BodyWritable(json => InMemoryBody(ByteString.fromString(json.noSpaces)), "application/json")

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
      .withToken(userOptions.token)
      .withNamespace(userOptions.namespace)
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

  def withUser(userId: UserId): ApiRequest =
    transform(_.addHttpHeaders("x-here-user-id" -> userId.id))

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
