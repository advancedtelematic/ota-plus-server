package com.advancedtelematic.controllers

import javax.inject.{Inject, Named, Singleton}

import akka.actor.ActorSystem
import com.advancedtelematic.{AuthenticatedRequest, AuthPlusAccessToken, AuthPlusAuthentication}
import com.advancedtelematic.api.{ApiClientExec, ApiClientSupport}
import com.advancedtelematic.api.ApiRequest.UserOptions
import com.advancedtelematic.persistence.{DeviceMetadata, DeviceMetadataJournal}
import com.advancedtelematic.AuthPlusAuthentication.AuthenticatedApiAction
import org.genivi.sota.data.{Device, Uuid}
import play.api.http.HttpEntity
import play.api.{Configuration, Logger}
import play.api.libs.ws.WSClient
import play.api.mvc._

import scala.concurrent.Future
import scala.util.control.{NonFatal, NoStackTrace}
import scala.util.{Failure, Try}

@Singleton
class ClientSdkController @Inject() (system: ActorSystem,
                                     val ws: WSClient,
                                     val conf: Configuration,
                                     val authAction: AuthenticatedApiAction,
                                     val clientExec: ApiClientExec,
                                     @Named("device-metadata-journal") deviceMetadataJournal: DeviceMetadataJournal,
                                     components: ControllerComponents
                                    )
extends AbstractController(components) with ApiClientSupport {

  implicit val ec = components.executionContext
  import cats.syntax.show._

  val logger = Logger(this.getClass)

  /**
    * Contact Auth+ to register for the first time the given [[Uuid]],
    * to later persist (in cassandra-journal) the resulting [[DeviceMetadata]]
    */
  private def registerAuthPlusDeviceClient(device: Uuid, token: AuthPlusAccessToken): Future[DeviceMetadata] = {
    for {
      clientInfo <- authPlusApi.createClient(device, token)
      devMeta = DeviceMetadata(device, clientInfo)
      _ <- deviceMetadataJournal.registerDeviceMetadata(devMeta)
    } yield devMeta
  }

  /**
    * Generate client credentials for a device if it has not been generated before.
    */
  def getRegisterDevice(device: Uuid, token: AuthPlusAccessToken) : Future[DeviceMetadata] = {
    for {
        opt <- deviceMetadataJournal.getDeviceMetadata(device)
        devMeta <- opt match {
          case Some(vmeta) => Future.successful(vmeta)
          case None => registerAuthPlusDeviceClient(device, token)
        }
    } yield devMeta
  }

  /**
    * Send a pre-configured client configuration for the requested artifact (deb, rpm, toml).
    *
    * @param device UUID of device
    * @param artifact one of "deb", "rpm", "toml"
    */
  def deviceClientDownload(
      device: Uuid,
      artifact: ArtifactType,
      pkgMgr: PackageManager.Value,
      pollingSec: Option[Integer]) : Action[AnyContent] =
    authAction.async { implicit request =>
      for (
        dev <- devicesApi.getDevice(
          UserOptions(Some(request.authPlusAccessToken.value), namespace = Some(request.namespace)), device);
        vMetadata <- getRegisterDevice(device, request.authPlusAccessToken) if dev.namespace == request.namespace;
        secret <- authPlusApi.fetchSecret(vMetadata.clientInfo.clientId, request.authPlusAccessToken);
        result <- buildSrvApi.download(s"sota_client_${artifact.toString}", Map(
          "device_uuid" -> Seq(device.underlying.value),
          "client_id" -> Seq(vMetadata.clientInfo.clientId.toString),
          "client_secret" -> Seq(secret),
          "package_manager" -> Seq(pkgMgr.toString),
          "polling_sec" -> Seq(pollingSec.getOrElse(10).toString),
          "filename" -> Seq(s"sota_client_${device.underlying.value}.${artifact.fileExtension}")
        ))
      ) yield result
    }
}
