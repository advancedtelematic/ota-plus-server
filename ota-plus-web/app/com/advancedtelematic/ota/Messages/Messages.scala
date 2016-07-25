package com.advancedtelematic.ota.Messages

import com.advancedtelematic.ota.device.Devices._
import org.genivi.sota.messaging.Messages.{DeviceCreatedMessage, DeviceSeenMessage}
import play.api.libs.json.{JsString, Writes, _}

object Messages {

  implicit val deviceSeenWrites = new Writes[DeviceSeenMessage] {
    def writes(deviceMsg: DeviceSeenMessage) = Json.obj(
      "deviceId" -> deviceMsg.deviceId.underlying.get,
      "lastSeen" -> deviceMsg.lastSeen.toString
    )
  }

  implicit val deviceCreatedWrites = new Writes[DeviceCreatedMessage] {
    def writes(deviceMsg: DeviceCreatedMessage) = Json.obj(
      "namespace" -> deviceMsg.namespace.get,
      "deviceName" -> deviceMsg.deviceName.underlying,
      "deviceId" -> deviceMsg.deviceId.map(d => JsString(d.underlying)),
      "deviceType" -> deviceMsg.deviceType
    )
  }
}
