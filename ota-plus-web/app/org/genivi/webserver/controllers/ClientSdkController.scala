package org.genivi.webserver.controllers

import javax.inject.{Inject, Named, Singleton}

import akka.actor.ActorSystem
import com.advancedtelematic.AuthenticatedApiAction
import com.advancedtelematic.api.{ApiClientExec, ApiClientSupport}
import com.advancedtelematic.ota.vehicle.{DeviceMetadata, Vehicles}
import org.asynchttpclient.uri.Uri
import org.genivi.sota.data.Device
import play.api.http.HttpEntity
import play.api.{Configuration, Logger}
import play.api.libs.ws.WSClient
import play.api.mvc._

import scala.concurrent.Future
import scala.util.control.{NoStackTrace, NonFatal}
import scala.util.{Failure, Try}

@Singleton
class ClientSdkController @Inject() (system: ActorSystem,
                                     val ws: WSClient,
                                     val conf: Configuration,
                                     val clientExec: ApiClientExec,
                                     @Named("vehicles-store") vehiclesStore: Vehicles)
extends Controller with ApiClientSupport {

  import play.api.libs.concurrent.Execution.Implicits.defaultContext
  import Device._
  import cats.syntax.show._

  val logger = Logger(this.getClass)

  private[this] object ConfigParameterNotFound extends Throwable with NoStackTrace
  private[this] object NoSuchVinRegistered extends Throwable with NoStackTrace

  /**
    * Send a pre-configured client configuration for the requested artifact (deb, rpm, toml).
    *
    * @param deviceId
    * @param artifact one of "deb", "rpm", "toml"
    * @param arch either "32" or "64"
    */
  def downloadClientSdk(deviceId: Device.Id, artifact: ArtifactType, arch: Architecture) : Action[AnyContent] =
    AuthenticatedApiAction.async { implicit request =>
      for (
        vMetadataOpt <- vehiclesStore.getVehicle(deviceId);
        vMetadata <- vMetadataOpt match {
          case None => Future.failed[DeviceMetadata](NoSuchVinRegistered)
          case Some(vmeta) => Future.successful(vmeta)
        };
        secret <- authPlusApi.fetchSecret(vMetadata.clientInfo.clientId);
        result <- preconfClient(vMetadata.deviceId, artifact, arch, vMetadata.clientInfo.clientId, secret)
      ) yield result
    }

  /**
    * The url to use to request a pre-configured client, obtained by filling-in placeholders.
    */
  private def sdkUrl(
                      device: Device.Id,
                      artifact: ArtifactType, arch: Architecture,
                      clientID: java.util.UUID, secret: String
                    ): Try[Uri] = {

    def placedholderFiller(uri: String): String = {
      val replacements = Seq(
        "[vin]"         -> device.show,
        "[packagetype]" -> artifact.toString(),
        "[arch]"        -> arch.toString(),
        "[client_id]"   -> clientID.toString(),
        "[secret]"      -> secret
      )
      replacements.foldLeft(uri) { case (res: String, fromTo: (String, String)) => res.replace(fromTo._1, fromTo._2) }
    }

    val buildserviceEndpoint = for (
      host <- conf.getString("buildservice.api.host");
      query <- conf.getString("buildservice.api.query").map( placedholderFiller )
    ) yield host + query

    buildserviceEndpoint
      .map( url => Try(Uri.create(url)) )
      .getOrElse( Failure(ConfigParameterNotFound) )
  }

  /**
    * Contact Build Service to obtain a pre-configured client
    */
  private def preconfClient(device: Device.Id,
                            artifact: ArtifactType, arch: Architecture,
                            clientID: java.util.UUID, secret: String): Future[Result] = {
    Future.fromTry(sdkUrl(device, artifact, arch, clientID, secret))
      .flatMap(streamPackageFromBuildService(device, artifact, arch))
      .recover {
        case NonFatal(t) =>
          logger.error("Failed to stream sdk from build service", t)
          InternalServerError
      }
  }

  /**
    * Requests client sdk package from the build service and streams response to the requester.
    */
  private def streamPackageFromBuildService(device: Device.Id, artifact: ArtifactType, arch: Architecture)
                                           (url: Uri): Future[Result] = {
    val futureResponse = ws.url(url.toUrl).withMethod("POST").stream
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
              Some(artifact.contentType)
            )
            Ok.sendEntity(entity)
          case _ =>
            Ok.chunked(body).as(artifact.contentType)
        }
        val suggestedFilename = s"ota-plus-sdk-${device.show}-$artifact-$arch.${artifact.fileExtension}"
        ourResponse.withHeaders(CONTENT_DISPOSITION -> s"attachment; filename=$suggestedFilename")
      } else {
        logger.error(s"Unexpected response status from build service: $statusResp")
        BadGateway
      }
    }
  }

}
