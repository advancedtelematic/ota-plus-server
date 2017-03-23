package com.advancedtelematic.ota.Messages

import cats.syntax.show._
import com.advancedtelematic.ota.device.Devices._
import org.genivi.sota.data.PackageId
import org.genivi.sota.messaging.Messages._
import play.api.libs.json.{JsString, Writes, _}

object MessageWriters {

  implicit val deviceSeenWrites = new Writes[DeviceSeen] {
    def writes(deviceMsg: DeviceSeen) = Json.obj(
      "namespace" -> deviceMsg.namespace.get,
      "uuid" -> deviceMsg.uuid.show,
      "lastSeen" -> deviceMsg.lastSeen.toString
    )
  }

  implicit val deviceCreatedWrites = new Writes[DeviceCreated] {
    def writes(deviceMsg: DeviceCreated) = Json.obj(
      "namespace" -> deviceMsg.namespace.get,
      "uuid" -> deviceMsg.uuid.show,
      "deviceName" -> deviceMsg.deviceName.show,
      "deviceId" -> deviceMsg.deviceId.map(d => JsString(d.show)),
      "deviceType" -> deviceMsg.deviceType
    )
  }

  implicit val packageIdWrites = new Writes[PackageId] {
    def writes(packageId: PackageId) = Json.obj(
      "name" -> packageId.name,
      "version" -> packageId.version
    )
  }

  implicit val packageCreatedWrites = new Writes[PackageCreated] {
    def writes(packageCreatedMsg: PackageCreated) = Json.obj(
      "namespace" -> packageCreatedMsg.namespace.get,
      "id" -> Json.toJson(packageCreatedMsg.packageId),
      "packageId" -> Json.toJson(packageCreatedMsg.packageId),
      "description" -> Json.toJson(packageCreatedMsg.description.getOrElse("")),
      "vendor" -> Json.toJson(packageCreatedMsg.description.getOrElse("")),
      "signature" -> Json.toJson(packageCreatedMsg.description.getOrElse(""))
    )
  }

  implicit val packageBlacklistedWrites = new Writes[PackageBlacklisted] {
    def writes(packageBlacklistedMsg: PackageBlacklisted) = Json.obj(
      "namespace" -> packageBlacklistedMsg.namespace.get,
      "id" -> Json.toJson(packageBlacklistedMsg.packageId),
      "packageId" -> Json.toJson(packageBlacklistedMsg.packageId)
    )
  }

  implicit val updateSpecWrites = new Writes[UpdateSpec] {
    def writes(updateSpecMsg: UpdateSpec) = Json.obj(
      "namespace" -> updateSpecMsg.namespace.get,
      "device" -> updateSpecMsg.device.show,
      "packageUuid" -> Json.toJson(updateSpecMsg.packageUuid),
      "status" -> updateSpecMsg.status
    )
  }

  implicit val deviceUpdateStatusWrites = new Writes[DeviceUpdateStatus] {
    def writes(deviceUpdateStatusMsg: DeviceUpdateStatus) = Json.obj(
      "namespace" -> deviceUpdateStatusMsg.namespace.get,
      "device" -> deviceUpdateStatusMsg.device.show,
      "status" -> deviceUpdateStatusMsg.status
    )
  }
}
