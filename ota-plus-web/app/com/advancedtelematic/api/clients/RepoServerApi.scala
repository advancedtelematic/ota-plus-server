package com.advancedtelematic.api.clients

import brave.play.{TraceData, ZipkinTraceServiceLike}
import com.advancedtelematic.api.{ApiClientExec, ApiRequest, CirceJsonBodyWritables, OtaPlusConfig}
import com.advancedtelematic.libats.data.DataType.Namespace
import play.api.Configuration
import play.api.libs.json.JsValue
import play.api.mvc.Result

import scala.concurrent.Future

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
}
