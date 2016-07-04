package org.genivi.webserver.controllers

import java.net.URI

import com.advancedtelematic.api.ApiRequest.UserOptions
import com.advancedtelematic.api.{ApiClientExec, ApiClientSupport}
import com.advancedtelematic.ota.device.Devices._
import com.advancedtelematic.ota.vehicle.{VehicleMetadata, Vehicles}
import eu.timepit.refined._
import javax.inject.{Inject, Named, Singleton}

import org.genivi.sota.data.{Device, DeviceT, Vehicle}
import play.api.libs.concurrent.Execution
import play.api.libs.json._
import play.api.libs.ws._
import play.api.mvc._
import play.api.{Configuration, Logger}

import scala.concurrent.{ExecutionContext, Future}
import scala.util.Try
import com.advancedtelematic.ota.device.Devices.refinedWriter
import eu.timepit.refined.string.Uri

import scala.util.control.NoStackTrace

@Singleton
class DeviceController @Inject() (val ws: WSClient,
                                  val conf: Configuration,
                                  val clientExec: ApiClientExec,
                                  @Named("vehicles-store") vehiclesStore: Vehicles)
                                 (implicit ec: ExecutionContext)
extends Controller with ApiClientSupport
  with OtaPlusConfig {

  val logger = Logger(this.getClass)

  private[this] object NoSuchVinRegistered extends Throwable with NoStackTrace

  def create() = Action.async(parse.json[DeviceT]) { req =>
    requestCreate(req.body, req)
  }

  def listDeviceAttributes() = Action.async(parse.raw) { req =>
    searchWith(req, coreApi.search)
  }

  def search() = Action.async(parse.raw) { req =>
    searchWith(req, devicesApi.search)
  }

  def get(id: Device.Id) = Action.async(parse.raw) { req =>
    val options = userOptions(req)
    devicesApi.getDevice(options, id)
  }

  private[this] def userOptions(req: Request[_]): UserOptions = {
    val traceId = req.headers.get("x-ats-traceid")
    val token = req.session.get("access_token").orElse(bearerToken(req))
    val namespace = req.session.get("username").flatMap(u => refineV[Uri](u).right.toOption)
    UserOptions(token, traceId, namespace)
  }

  private[this] def bearerToken(req: Request[_]): Option[String] = {
    for {
      authHeader <- req.headers.get("Authorization")
      bearer <- Try(authHeader.split("Bearer ").last).toOption
    } yield bearer
  }

  private def requestCreate(device: DeviceT, req: Request[_]): Future[Result] = {
    val options = userOptions(req)

    implicit val w = refinedWriter[String, Device.Id]

    // Must POST "devices" on device registry and
    // PUT "vehicles" on resolver, if VIN is known already
    // TODO: Retry until both responses are success
    for {
      deviceId <- devicesApi.createDevice(options, device)
      _ <- resolverApi.createDevice(options, device)
      vehicleMetadata <- registerAuthPlusVehicle(deviceId)
      _ <- vehiclesStore.registerVehicle(vehicleMetadata)
    } yield Results.Created(Json.toJson(deviceId))
  }

  private def searchWith[R]
  (req: Request[_], apiSearch: (UserOptions, Seq[(String, String)]) => Future[R]): Future[R] = {
    val params = req.queryString.mapValues(_.head).toSeq
    apiSearch(userOptions(req), params)
  }

  /**
  * Contact Auth+ to register for the first time the given VIN,
  * obtaining [[VehicleMetadata]]
  */
  private def registerAuthPlusVehicle(deviceId: Device.Id): Future[VehicleMetadata] = {
    authPlusApi.createClient(deviceId).map(i => VehicleMetadata(deviceId, i))
  }

  /**
    * Contact Auth+ to fetch the ClientInfo for the given device.
    */
  def fetchClientInfo(deviceId: Device.Id) : Action[AnyContent] =
    Action.async { implicit request =>
      for (
        vMetadataOpt <- vehiclesStore.getVehicle(deviceId);
        vMetadata <- vMetadataOpt match {
          case None => Future.failed[VehicleMetadata](NoSuchVinRegistered)
          case Some(vmeta) => Future.successful(vmeta)
        };
        clientInfo <- authPlusApi.fetchClientInfo(vMetadata.clientInfo.clientId)
      ) yield Ok(clientInfo)
    }

}
