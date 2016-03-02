package org.genivi.webserver.controllers

import javax.inject.Inject

import com.ning.http.client.uri.Uri
import org.genivi.sota.core.data.Vehicle
import play.api.{Logger, Play}
import play.api.libs.iteratee.Enumerator
import play.api.libs.ws.{WSClient, WSResponseHeaders}
import play.api.mvc.{Result, AnyContent, Action, Controller}

import scala.concurrent.Future
import scala.util.control.{NonFatal, NoStackTrace}
import scala.util.{Failure, Try}

class ClientSdkController @Inject() (wsClient: WSClient) extends Controller {

  import play.api.libs.concurrent.Execution.Implicits.defaultContext

  val logger = Logger(this.getClass)

  private[this] object ConfigParameterNotFound extends Throwable with NoStackTrace

  private def sdkUrl(vin: Vehicle.Vin, packfmt: PackageType, arch: Architecture): Try[Uri] =
    Play.current.configuration.getString("buildservice.api.uri")
        .map(
          _.replace("[vin]", vin.get).replace("[packagetype]", packfmt.toString()).replace("[arch]", arch.toString())
        )
        .map( url => Try(Uri.create(url)) )
        .getOrElse( Failure(ConfigParameterNotFound) )

  /**
    * Send a pre-configured client for the requested package-format (deb or rpm) and architecture (32 or 64 bit).
    *
    * @param vin
    * @param packfmt either "deb" or "rpm"
    * @param arch either "32" or "64"
    */
  def downloadClientSdk(vin: Vehicle.Vin, packfmt: PackageType, arch: Architecture) : Action[AnyContent] =
    Action.async { implicit request =>
        Future.fromTry( sdkUrl(vin, packfmt, arch) )
            .flatMap(streamPackageFromBuildService(vin, packfmt, arch))
            .recover {
              case NonFatal(t) =>
                logger.error( "Failed to stream sdk from build service", t )
                InternalServerError
            }

    }


  /**
    * Requests client sdk package from the build service and streams response to the requester.
    */
  private def streamPackageFromBuildService(vin: Vehicle.Vin, packfmt: PackageType, arch: Architecture)
                                           (url: Uri): Future[Result] = {
    val futureResponse: Future[(WSResponseHeaders, Enumerator[Array[Byte]])] = wsClient.url(url.toUrl).getStream()
    futureResponse.map {
      case (response, body) if response.status == 200 =>
        // If there's a content length, send that, otherwise return the body chunked
        val ourResponse = response.headers.get("Content-Length") match {
          case Some(Seq(length)) =>
            Ok.feed(body).as(packfmt.contentType).withHeaders("Content-Length" -> length)
          case _ =>
            Ok.chunked(body).as(packfmt.contentType)
        }
        val suggestedFilename = s"ota-plus-sdk-${vin.get}-$packfmt-$arch.${packfmt.fileExtension}"
        ourResponse.withHeaders(CONTENT_DISPOSITION -> s"attachment; filename=$suggestedFilename")
      case (responseHeaders, body) =>
        logger.error(s"Unexpected response status from build service: ${responseHeaders.status}")
        BadGateway
    }
  }

}
