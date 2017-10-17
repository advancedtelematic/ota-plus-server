package com.advancedtelematic.controllers

import javax.inject.{Inject, Named, Singleton}

import akka.Done
import akka.actor.ActorSystem
import com.advancedtelematic.api.{ApiClientExec, ApiClientSupport}
import com.advancedtelematic.api.ApiRequest.UserOptions
import com.advancedtelematic.auth.{AccessToken, ApiAuthAction}
import org.genivi.sota.data.{Device, Uuid}
import com.advancedtelematic.persistence.DeviceMetadata
import org.genivi.sota.data.{CredentialsType, Device, Uuid}
import play.api.http.HttpEntity
import play.api.{Configuration, Logger}
import play.api.libs.json.Json
import play.api.libs.ws.WSClient
import play.api.mvc._

import scala.concurrent.Future
import scala.util.control.{NonFatal, NoStackTrace}
import scala.util.{Failure, Try}

@Singleton
class ClientSdkController @Inject() (system: ActorSystem,
                                     val ws: WSClient,
                                     val conf: Configuration,
                                     val authAction: ApiAuthAction,
                                     val clientExec: ApiClientExec,
                                     components: ControllerComponents
                                    )
extends AbstractController(components) with ApiClientSupport {

  implicit val ec = components.executionContext
  import cats.syntax.show._

  val logger = Logger(this.getClass)

  private def getDeviceMetadata(device: Device, token: AccessToken): Future[Option[DeviceMetadata]] = {
    devicesApi.fetchDeviceMetadata(UserOptions(Some(token.value), namespace = Some(device.namespace)), device.uuid)
  }

  private def registerDeviceMetadata(device: Device, token: AccessToken,
                                     devMeta: DeviceMetadata): Future[Done] = {
    val credentials = Some(Json.stringify(Json.toJson(devMeta.credentials)))
    val devT = device.toResponse.copy(credentials = credentials,
      credentialsType = Some(CredentialsType.OAuthClientCredentials))
    devicesApi.setDeviceMetadata(UserOptions(Some(token.value), namespace = Some(device.namespace)), devT)
  }

  /**
    * Contact Auth+ to register for the first time the given [[Uuid]],
    * to later persist (in Device Registry) the resulting [[DeviceMetadata]]
    */
  private def registerAuthPlusDeviceClient(device: Device, token: AccessToken): Future[DeviceMetadata] = {
    for {
      clientInfo <- authPlusApi.createClient(device.uuid, token)
      devMeta = DeviceMetadata(device.uuid, clientInfo)
      _ <- registerDeviceMetadata(device, token, devMeta)
    } yield devMeta
  }

  /**
    * Generate client credentials for a device if it has not been generated before.
    */
  private def getRegisterDevice(device: Device, token: AccessToken) : Future[DeviceMetadata] = {
    for {
      opt <- getDeviceMetadata(device, token)
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
          UserOptions(Some(request.accessToken.value), namespace = Some(request.namespace)), device);
        vMetadata <- getRegisterDevice(dev, request.accessToken) if dev.namespace == request.namespace;
        secret <- authPlusApi.fetchSecret(vMetadata.credentials.clientId, request.accessToken);
        result <- buildSrvApi.download(s"sota_client_${artifact.toString}", Map(
          "device_uuid" -> Seq(device.underlying.value),
          "client_id" -> Seq(vMetadata.credentials.clientId.toString),
          "client_secret" -> Seq(secret),
          "package_manager" -> Seq(pkgMgr.toString),
          "polling_sec" -> Seq(pollingSec.getOrElse(10).toString),
          "filename" -> Seq(s"sota_client_${device.underlying.value}.${artifact.fileExtension}")
        ))
      ) yield result
    }
}
