package org.genivi.webserver.controllers

import javax.inject.{Inject, Named, Singleton}

import akka.actor.{ActorRef, ActorSystem}
import com.advancedtelematic.ota.vehicle.{Vehicles, Vehicle, VehicleMetadata}
import org.asynchttpclient.uri.Uri
import play.api.http.HttpEntity
import play.api.{Configuration, Logger}
import play.api.libs.ws.WSClient
import play.api.mvc._

import scala.concurrent.Future
import scala.util.control.{NoStackTrace, NonFatal}
import scala.util.{Failure, Try}

@Singleton
class ClientSdkController @Inject() (system: ActorSystem,
                                     wsClient: WSClient,
                                     conf: Configuration,
                                     @Named("vehicles-store") vehiclesStore: Vehicles) extends Controller {

  import play.api.libs.concurrent.Execution.Implicits.defaultContext

  val logger = Logger(this.getClass)
  private def logDebug(caller: String, msg: String) {
    // Useful to debug instances running in the cloud.
    logger.debug(s"[ClientSdkController.$caller()] $msg")
  }

  private[this] object ConfigParameterNotFound extends Throwable with NoStackTrace
  private[this] object ConfigAuthPlusHostNotFound extends Throwable with NoStackTrace
  private[this] object NoSuchVinRegistered extends Throwable with NoStackTrace

  /**
    * Send a pre-configured client for the requested package-format (deb or rpm) and architecture (32 or 64 bit).
    *
    * @param vin
    * @param packfmt either "deb" or "rpm"
    * @param arch either "32" or "64"
    */
  def downloadClientSdk(vin: Vehicle.Vin, packfmt: PackageType, arch: Architecture) : Action[AnyContent] =
    Action.async { implicit request =>
      logDebug("downloadClientSdk", s"Params: ${vin.get}-$packfmt-$arch.${packfmt.fileExtension}")
      for (
        vMetadataOpt <- vehiclesStore.getVehicle(vin);
        vMetadata <- vMetadataOpt match {
          case None => Future.failed[VehicleMetadata](NoSuchVinRegistered)
          case Some(vmeta) => Future.successful(vmeta)
        };
        secret <- clientSecret(vMetadata);
        result <- preconfClient(vin, packfmt, arch, vMetadata.clientInfo.clientId, secret)
      ) yield result
    }

  /**
    * The url to use to request a pre-configured client, obtained by filling-in placeholders.
    */
  private def sdkUrl(
                      vin: Vehicle.Vin,
                      packfmt: PackageType, arch: Architecture,
                      clientID: java.util.UUID, secret: String
                    ): Try[Uri] = {

    def placedholderFiller(uri: String): String = {
      val replacements = Seq(
        "[vin]"         -> vin.get,
        "[packagetype]" -> packfmt.toString(),
        "[arch]"        -> arch.toString(),
        "[client_id]"   -> clientID.toString(),
        "[secret]"      -> secret
      )
      replacements.foldLeft(uri) { case (res: String, fromTo: (String, String)) => res.replace(fromTo._1, fromTo._2) }
    }

    val buildserviceEndpoint = for (
      host <- conf.getString("buildservice.api.host");
      query <- conf.getString("buildservice.api.query").map( placedholderFiller )
    ) yield host + query;

    buildserviceEndpoint
      .map( url => Try(Uri.create(url)) )
      .getOrElse( Failure(ConfigParameterNotFound) )
  }

  /**
    * Contact Auth+ to obtain `client_secret` for the given VIN
    */
  private def clientSecret(vMetadata: VehicleMetadata): Future[String] = {
    conf.getString("authplus.host") match {
      case None =>
        Future.failed(ConfigAuthPlusHostNotFound)
      case Some(authplusHost) =>
        val clientUrl = authplusHost + vMetadata.clientInfo.registrationUri
        val w = wsClient.url(clientUrl).withFollowRedirects(false).withMethod("GET")
        w.execute flatMap { wresp =>
          val t2: Try[String] = for (
            parsed <- Try( wresp.json );
            secret <- Try( (parsed \ "client_secret").get )
          ) yield secret.toString()
          Future.fromTry(t2)
        }
    }
  }

  /**
    * Contact Build Service to obtain a pre-configured client
    */
  private def preconfClient(vin: Vehicle.Vin,
                            packfmt: PackageType, arch: Architecture,
                            clientID: java.util.UUID, secret: String): Future[Result] = {
    Future.fromTry( sdkUrl(vin, packfmt, arch, clientID, secret) )
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
    val futureResponse = wsClient.url(url.toUrl).withMethod("POST").stream
    futureResponse.map { streamedResp =>
      val statusResp = streamedResp.headers.status
      if (statusResp == 200) {
        val body = streamedResp.body
        // If there's a content length, send that, otherwise return the body chunked
        val ourResponse = streamedResp.headers.headers.get("Content-Length") match {
          case Some(Seq(length)) if Try ( Integer.parseInt(length) ).isSuccess =>
            val entity = HttpEntity.Streamed(
              body,
              Some(Integer.parseInt(length)),
              Some(packfmt.contentType)
            )
            Ok.sendEntity(entity)
          case _ =>
            Ok.chunked(body).as(packfmt.contentType)
        }
        val suggestedFilename = s"ota-plus-sdk-${vin.get}-$packfmt-$arch.${packfmt.fileExtension}"
        ourResponse.withHeaders(CONTENT_DISPOSITION -> s"attachment; filename=$suggestedFilename")
      } else {
        logger.error(s"Unexpected response status from build service: $statusResp")
        BadGateway
      }
    }
  }

}
