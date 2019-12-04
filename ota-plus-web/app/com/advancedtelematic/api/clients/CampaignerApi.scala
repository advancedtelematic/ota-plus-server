package com.advancedtelematic.api.clients

import brave.play.{TraceData, ZipkinTraceServiceLike}
import com.advancedtelematic.api.{ApiClientExec, ApiRequest, CirceJsonBodyWritables, OtaPlusConfig}
import com.advancedtelematic.libats.data.DataType.Namespace
import play.api.Configuration
import play.api.libs.json.JsValue

import scala.concurrent.{ExecutionContext, Future}

class CampaignerApi(val conf: Configuration, val apiExec: ApiClientExec)
                   (implicit tracer: ZipkinTraceServiceLike) extends OtaPlusConfig with CirceJsonBodyWritables {

  private def request(path: String)(implicit traceData: TraceData) =
    ApiRequest.traced("campaigner", campaignerApiUri.uri + "/api/v2/" + path)

  def recentCampaigns(namespace: Namespace, limit: Int)(implicit traceData: TraceData): Future[JsValue] =
    request("campaigns")
      .transform(_.addQueryStringParameters("sortBy" -> "createdAt", "limit" -> limit.toString))
      .withNamespace(Some(namespace))
      .execJsonValue(apiExec)

  def countDevicesInCampaign(namespace: Namespace, campaignId: String)
                            (implicit traceData: TraceData, ec: ExecutionContext): Future[JsValue] =
    request(s"campaigns/$campaignId/stats")
      .withNamespace(Some(namespace))
      .execJsonValue(apiExec)
      .map(j => (j \ "processed").as[JsValue])

  def recentUpdates(namespace: Namespace, limit: Int)(implicit traceData: TraceData): Future[JsValue] =
    request("updates")
      .transform(_.addQueryStringParameters("sortBy" -> "createdAt", "limit" -> limit.toString))
      .withNamespace(Some(namespace))
      .execJsonValue(apiExec)
}

