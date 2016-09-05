package com.advancedtelematic.ota.Messages

import cats.syntax.show._
import com.advancedtelematic.ota.device.Devices._
import org.genivi.sota.messaging.Messages.{DeviceCreated, DeviceDeleted, DeviceSeen, PackageCreated, UpdateSpec}
import play.api.libs.json.{JsString, Writes, _}

object MessageWriters {

  implicit val deviceSeenWrites = new Writes[DeviceSeen] {
    def writes(deviceMsg: DeviceSeen) = Json.obj(
      "uuid" -> deviceMsg.uuid.show,
      "lastSeen" -> deviceMsg.lastSeen.toString
    )
  }

  implicit val deviceCreatedWrites = new Writes[DeviceCreated] {
    def writes(deviceMsg: DeviceCreated) = Json.obj(
      "namespace" -> deviceMsg.namespace.get,
      "deviceName" -> deviceMsg.deviceName.show,
      "deviceId" -> deviceMsg.deviceId.map(d => JsString(d.show)),
      "deviceType" -> deviceMsg.deviceType
    )
  }

  implicit val deviceDeletedWrites = new Writes[DeviceDeleted] {
    def writes(deviceMsg: DeviceDeleted) = Json.obj(
      "namespace" -> deviceMsg.namespace.get,
      "uuid" -> deviceMsg.uuid.show
    )
  }

  implicit val packageCreatedWrites = new Writes[PackageCreated] {
    def writes(packageCreatedMsg: PackageCreated) = Json.obj(
      "namespace" -> packageCreatedMsg.namespace.get,
      "packageId" -> Json.toJson(packageCreatedMsg.packageId),
      "description" -> Json.toJson(packageCreatedMsg.description.getOrElse("")),
      "vendor" -> Json.toJson(packageCreatedMsg.description.getOrElse("")),
      "signature" -> Json.toJson(packageCreatedMsg.description.getOrElse(""))
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
}
