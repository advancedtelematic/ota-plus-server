package com.advancedtelematic.ota.Messages

import com.advancedtelematic.ota.device.Devices._
import org.genivi.sota.messaging.Messages.{DeviceCreated, DeviceDeleted, DeviceSeen}
import play.api.libs.json.{JsString, Writes, _}

object Messages {

  implicit val deviceSeenWrites = new Writes[DeviceSeen] {
    def writes(deviceMsg: DeviceSeen) = Json.obj(
      "deviceId" -> deviceMsg.deviceId.underlying.get,
      "lastSeen" -> deviceMsg.lastSeen.toString
    )
  }

  implicit val deviceCreatedWrites = new Writes[DeviceCreated] {
    def writes(deviceMsg: DeviceCreated) = Json.obj(
      "namespace" -> deviceMsg.namespace.get,
      "deviceName" -> deviceMsg.deviceName.underlying,
      "deviceId" -> deviceMsg.deviceId.map(d => JsString(d.underlying)),
      "deviceType" -> deviceMsg.deviceType
    )
  }

  implicit val deviceDeletedWrites = new Writes[DeviceDeleted] {
    def writes(deviceMsg: DeviceDeleted) = Json.obj(
      "namespace" -> deviceMsg.ns.get,
      "deviceId" -> deviceMsg.id.underlying.get
    )
  }
}
