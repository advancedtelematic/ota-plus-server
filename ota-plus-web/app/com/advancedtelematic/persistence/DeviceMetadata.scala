package com.advancedtelematic.persistence

import java.util.UUID

import akka.http.scaladsl.model.Uri
import org.genivi.sota.data.{Device, Uuid}
import play.api.libs.json._
import play.api.libs.functional.syntax._
import play.api.data.validation.ValidationError

/**
  * Access token obtained from Auth+ upon registering a VIN for the first time.
  */
final case class RegistrationAccessToken(underlying: String) extends AnyVal

object RegistrationAccessToken {

  import play.api.libs.json._
  import play.api.libs.json.Reads.StringReads

  implicit val RegistrationAccessTokenFormat: Format[RegistrationAccessToken] = Format(
    StringReads.map( RegistrationAccessToken.apply ),
    Writes[RegistrationAccessToken]{x => JsString(x.underlying)}
  )

}

/**
  * Data obtained from Auth+ upon registering a VIN for the first time.
  * <p>
  * NB: This is a subset of `com.advancedtelematic.authplus.client.ClientInformationResponse`
  */
final case class ClientInfo(clientId: UUID,
                            registrationUri: Uri,
                            accessToken: RegistrationAccessToken)

object ClientInfo {

  implicit val UUIDReads: Reads[UUID] = Reads.StringReads.map(UUID.fromString)

  implicit val UriReads: Reads[Uri] = Reads[Uri] {
    case JsString(uri) => JsSuccess(Uri(uri))
    case _ => JsError(Seq(JsPath() -> Seq(JsonValidationError("error.expected.jsstring"))))
  }

  implicit val FromInformationResponseReads: Reads[ClientInfo] = (
      (__ \ "client_id").read[UUID] and
      (__ \ "registration_client_uri").read[Uri] and // "/clients/4af6d75c-641e-470f-889c-55f2ba69201c",
      (__ \ "registration_access_token").read[RegistrationAccessToken] // "748bbc84-bca8-46ec-8c18-9b6ba885e962"
    )(ClientInfo.apply _)

}

/**
  * Keeps track of the association between (user-provided) [[Uuid]] and ClientID (the latter generated by Auth+).
  */
final case class DeviceMetadata(uuid: Uuid,
                                clientInfo: ClientInfo)
