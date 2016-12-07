package com.advancedtelematic.api

import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.model.Uri.NamedHost
import org.asynchttpclient.util.HttpConstants.ResponseStatusCodes
import play.api.Configuration
import play.api.libs.json._

import scala.concurrent.{ ExecutionContext, Future }

final case class CryptAccountInfo(name: String, hostName: NamedHost)

object CryptAccountInfo {
  import play.api.libs.functional.syntax._

  implicit val NamedHostReads: Reads[NamedHost] = Reads.StringReads.map(NamedHost.apply)
  implicit val NamedHostWrites: Writes[NamedHost] = Writes.StringWrites.contramap(_.address)
  implicit val ReadsInstance: Format[CryptAccountInfo] =
    ((__ \ "subject").format[String] and (__ \ "hostName")
      .format[NamedHost])(CryptAccountInfo.apply, unlift(CryptAccountInfo.unapply))

}

class CryptApi(conf: Configuration, val apiExec: ApiClientExec)(implicit exec: ExecutionContext) {
  import org.asynchttpclient.util.HttpConstants.Methods._

  val baseUri = ApiRequest.base(conf.underlying.getString("crypt.host"))

  def registerAccount(accountName: String): Future[CryptAccountInfo] = {
    baseUri(s"/accounts/$accountName").transform(_.withMethod(PUT)).execJson[CryptAccountInfo](apiExec)
  }

  def getAccountInfo(accountName: String): Future[Option[CryptAccountInfo]] = {
    baseUri(s"/accounts/$accountName")
      .transform(_.withMethod(GET))
      .execResponse(apiExec)
      .flatMap[Option[CryptAccountInfo]] { response =>
        response.status match {
          case ResponseStatusCodes.OK_200 =>
            response.json.validate[CryptAccountInfo] match {
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
}
