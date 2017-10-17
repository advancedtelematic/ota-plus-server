package com.advancedtelematic.api

import cats.Show
import eu.timepit.refined._
import eu.timepit.refined.api.{Refined, Validate}
import java.time.Instant

import com.advancedtelematic.libats.codecs.{DeserializationException, RefinementError}
import org.genivi.sota.data.DeviceStatus
import org.genivi.sota.data.{CredentialsType, Device, DeviceT, Namespace, Uuid}
import play.api.libs.functional.syntax._
import play.api.libs.json._


object Devices {

  import Device._

  // Reads
  implicit def refinedReader[T, P](implicit reads: Reads[T], p: Validate.Plain[T, P]): Reads[Refined[T, P]] =
    reads.map { t =>
      refineV[P](t) match {
        case Left(e) =>
          throw new DeserializationException(RefinementError(t, e))
        case Right(r) => r
      }
    }

  implicit def idReads(implicit r: Reads[Refined[String, Uuid.Valid]]): Reads[Uuid] = r.map(Uuid(_))

  implicit val deviceIdReads: Reads[DeviceId] = Reads.StringReads.map(DeviceId)

  implicit val namespaceReads: Reads[Namespace] = Reads.StringReads.map(Namespace(_))

  implicit val DeviceTypeR: Reads[DeviceType.Value] = Reads.enumNameReads(Device.DeviceType)

  implicit val InstantR: Reads[Instant] = Reads[Instant] { js => Reads.DefaultDateReads.reads(js).map(_.toInstant) }

  implicit val DeviceStatusR: Reads[DeviceStatus.Value] = Reads.enumNameReads(DeviceStatus)

  implicit val CrededentialsTypeR: Reads[CredentialsType.Value] = Reads.enumNameReads(CredentialsType)

  implicit val DeviceTR: Reads[DeviceT] = Json.reads[DeviceT]

  implicit val DeviceR: Reads[Device] = {(
    (__ \ "namespace").read[Namespace] and
      (__ \ "uuid").read[Uuid] and
      (__ \ "deviceName").read[DeviceName] and
      (__ \ "deviceId").readNullable[DeviceId] and
      (__ \ "deviceType").read[DeviceType] and
      (__ \ "lastSeen").readNullable[Instant] and
      (__ \ "createdAt").read[Instant] and
      (__ \ "activatedAt").readNullable[Instant] and
      (__ \ "deviceStatus").read[DeviceStatus.Value]
    )(Device.apply _)}


  // Writes

  implicit def refinedWriter[T, P](implicit w: Writes[T]): Writes[Refined[T, P]] = w.contramap(_.value)

  implicit def showWrites[T, P](implicit ev: Show[T]): Writes[T] = Writes.StringWrites.contramap(p => ev.show(p))

  implicit val DeviceTypeW: Writes[DeviceType.Value] = Writes.enumNameWrites[Device.DeviceType.type]

  implicit val namespaceWrites: Writes[Namespace] = Writes.StringWrites.contramap(n => n.toString)

  implicit val InstantW: Writes[Instant] = Writes.StringWrites.contramap(i => i.toString)

  implicit val DeviceStatusW: Writes[DeviceStatus.Value] = Writes.enumNameWrites[DeviceStatus.type]

  implicit val DeviceTW: Writes[DeviceT] = Json.writes[DeviceT]

  implicit val DeviceW: Writes[Device] = (
    (__ \ "namespace").write[Namespace] and
      (__ \ "uuid").write[Uuid] and
      (__ \ "deviceName").write[DeviceName] and
      (__ \ "deviceId").writeNullable[DeviceId] and
      (__ \ "deviceType").write[DeviceType] and
      (__ \ "lastSeen").writeNullable[Instant] and
      (__ \ "createdAt").write[Instant] and
      (__ \ "activatedAt").writeNullable[Instant] and
      (__ \ "deviceStatus").write[DeviceStatus.Value]
    )(unlift(Device.unapply))
}

