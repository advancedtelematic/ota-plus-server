package org.genivi.webserver.controllers

import javax.inject.{Inject, Singleton}

import akka.actor.{ActorRef, ActorSystem}
import akka.stream.scaladsl.Source
import com.advancedtelematic.ota.common.VehicleSeenMessage
import org.genivi.sota.data.Vehicle
import org.genivi.webserver.controllers.MessageBrokerActor.Start
import play.api.Logger
import play.api.http.ContentTypes
import play.api.libs.Comet
import play.api.libs.concurrent.Execution
import play.api.libs.json._
import play.api.mvc._

@Singleton
class EventController @Inject() (system: ActorSystem) extends Controller {

  implicit val context = Execution.defaultContext

  val kinesisActor = system.actorOf(MessageBrokerActor.props, "kinesisActor")
  kinesisActor ! Start

  implicit val vinWrites = new Writes[VehicleSeenMessage] {
   def writes(vinMsg: VehicleSeenMessage) = Json.obj(
     "vin" -> vinMsg.vin.get,
     "lastSeen" -> vinMsg.lastSeen.toString
   )
  }

  val logger = Logger(this.getClass)

  def subVehicleSeen(vin: Vehicle.Vin): Action[AnyContent] = Action {
    val vehicleSeenSource: Source[VehicleSeenMessage, ActorRef] =
      Source.actorPublisher(VehicleSeenActor.props(kinesisActor, vin))
    Ok.chunked(vehicleSeenSource
      .map(Json.toJson(_))
          via Comet.json("parent.vehicleSeen")).as(ContentTypes.JSON)
  }

}
