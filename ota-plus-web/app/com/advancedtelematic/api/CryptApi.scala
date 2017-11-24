package com.advancedtelematic.api

import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.model.Uri.{NamedHost, Path}
import java.time.Instant
import java.util.UUID

import play.api.Configuration
import play.api.http.HttpEntity
import play.api.libs.json._
import play.shaded.ahc.org.asynchttpclient.util.HttpConstants.ResponseStatusCodes

import scala.concurrent.{ExecutionContext, Future}

final case class CryptAccountInfo(name: String, hostName: NamedHost)

object CryptAccountInfo {
  import play.api.libs.functional.syntax._

  implicit val NamedHostReads: Reads[NamedHost] = Reads.StringReads.map(NamedHost.apply)
  implicit val NamedHostWrites: Writes[NamedHost] = Writes.StringWrites.contramap(_.address)
  implicit val ReadsInstance: Format[CryptAccountInfo] =
    ((__ \ "subject").format[String] and (__ \ "hostName")
      .format[NamedHost])(CryptAccountInfo.apply, unlift(CryptAccountInfo.unapply))

}

final case class SerialNumber(data: String) extends AnyVal

object SerialNumber {
  import play.api.libs.functional.syntax._

  implicit val SerialNumberReads: Reads[SerialNumber] = Reads.StringReads.map(SerialNumber.apply)
  implicit val SerialNumberWrites: Writes[SerialNumber] = Writes.StringWrites.contramap(_.data)
}

final case class DeviceRegistrationCredentials(uuid: UUID,
                                               description: String,
                                               validFrom: Instant,
                                               validUntil: Instant)

object DeviceRegistrationCredentials {
  import play.api.libs.functional.syntax._

  implicit val PathReads: Reads[Path] = Reads.StringReads.map(Path.apply(_))
  implicit val PathWrites: Writes[Path] = Writes.StringWrites.contramap(_.toString)

  implicit val FormatInstance: Format[DeviceRegistrationCredentials] =
    ((__ \ "id").format[UUID] and
     (__ \ "description").format[String] and
     (__ \ "validFrom").format[Instant] and
     (__ \ "validUntil").format[Instant]
    )(DeviceRegistrationCredentials.apply, unlift(DeviceRegistrationCredentials.unapply))
}

class CryptApi(conf: Configuration, val apiExec: ApiClientExec)(implicit exec: ExecutionContext) {
  import play.shaded.ahc.org.asynchttpclient.util.HttpConstants.Methods._

  val baseUri = ApiRequest.base(conf.underlying.getString("crypt.uri"))

  def registerAccount(accountName: String): Future[CryptAccountInfo] = {
    baseUri(s"/accounts/$accountName").transform(_.withMethod(PUT)).execJson[CryptAccountInfo](apiExec)
  }

  def getAccount[T](accountName: String, parseT: JsValue => JsResult[T]): Future[Option[T]] = {
    baseUri(s"/accounts/$accountName")
      .transform(_.withMethod(GET))
      .execResponse(apiExec)
      .flatMap[Option[T]] { response =>
      response.status match {
        case ResponseStatusCodes.OK_200 =>
          parseT(response.json) match {
            case JsSuccess(x, _) => Future.successful(Some(x))
            case JsError(errors) =>
              Future.failed(MalformedResponse(errors.toString(), response))
          }
        case StatusCodes.NotFound.intValue =>
          Future.successful(None)

        case _ =>
          Future.failed(UnexpectedResponse(response))
      }
    }
  }

  def getAccountInfo(accountName: String): Future[Option[CryptAccountInfo]] = {
    getAccount(accountName, _.validate[CryptAccountInfo])
  }

  def getCredentials(accountName: String): Future[Option[Seq[DeviceRegistrationCredentials]]] = {
    getAccount(accountName, x =>
      (x \ "deviceRegistrationCredentials").validate[Map[String, DeviceRegistrationCredentials]])
      .map(_.map(_.values.toSeq))
  }

  def credentialsRegistration(accountName: String,
                              description: String,
                              ttl: Long): Future[DeviceRegistrationCredentials] = {
    val requestBody = Json.obj("description" -> description, "ttl" -> ttl)
    baseUri(s"/accounts/$accountName/credentials/registration")
      .transform(_.withMethod(POST))
      .transform(_.withBody(requestBody))
      .execJson[DeviceRegistrationCredentials](apiExec)
  }

  def downloadCredentials(accountName: String, id: UUID): Future[HttpEntity] =
    baseUri(s"/accounts/$accountName/credentials/registration/$id")
      .transform(_.withMethod(GET))
      .execResult(apiExec)
      .map(_.body)

}
