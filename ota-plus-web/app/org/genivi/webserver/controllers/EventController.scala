package org.genivi.webserver.controllers

import javax.inject.{Inject, Named, Singleton}

import akka.actor.ActorRef
import akka.stream.Materializer
import akka.stream.scaladsl.Source
import com.advancedtelematic.api.{ApiClientExec, ApiClientSupport}
import com.advancedtelematic.ota.common.VehicleSeenMessage
import com.advancedtelematic.ota.vehicle.Vehicles
import org.genivi.sota.data.Vehicle
import play.api.http.ContentTypes
import play.api.libs.Comet
import play.api.libs.concurrent.Execution
import play.api.libs.json._
import play.api.libs.ws._
import play.api.mvc._
import play.api.{Configuration, Logger}

@Singleton
class EventController @Inject()(val ws: WSClient,
                                val conf: Configuration,
                                materializer: Materializer,
                                val clientExec: ApiClientExec,
                                @Named("vehicles-store") vehiclesStore: Vehicles)
extends Controller with ApiClientSupport
  with OtaPlusConfig {

  implicit val context = Execution.defaultContext

  implicit val vinWrites = new Writes[VehicleSeenMessage] {
   def writes(vinMsg: VehicleSeenMessage) = Json.obj(
     "vin" -> vinMsg.vin.get,
     "lastSeen" -> vinMsg.lastSeen.toString
   )
  }

  val logger = Logger(this.getClass)

  def subVehicleSeen(vin: Vehicle.Vin): Action[AnyContent] = Action {
    //TODO: is making a new actor here everytime best? Could we just have one declared in this controller?
    val vehicleSeenSource: Source[VehicleSeenMessage, ActorRef] = Source.actorPublisher(VehicleSeenEventActor.props)
    Ok.chunked(vehicleSeenSource
      .filter(m => m.vin == vin)
        .map(Json.toJson(_))
          via Comet.json("parent.vehicleSeen")).as(ContentTypes.JSON)
  }

}
