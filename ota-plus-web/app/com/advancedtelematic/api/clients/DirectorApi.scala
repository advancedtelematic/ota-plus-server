package com.advancedtelematic.api.clients

import brave.play.{TraceData, ZipkinTraceServiceLike}
import com.advancedtelematic.api.{ApiClientExec, ApiRequest, CirceJsonBodyWritables, OtaPlusConfig}
import com.advancedtelematic.libats.data.DataType.Namespace
import play.api.Configuration
import play.api.libs.json.{JsArray, JsObject, JsString, JsValue}

import scala.concurrent.{ExecutionContext, Future}

class DirectorApi(val conf: Configuration, val apiExec: ApiClientExec)
                 (implicit tracer: ZipkinTraceServiceLike) extends OtaPlusConfig with CirceJsonBodyWritables {

  private def request(path: String)(implicit traceData: TraceData) =
    ApiRequest.traced("director", directorApiUri.uri + "/api/v1/" + path)

  def fetchEcuTypes(namespace: Namespace, updateId: String)
                   (implicit traceData: TraceData, ec: ExecutionContext): Future[JsValue] =
    request(s"multi_target_updates/$updateId")
      .withNamespace(Some(namespace))
      .execJson[JsObject](apiExec)
      .map(_.keys.toSeq.sorted.map(JsString))
      .map(JsArray(_))
}
