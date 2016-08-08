package org.genivi.webserver.controllers

import com.advancedtelematic.{AuthenticatedApiAction, AuthenticatedRequest}
import com.advancedtelematic.api.ApiRequest.UserOptions
import com.advancedtelematic.api.{ApiClientExec, ApiClientSupport}
import com.advancedtelematic.ota.device.Devices._
import com.advancedtelematic.ota.vehicle.{DeviceMetadata, Vehicles}
import eu.timepit.refined._
import javax.inject.{Inject, Named, Singleton}

import org.genivi.sota.data.{Device, DeviceT, Namespace}
import play.api.libs.json._
import play.api.libs.ws._
import play.api.mvc._
import play.api.{Configuration, Logger}

import scala.concurrent.{ExecutionContext, Future}
import com.advancedtelematic.ota.device.Devices.refinedWriter
import eu.timepit.refined.string.Uri

import scala.util.control.NoStackTrace
import cats.syntax.show.toShowOps

@Singleton
class DeviceController @Inject() (val ws: WSClient,
                                  val conf: Configuration,
                                  val clientExec: ApiClientExec,
                                  @Named("vehicles-store") vehiclesStore: Vehicles)
                                 (implicit ec: ExecutionContext)
extends Controller with ApiClientSupport {

  val logger = Logger(this.getClass)

  private[this] object NoSuchVinRegistered extends Throwable with NoStackTrace

  def create(): Action[DeviceT] = AuthenticatedApiAction.async(parse.json[DeviceT]) { req =>
    requestCreate(req.body, userOptions(req))
  }

  def listDeviceAttributes(): Action[RawBuffer] = AuthenticatedApiAction.async(parse.raw) { req =>
    searchWith(req, coreApi.search)
  }

  def search(): Action[RawBuffer] = AuthenticatedApiAction.async(parse.raw) { req =>
    searchWith(req, devicesApi.search)
  }

  def get(id: Device.Id): Action[RawBuffer] = AuthenticatedApiAction.async(parse.raw) { req =>
    val options = userOptions(req)
    devicesApi.getDevice(options, id)
  }

  private[this] def userOptions(req: AuthenticatedRequest[_]): UserOptions = {
    val traceId = req.headers.get("x-ats-traceid")
    val namespace = req.session.get("username").asInstanceOf[Option[Namespace]]
    // TODO: Switch back to access_token after https://advancedtelematic.atlassian.net/browse/PRO-858
    UserOptions(Some(req.idToken.value), traceId, namespace)
  }

  /**
    * Create a device ( based on the given [[DeviceT]] ) by contacting device-registry, resolver, and Auth+
    *
    * @return a [[Device.Id]] as response body
    */
  private def requestCreate(device: DeviceT, options: UserOptions): Future[Result] = {
    implicit val w = refinedWriter[String, Device.Id]

    for {
      deviceId <- devicesApi.createDevice(options, device)
      vehicleMetadata <- registerAuthPlusVehicle(deviceId)
    } yield Results.Created(Json.toJson(deviceId))
  }

  private def searchWith[R](req: AuthenticatedRequest[_],
                            apiSearch: (UserOptions, Seq[(String, String)]) => Future[R]): Future[R] = {
    val params = req.queryString.mapValues(_.head).toSeq
    apiSearch(userOptions(req), params)
  }

  /**
    * Contact Auth+ to register for the first time the given [[Device.Id]],
    * to later persist (in cassandra-journal) the resulting [[DeviceMetadata]]
    */
  private def registerAuthPlusVehicle(deviceId: Device.Id): Future[DeviceMetadata] = {
    for {
      clientInfo <- authPlusApi.createClient(deviceId)
      vehicleMetadata = DeviceMetadata(deviceId, clientInfo)
      _ <- vehiclesStore.registerVehicle(vehicleMetadata)
    } yield vehicleMetadata
  }

  /**
    * Contact Auth+ to fetch the ClientInfo for the given device.
    */
  def fetchClientInfo(deviceId: Device.Id) : Action[AnyContent] =
    AuthenticatedApiAction.async { implicit request =>
      val fut = for (
        vMetadataOpt <- vehiclesStore.getVehicle(deviceId);
        vMetadata <- vMetadataOpt match {
          case None => Future.failed[DeviceMetadata](NoSuchVinRegistered)
          case Some(vmeta) => Future.successful(vmeta)
        };
        clientInfo <- authPlusApi.fetchClientInfo(vMetadata.clientInfo.clientId)
      ) yield Ok(clientInfo)

      fut.recoverWith { case _ =>
        Future.successful( BadRequest(s"No device has been registered with this app for UUID ${deviceId.show}") )
      }
    }

}
