package com.advancedtelematic.api.clients

import java.util.UUID

import brave.play.{TraceData, ZipkinTraceServiceLike}
import com.advancedtelematic.api.{ApiClientExec, ApiRequest, CirceJsonBodyWritables, OtaPlusConfig}
import com.advancedtelematic.libats.data.DataType.Namespace
import com.advancedtelematic.libtuf.data.TufDataType.RepoId
import play.api.Configuration
import play.api.libs.json.JsValue
import play.api.mvc.Result

import scala.concurrent.{ExecutionContext, Future}

class RepoServerApi(val conf: Configuration, val apiExec: ApiClientExec)(implicit tracer: ZipkinTraceServiceLike)
  extends OtaPlusConfig with CirceJsonBodyWritables {

  private def request(path: String)(implicit traceData: TraceData) =
    ApiRequest.traced("reposerver", repoApiUri.uri + "/api/v1/" + path)

  def rootJsonResult(namespace: Namespace)(implicit traceData: TraceData): Future[Result] =
    request("user_repo/root.json")
      .withNamespace(Some(namespace))
      .execResult(apiExec)

  def fetchTargets(namespace: Namespace)(implicit traceData: TraceData): Future[JsValue] =
    request("user_repo/targets.json")
      .withNamespace(Some(namespace))
      .execJsonValue(apiExec)

  def fetchRepoId(namespace: Namespace)
                 (implicit executionContext: ExecutionContext, traceData: TraceData): Future[RepoId] =
    request("user_repo/root.json")
      .withNamespace(Some(namespace))
      .transform(_.withMethod("HEAD"))
      .execResult(apiExec)
      .map(_.header.headers.find(_._1 == "x-ats-tuf-repo-id").get._2)
      .map(s => RepoId(UUID.fromString(s)))
}
