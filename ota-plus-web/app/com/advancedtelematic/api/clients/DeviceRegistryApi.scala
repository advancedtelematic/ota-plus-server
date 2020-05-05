package com.advancedtelematic.api.clients

import brave.play.{TraceData, ZipkinTraceServiceLike}
import com.advancedtelematic.api.{ApiClientExec, ApiRequest, CirceJsonBodyWritables, OtaPlusConfig}
import com.advancedtelematic.libats.data.DataType.Namespace
import play.api.Configuration
import play.api.libs.json.JsValue

import scala.concurrent.Future

class DeviceRegistryApi(val conf: Configuration, val apiExec: ApiClientExec)
                       (implicit tracer: ZipkinTraceServiceLike) extends OtaPlusConfig with CirceJsonBodyWritables {

  private def request(path: String)(implicit traceData: TraceData) =
    ApiRequest.traced("device-registry", devicesApiUri.uri + "/api/v1/" + path)

  def recentDevices(namespace: Namespace, limit: Int)(implicit traceData: TraceData): Future[JsValue] =
    request("devices")
      .transform(_.addQueryStringParameters("sortBy" -> "createdAt", "limit" -> limit.toString))
      .withNamespace(Some(namespace))
      .execJsonValue(apiExec)

  def recentDeviceGroups(namespace: Namespace, limit: Int)(implicit traceData: TraceData): Future[JsValue] =
    request("device_groups")
      .transform(_.addQueryStringParameters("sortBy" -> "createdAt", "limit" -> limit.toString))
      .withNamespace(Some(namespace))
      .execJsonValue(apiExec)

  def countDevicesInGroup(namespace: Namespace, groupId: String)(implicit traceData: TraceData): Future[JsValue] =
    request(s"device_groups/$groupId/count")
      .withNamespace(Some(namespace))
      .execJsonValue(apiExec)

  def availableDeviceTags(namespace: Namespace)(implicit traceData: TraceData): Future[JsValue] =
    request(s"device_tags")
      .withNamespace(Some(namespace))
      .execJsonValue(apiExec)
}
