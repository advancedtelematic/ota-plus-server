package com.advancedtelematic.api

import java.time.Instant
import java.util.UUID

import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.model.Uri
import akka.http.scaladsl.model.Uri.{NamedHost, Path}
import brave.play.{TraceData, ZipkinTraceServiceLike}
import play.api.Configuration
import play.api.http.{HttpEntity, Status}
import play.api.libs.json._
import play.shaded.ahc.org.asynchttpclient.util.HttpConstants.ResponseStatusCodes

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}

final case class CryptAccountInfo(name: String, hostName: NamedHost)

object CryptAccountInfo {
  import play.api.libs.functional.syntax._

  implicit val NamedHostReads: Reads[NamedHost] = Reads.StringReads.map(NamedHost.apply)
  implicit val NamedHostWrites: Writes[NamedHost] = Writes.StringWrites.contramap(_.address)
  implicit val UriWrites: Writes[Uri] = Writes.StringWrites.contramap(_.toString)
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

class CryptApi(conf: Configuration, apiExec: ApiClientExec)
              (implicit exec: ExecutionContext, tracer: ZipkinTraceServiceLike) {
  import play.shaded.ahc.org.asynchttpclient.util.HttpConstants.Methods._

  def baseRequest(path: String)(implicit traceData: TraceData): ApiRequest =
    ApiRequest.traced("crypt", conf.underlying.getString("crypt.uri")  + path)

  val gatewayPort = conf.get[Option[Int]]("crypt.gateway.port").getOrElse(443)

  def registerAccount(accountName: String)(implicit traceData: TraceData): Future[CryptAccountInfo] = {
    baseRequest(s"/accounts/$accountName").transform(_.withMethod(PUT)).execJson[CryptAccountInfo](apiExec)
  }

  def getAccount[T](accountName: String, parseT: JsValue => JsResult[T])
                   (implicit traceData: TraceData): Future[Option[T]] = {
    baseRequest(s"/accounts/$accountName")
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

  def getAccountInfo(accountName: String)(implicit traceData: TraceData): Future[Option[CryptAccountInfo]] = {
    getAccount(accountName, _.validate[CryptAccountInfo])
  }

  def getAccountGatewayUri(accountInfo: CryptAccountInfo) =
    Uri("https", Uri.Authority(accountInfo.hostName, gatewayPort))

  def getCredentials(accountName: String)
                    (implicit traceData: TraceData): Future[Option[Seq[DeviceRegistrationCredentials]]] = {
    getAccount(accountName, x =>
      (x \ "deviceRegistrationCredentials").validate[Map[String, DeviceRegistrationCredentials]])
      .map(_.map(_.values.toSeq))
  }

  def credentialsRegistration(accountName: String,
                              description: String,
                              ttl: Long)(implicit traceData: TraceData): Future[DeviceRegistrationCredentials] = {
    val requestBody = Json.obj("description" -> description, "ttl" -> ttl)
    baseRequest(s"/accounts/$accountName/credentials/registration")
      .transform(_.withMethod(POST))
      .transform(_.withBody(requestBody))
      .execJson[DeviceRegistrationCredentials](apiExec)
  }

  def downloadCredentials(accountName: String, id: UUID)(implicit traceData: TraceData): Future[HttpEntity] = {
    baseRequest(s"/accounts/$accountName/credentials/registration/$id")
      .transform(_.withMethod(GET))
      .execResult(apiExec)
      .transform {
        case Success(res) if Status.isServerError(res.header.status) =>
          Failure(RemoteApiError(res, JsString("vault error status"), "vault error status"))
        case Success(res) if ! Status.isSuccessful(res.header.status) =>
          val e = s"Error status ${res.header.status} downloading credentials"
          Failure(RemoteApiError(res, JsString(e), e))
        case Success(res) => Success(res.body)
        case Failure(exception) => Failure(exception)
      }
  }
}
