package org.genivi.webserver.controllers

import com.advancedtelematic.{AuthPlusAuthentication, AuthenticatedRequest}
import com.advancedtelematic.api.ApiRequest.UserOptions
import com.advancedtelematic.api.{ApiClientExec, ApiClientSupport}
import com.advancedtelematic.ota.device.Devices._
import com.advancedtelematic.ota.vehicle.{DeviceMetadata, Vehicles}
import eu.timepit.refined._
import javax.inject.{Inject, Named, Singleton}

import org.genivi.sota.data.{Device, DeviceT, Namespace, Uuid}
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
                                  val authAction: AuthPlusAuthentication,
                                  val clientExec: ApiClientExec,
                                  @Named("vehicles-store") vehiclesStore: Vehicles)
                                 (implicit ec: ExecutionContext)
extends Controller with ApiClientSupport {

  val logger = Logger(this.getClass)

  private[this] object NoSuchVinRegistered extends Throwable with NoStackTrace

  def create(): Action[DeviceT] = authAction.AuthenticatedApiAction.async(parse.json[DeviceT]) { req =>
    requestCreate(req.body, userOptions(req))
  }

  private[this] def userOptions(req: AuthenticatedRequest[_]): UserOptions = {
    val traceId = req.headers.get("x-ats-traceid")
    UserOptions(Some(req.authPlusAccessToken.value), traceId, Some(req.namespace))
  }

  /**
    * Create a device ( based on the given [[DeviceT]] ) by contacting device-registry, resolver, and Auth+
    *
    * @return a [[Uuid]] as response body
    */
  private def requestCreate(device: DeviceT, options: UserOptions): Future[Result] = {
    implicit val w = refinedWriter[String, Uuid]

    for {
      device <- devicesApi.createDevice(options, device)
      vehicleMetadata <- registerAuthPlusVehicle(device)
    } yield Results.Created(Json.toJson(device))
  }

  private def searchWith[R](req: AuthenticatedRequest[_],
                            apiSearch: (UserOptions, Seq[(String, String)]) => Future[R]): Future[R] = {
    val params = req.queryString.mapValues(_.head).toSeq
    apiSearch(userOptions(req), params)
  }

  /**
    * Contact Auth+ to register for the first time the given [[Uuid]],
    * to later persist (in cassandra-journal) the resulting [[DeviceMetadata]]
    */
  private def registerAuthPlusVehicle(device: Uuid): Future[DeviceMetadata] = {
    for {
      clientInfo <- authPlusApi.createClient(device)
      vehicleMetadata = DeviceMetadata(device, clientInfo)
      _ <- vehiclesStore.registerVehicle(vehicleMetadata)
    } yield vehicleMetadata
  }
}
