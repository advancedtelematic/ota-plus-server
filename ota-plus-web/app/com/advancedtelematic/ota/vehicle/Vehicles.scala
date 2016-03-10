package com.advancedtelematic.ota.vehicle

import java.util.concurrent.TimeUnit

import akka.actor.{Actor, ActorRef, Props}
import akka.persistence.PersistentActor
import akka.util.Timeout

import scala.concurrent.{ExecutionContext, Future}

object Commands {

  final case class RegisterVehicle(vehicle: Vehicle)

  final case class GetVehicleState(vin: Vehicle.Vin)

}

class VehicleEntity(vin: Vehicle.Vin) extends PersistentActor {
  import VehicleEntity.{Event, VehicleRegistered}
  import com.advancedtelematic.ota.vehicle.Commands._

  override def persistenceId: String = vin.get

  var state: Option[Vehicle] = None

  def updateState(event: Event): Unit = event match {
    case VehicleRegistered(vehicle) =>
      state = Some(vehicle)
  }

  override def receiveRecover: Receive = {
    case e: Event => updateState(e)
  }

  override def receiveCommand: Receive = {
    case RegisterVehicle(vehicle) =>
      persist( VehicleRegistered(vehicle) ) { event =>
        updateState(event)
        sender ! event
      }

    case GetVehicleState(`vin`) =>
      sender ! state
  }
}

object VehicleEntity {
  sealed trait Event

  final case class VehicleRegistered(vehicle: Vehicle) extends Event

  def props(vin: Vehicle.Vin): Props = Props( new VehicleEntity(vin) )
}

class VehicleRegistry extends Actor {
  import com.advancedtelematic.ota.vehicle.Commands._

  private[this] def entityRef(vin: Vehicle.Vin): ActorRef =
    context.child(vin.get).getOrElse( context.actorOf( VehicleEntity.props(vin), vin.get ))

  override def receive: Receive = {
    case cmd@RegisterVehicle(vehicle) =>
      entityRef(vehicle.vin).forward(cmd)

    case cmd@GetVehicleState(vin) =>
      entityRef(vin).forward(cmd)
  }
}

object VehicleRegistry {

  def props(): Props = Props( new VehicleRegistry )
}

class Vehicles(registry: ActorRef)
              (implicit timeout: Timeout) {
  import akka.pattern.ask
  import com.advancedtelematic.ota.vehicle.Commands._

  def registerVehicle(vehicle: Vehicle)
                     (implicit ec: ExecutionContext): Future[Unit] =
    registry.ask( RegisterVehicle(vehicle) ).map(_ => ())

  def getVehicle(vin: Vehicle.Vin)
                (implicit ec: ExecutionContext): Future[Option[Vehicle]] =
    registry.ask( GetVehicleState(vin) ).mapTo[Option[Vehicle]]

}

object Vehicles {
  def apply(registry: ActorRef)
           (implicit timeout: Timeout): Vehicles = new Vehicles(registry)(timeout)

}

