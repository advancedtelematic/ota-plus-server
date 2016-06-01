package org.genivi.webserver.controllers

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
import scala.concurrent.Future
import scala.util.Try


@Singleton
class DeviceController @Inject() (val ws: WSClient,
                                  val conf: Configuration,
                                  val clientExec: ApiClientExec,
                                  @Named("vehicles-store") vehiclesStore: Vehicles)
extends Controller with ApiClientSupport
  with OtaPlusConfig {

  implicit val context = Execution.defaultContext

  val logger = Logger(this.getClass)

  def create() = Action.async(parse.json) { req =>
    val device = req.body.as[DeviceT]
    requestCreate(device, req)
  }

  def listDeviceAttributes() = Action.async(parse.raw) { req =>
    searchWith(req, coreApi.search)
  }

  private[this] def userOptions(req: Request[_]): UserOptions = {
    val traceId = req.headers.get("x-ats-traceid")
    val token = req.session.get("access_token").orElse(bearerToken(req))
    UserOptions(token, traceId)
  }

  private[this] def bearerToken(req: Request[_]): Option[String] = {
    for {
      authHeader <- req.headers.get("Authorization")
      bearer <- Try(authHeader.split("Bearer ").last).toOption
    } yield bearer
  }

  private def requestCreate(device: DeviceT, req: Request[JsValue]): Future[Result] = {
    val options = userOptions(req)

    // Must POST "devices" on device registry and
    // PUT "vehicles" on resolver, if VIN is known already
    // TODO: Retry until both responses are success
    for {
      result <- devicesApi.createDevice(options, device)
      _ <- resolverApi.createDevice(options, device)
      // TODO VIN validation
      vin = refineV[Vehicle.ValidVin](device.deviceId.get.underlying).right.get
      vehicleMetadata <- registerAuthPlusVehicle(vin)
      _ <- vehiclesStore.registerVehicle(vehicleMetadata)
    } yield result
  }

  private def searchWith
  (req: Request[_], apiSearch: (UserOptions, Seq[(String, String)]) => Future[Result]): Future[Result] = {
    val params = req.queryString.mapValues(_.head).toSeq
    apiSearch(userOptions(req), params)
  }

  /**
  * Contact Auth+ to register for the first time the given VIN,
  * obtaining [[VehicleMetadata]]
  */
  private def registerAuthPlusVehicle(name: Vehicle.Vin): Future[VehicleMetadata] = {
    authPlusApi.createClient(name).map(i => VehicleMetadata(name, i))
  }
}
