package org.genivi.webserver.controllers

import javax.inject.Inject

import com.ning.http.client.uri.Uri
import org.genivi.sota.core.data.Vehicle
import play.api.{Logger, Play}
import play.api.libs.iteratee.Enumerator
import play.api.libs.ws.{WSClient, WSResponseHeaders}
import play.api.mvc.{Result, AnyContent, Action, Controller}
import play.api.libs.json.{JsValue, Json}

import scala.concurrent.Future
import scala.util.control.{NonFatal, NoStackTrace}
import scala.util.{Failure, Try}

case class SdkRequestParams(vin: Vehicle.Vin, packfmt: PackageType, arch: Architecture)
case class ClientCredentials(clientID: String, secret: String)

class ClientSdkController @Inject() (wsClient: WSClient) extends Controller {

  import play.api.libs.concurrent.Execution.Implicits.defaultContext

  val logger = Logger(this.getClass)

  private[this] object ConfigParameterNotFound extends Throwable with NoStackTrace
  private[this] object AuthPlusClientNotFound extends Throwable with NoStackTrace

  private def sdkUrl(sdkReq: SdkRequestParams, credentials: ClientCredentials): Try[Uri] = {

    def placedholderFiller(uri: String): String = {
      val SdkRequestParams(vin, packfmt, arch) = sdkReq
      val replacements = Seq(
        "[vin]"         -> vin.get,
        "[packagetype]" -> packfmt.toString(),
        "[arch]"        -> arch.toString(),
        "[client_id]"   -> credentials.clientID,
        "[secret]"      -> credentials.secret
      )
      replacements.foldLeft(uri) { case (res: String, fromTo: (String, String)) => res.replace(fromTo._1, fromTo._2) }
    }

    Play.current.configuration.getString("buildservice.api.uri")
      .map( placedholderFiller )
      .map( url => Try(Uri.create(url)) )
      .getOrElse( Failure(ConfigParameterNotFound) )
  }

  /**
    * Contact Auth+ to obtain (client_id, client_secret) TODO for the given vin
    *
    * @param vin
    */
  private def clientInfoForNewClient(vin: Vehicle.Vin): Future[JsValue] = {
    val body: JsValue = Json.parse(s""" { "client_name": "${vin.get}" } """)
    import play.api.libs.ws.WS
    import play.api.Play.current

    Play.current.configuration.getString("authplus.client.uri") match {
      case None =>
        Future.failed(AuthPlusClientNotFound)
      case Some(clientUrl) =>
        val w = WS.url(clientUrl)
          .withFollowRedirects(false)
          .withMethod("POST")
          .withHeaders(CONTENT_TYPE -> JSON)
          .withBody(body)

        w.execute.map(_.json)
    }
  }

  /**
    * Contact Build Service to obtain a pre-configured client
    *
    * @param sdkReq what's needed to request a Client SDK
    * @param clientInfo the reply by Auth+
    */
  private def preconfClient(sdkReq: SdkRequestParams,
                            clientInfo: JsValue): Future[Result] = {
    val fut = for (
      clientID <- (clientInfo \ "client_id").toOption;
      secret <- (clientInfo \ "client_secret").toOption
    ) yield {
      val credentials = ClientCredentials(clientID.toString(), secret.toString())
      Future.fromTry( sdkUrl(sdkReq, credentials) )
        .flatMap(streamPackageFromBuildService(sdkReq))
        .recover {
          case NonFatal(t) =>
            logger.error( "Failed to stream sdk from build service", t )
            InternalServerError
        }
    }

    fut.getOrElse({
      logger.error( "Failed to parse credentials from the JSON payload obtained from Auth+");
      Future.successful(InternalServerError)
    })
  }

  /**
    * Send a pre-configured client for the requested package-format (deb or rpm) and architecture (32 or 64 bit).
    *
    * @param vin
    * @param packfmt either "deb" or "rpm"
    * @param arch either "32" or "64"
    */
  def downloadClientSdk(vin: Vehicle.Vin, packfmt: PackageType, arch: Architecture) : Action[AnyContent] =
    Action.async { implicit request =>
      for (
        clientInfo <- clientInfoForNewClient(vin);
        result <- preconfClient(SdkRequestParams(vin, packfmt, arch), clientInfo)
      ) yield result;
    }


  /**
    * Requests client sdk package from the build service and streams response to the requester.
    */
  private def streamPackageFromBuildService(sdkReq: SdkRequestParams)
                                           (url: Uri): Future[Result] = {
    val futureResponse: Future[(WSResponseHeaders, Enumerator[Array[Byte]])] =
      wsClient.url(url.toUrl).withMethod("POST").stream()
    futureResponse.map {
      case (response, body) if response.status == 200 =>
        // If there's a content length, send that, otherwise return the body chunked
        val ourResponse = response.headers.get("Content-Length") match {
          case Some(Seq(length)) =>
            Ok.feed(body).as(sdkReq.packfmt.contentType).withHeaders("Content-Length" -> length)
          case _ =>
            Ok.chunked(body).as(sdkReq.packfmt.contentType)
        }
        val suggestedFilename =
          s"ota-plus-sdk-${sdkReq.vin.get}-${sdkReq.packfmt}-${sdkReq.arch}.${sdkReq.packfmt.fileExtension}"
        ourResponse.withHeaders(CONTENT_DISPOSITION -> s"attachment; filename=$suggestedFilename")
      case (responseHeaders, body) =>
        logger.error(s"Unexpected response status from build service: ${responseHeaders.status}")
        BadGateway
    }
  }

}
