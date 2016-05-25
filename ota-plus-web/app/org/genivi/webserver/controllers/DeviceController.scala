package org.genivi.webserver.controllers

import javax.inject.{Inject, Named, Singleton}

import com.advancedtelematic.api.{ApiClientExec, ApiClientSupport}
import com.advancedtelematic.ota.vehicle.{VehicleMetadata, Vehicles}
import org.genivi.sota.data.Vehicle
import play.api.{Configuration, Logger}
import play.api.libs.ws._
import play.api.mvc._
import org.genivi.sota.data.Vehicle.Vin
import play.api.libs.concurrent.Execution

import scala.concurrent.Future

@Singleton
class DeviceController @Inject() (val ws: WSClient,
                                  val conf: Configuration,
                                  val clientExec: ApiClientExec,
                                  @Named("vehicles-store") vehiclesStore: Vehicles)
extends Controller with ApiClientSupport
  with OtaPlusConfig {

  implicit val context = Execution.defaultContext

  val logger = Logger(this.getClass)

  def create(vin: Vehicle.Vin) = Action.async(parse.raw) { req =>
    requestCreate(vin, req)
  }

  def listDeviceAttributes() = Action.async(parse.raw) { req =>
    searchWith(req, coreApi.search)
  }

  def search() = Action.async(parse.raw) { req =>
    searchWith(req, resolverApi.search)
  }

  private[this] def accessToken(req: Request[_]): Option[String] = req.session.get("access_token")

  private def requestCreate(vin: Vin, req: Request[RawBuffer]): Future[Result] = {
    val token = accessToken(req)

    // TODO: Retry until both responses are success
    for {
      respDeviceRegistry <-  deviceApi.createDevice(token, vin)
      respResult <- resolverApi.createVehicle(token, vin)
      vehicleMetadata <- registerAuthPlusVehicle(vin)
      _ <- vehiclesStore.registerVehicle(vehicleMetadata)
    } yield respDeviceRegistry
  }

  private def searchWith(req: Request[_], apiOp: (Option[String], Seq[(String, String)]) => Future[Result]):
  Future[Result] = {
    val params = req.queryString.mapValues(_.head).toSeq

    apiOp(accessToken(req), params)
  }

  /**
  * Contact Auth+ to register for the first time the given VIN,
  * obtaining [[VehicleMetadata]]
  */
  private def registerAuthPlusVehicle(vin: Vehicle.Vin): Future[VehicleMetadata] = {
    authPlusApi.createClient(vin).map(i => VehicleMetadata(vin, i))
  }
}
