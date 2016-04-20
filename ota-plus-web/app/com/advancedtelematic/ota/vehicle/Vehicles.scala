package com.advancedtelematic.ota.vehicle

import javax.inject.Named

import akka.actor.{Actor, ActorRef, Props}
import akka.persistence.PersistentActor
import akka.util.Timeout
import com.google.inject.Provides
import org.genivi.sota.data.Vehicle

import scala.concurrent.{ExecutionContext, Future}

object Commands {

  final case class RegisterVehicle(vehicle: VehicleMetadata)

  final case class GetVehicleState(vin: Vehicle.Vin)

}

class VehicleEntity(vin: Vehicle.Vin) extends PersistentActor {
  import VehicleEntity.{Event, VehicleRegistered}
  import com.advancedtelematic.ota.vehicle.Commands._

  override def persistenceId: String = vin.get

  var state: Option[VehicleMetadata] = None

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

  final case class VehicleRegistered(vehicle: VehicleMetadata) extends Event

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

  /**
    * Persists the given vehicle metadata which in turn was obtained from Auth+ during first-time registration of a VIN.
    */
  def registerVehicle(vehicle: VehicleMetadata)
                     (implicit ec: ExecutionContext): Future[Unit] =
    registry.ask( RegisterVehicle(vehicle) ).map(_ => ())

  /**
    * Gets from the persistent store the vehicle metadata for a VIN that's been already registered with Auth+.
    * Of particular interest is the clientId, a UUID in one-to-one association with the VIN.
    * Note: the `client_secret` is not contained in the result. It has to be obtained from Auth+.
    */
  def getVehicle(vin: Vehicle.Vin)
                (implicit ec: ExecutionContext): Future[Option[VehicleMetadata]] =
    registry.ask( GetVehicleState(vin) ).mapTo[Option[VehicleMetadata]]

}

object Vehicles {
  def apply(registry: ActorRef)
           (implicit timeout: Timeout): Vehicles = new Vehicles(registry)(timeout)

}

import com.google.inject.AbstractModule
import play.api.libs.concurrent.AkkaGuiceSupport

/**
  * The persistent store will be available via injection to (singleton) controllers.
  */
class VehiclesModule extends AbstractModule with AkkaGuiceSupport {

  def configure: Unit = {
    bindActor[VehicleRegistry]("vehicle-registry", _ => VehicleRegistry.props())
  }

  @Provides
  @Named("vehicles-store")
  def getVehicles(@Named("vehicle-registry") registryActor: ActorRef): Vehicles = {
    import scala.concurrent.duration._
    Vehicles(registryActor)(2.seconds)
  }

}
