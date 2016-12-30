package org.genivi.webserver.controllers

import javax.inject.{Inject, Named, Singleton}

import akka.actor.ActorSystem
import com.advancedtelematic.{AuthPlusAuthentication, AuthPlusAccessToken, AuthenticatedRequest}
import com.advancedtelematic.api.{ApiClientExec, ApiClientSupport}
import com.advancedtelematic.api.ApiRequest.UserOptions
import com.advancedtelematic.ota.vehicle.{DeviceMetadata, Vehicles}
import org.asynchttpclient.uri.Uri
import org.genivi.sota.data.{Device, Uuid}
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
                                     val authAction: AuthPlusAuthentication,
                                     val clientExec: ApiClientExec,
                                     @Named("vehicles-store") vehiclesStore: Vehicles)
extends Controller with ApiClientSupport {

  import play.api.libs.concurrent.Execution.Implicits.defaultContext
  import Device._
  import cats.syntax.show._

  val logger = Logger(this.getClass)

  /**
    * Contact Auth+ to register for the first time the given [[Uuid]],
    * to later persist (in cassandra-journal) the resulting [[DeviceMetadata]]
    */
  private def registerAuthPlusVehicle(device: Uuid, token: AuthPlusAccessToken): Future[DeviceMetadata] = {
    for {
      clientInfo <- authPlusApi.createClient(device, token)
      vehicleMetadata = DeviceMetadata(device, clientInfo)
      _ <- vehiclesStore.registerVehicle(vehicleMetadata)
    } yield vehicleMetadata
  }

  /**
    * Generate client credentials for a device if it has not been generated before.
    */
  def getRegisterDevice(device: Uuid, token: AuthPlusAccessToken) : Future[DeviceMetadata] = {
    for {
        opt <- vehiclesStore.getVehicle(device)
        devMeta <- opt match {
          case Some(vmeta) => Future.successful(vmeta)
          case None => registerAuthPlusVehicle(device, token)
        }
    } yield devMeta
  }

  /**
    * Send a pre-configured client configuration for the requested artifact (deb, rpm, toml).
    *
    * @param device UUID of device
    * @param artifact one of "deb", "rpm", "toml"
    */
  def deviceClientDownload(device: Uuid, artifact: ArtifactType) : Action[AnyContent] =
    authAction.AuthenticatedApiAction.async { implicit request =>
      for (
        dev <- devicesApi.getDevice(
          UserOptions(Some(request.authPlusAccessToken.value), namespace = Some(request.namespace)), device);
        vMetadata <- getRegisterDevice(device, request.authPlusAccessToken) if dev.namespace == request.namespace;
        secret <- authPlusApi.fetchSecret(vMetadata.clientInfo.clientId, request.authPlusAccessToken);
        result <- buildSrvApi.download(s"sota_client_${artifact.toString}", Map(
          "device_uuid" -> Seq(device.underlying.get),
          "client_id" -> Seq(vMetadata.clientInfo.clientId.toString),
          "client_secret" -> Seq(secret),
          "package_manager" -> request.queryString.get("package_manager").getOrElse(Seq("off")),
          "polling_sec" -> request.queryString.get("polling_sec").getOrElse(Seq("10")),
          "filename" -> Seq(s"sota_client_${device.underlying.get}.${artifact.fileExtension}")
        ))
      ) yield result
    }
}
