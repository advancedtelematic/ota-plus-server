package com.advancedtelematic.persistence

import javax.inject.Named

import akka.actor.{Actor, ActorRef, Props}
import akka.persistence.PersistentActor
import akka.util.Timeout
import com.google.inject.Provides
import org.genivi.sota.data.{Device, Uuid}

import scala.concurrent.{ExecutionContext, Future}

object Commands {

  final case class RegisterMetadata(deviceMeta: DeviceMetadata)

  final case class GetMetadataState(device: Uuid)

}

class MetadataEntity(device: Uuid) extends PersistentActor {
  import MetadataEntity.{Event, MetadataRegistered}
  import com.advancedtelematic.persistence.Commands._

  override def persistenceId: String = device.underlying.value

  var state: Option[DeviceMetadata] = None

  def updateState(event: Event): Unit = event match {
    case MetadataRegistered(deviceMeta) =>
      state = Some(deviceMeta)
  }

  override def receiveRecover: Receive = {
    case e: Event => updateState(e)
  }

  override def receiveCommand: Receive = {
    case RegisterMetadata(deviceMeta) =>
      persist( MetadataRegistered(deviceMeta) ) { event =>
        updateState(event)
        sender ! event
      }

    case GetMetadataState(device) =>
      sender ! state
  }
}

object MetadataEntity {
  sealed trait Event

  final case class MetadataRegistered(deviceMeta: DeviceMetadata) extends Event

  def props(device: Uuid): Props = Props( new MetadataEntity(device) )
}

class DeviceMetadataRegistry extends Actor {
  import com.advancedtelematic.persistence.Commands._

  private[this] def entityRef(device: Uuid): ActorRef =
    context
      .child(device.underlying.value)
      .getOrElse( context.actorOf( MetadataEntity.props(device), device.underlying.value ))

  override def receive: Receive = {
    case cmd@RegisterMetadata(deviceMeta) =>
      entityRef(deviceMeta.uuid).forward(cmd)

    case cmd@GetMetadataState(device) =>
      entityRef(device).forward(cmd)
  }
}

object DeviceMetadataRegistry {

  def props(): Props = Props( new DeviceMetadataRegistry )
}

class DeviceMetadataJournal(registry: ActorRef)
              (implicit timeout: Timeout) {
  import akka.pattern.ask
  import com.advancedtelematic.persistence.Commands._

  /**
    * Persists the given device metadata which in turn was obtained from Auth+ during first-time registration of a VIN.
    */
  def registerDeviceMetadata(deviceMeta: DeviceMetadata)
                     (implicit ec: ExecutionContext): Future[Unit] =
    registry.ask( RegisterMetadata(deviceMeta) ).map(_ => ())

  /**
    * Gets from the persistent store the metadata for a device that's been registered already with Auth+.
    * Of particular interest is the clientId, a UUID in one-to-one association with the VIN.
    * Note: the `client_secret` is not contained in the result. It has to be obtained from Auth+.
    */
  def getDeviceMetadata(device: Uuid)
                (implicit ec: ExecutionContext): Future[Option[DeviceMetadata]] =
    registry.ask( GetMetadataState(device) ).mapTo[Option[DeviceMetadata]]

}

object DeviceMetadataJournal {
  def apply(registry: ActorRef)
           (implicit timeout: Timeout): DeviceMetadataJournal = new DeviceMetadataJournal(registry)(timeout)

}

import com.google.inject.AbstractModule
import play.api.libs.concurrent.AkkaGuiceSupport

/**
  * The persistent store will be available via injection to (singleton) controllers.
  */
class DeviceMetadataModule extends AbstractModule with AkkaGuiceSupport {

  def configure: Unit = {
    bindActor[DeviceMetadataRegistry]("device-metadata-registry", _ => DeviceMetadataRegistry.props())
  }

  @Provides
  @Named("device-metadata-journal")
  def getJournal(@Named("device-metadata-registry") registryActor: ActorRef): DeviceMetadataJournal = {
    import scala.concurrent.duration._
    DeviceMetadataJournal(registryActor)(2.seconds)
  }

}
