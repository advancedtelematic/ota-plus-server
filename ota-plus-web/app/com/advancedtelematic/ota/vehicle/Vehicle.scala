package com.advancedtelematic.ota.vehicle

import java.util.UUID

import akka.http.scaladsl.model.Uri
import org.genivi.sota.datatype.VehicleCommon
import play.api.libs.json.Reads

final case class RegistrationAccessToken(underlying: String) extends AnyVal

final case class ClientInfo(clientId: UUID,
                            registrationUri: Uri,
                            accessToken: RegistrationAccessToken)

object ClientInfo {

  implicit val FromInformationResponseReads: Reads[ClientInfo] = ???

}

final case class Vehicle(vin: Vehicle.Vin,
                         clientInfo: ClientInfo)

object Vehicle extends VehicleCommon