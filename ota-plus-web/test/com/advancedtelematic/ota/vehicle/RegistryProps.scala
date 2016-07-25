package com.advancedtelematic.ota.vehicle

import java.util.UUID
import java.util.concurrent.TimeUnit

import akka.actor.ActorSystem
import akka.http.scaladsl.model.Uri
import akka.testkit.TestKit
import akka.util.Timeout
import eu.timepit.refined.api.Refined
import org.genivi.sota.data.{DeviceGenerators, DeviceIdGenerators}
import org.scalacheck.Gen
import org.scalatest.concurrent.ScalaFutures
import org.scalatest.{BeforeAndAfterAll, Matchers, PropSpecLike}
import org.scalatest.prop.PropertyChecks

class RegistryProps extends TestKit(ActorSystem("vehicle-registry"))
    with PropSpecLike
    with PropertyChecks
    with Matchers
    with ScalaFutures
    with BeforeAndAfterAll {

  import Gen._

  val ClientInfoGen: Gen[ClientInfo] = for {
    id    <- uuid
    token <- alphaStr.map( RegistrationAccessToken.apply )
  } yield ClientInfo(id, Uri(s"http://ota.plus/clients/$uuid"), token)

  val VehicleGen: Gen[DeviceMetadata] = for {
    clientInfo <- ClientInfoGen
    deviceId <- DeviceGenerators.arbId.arbitrary
  } yield DeviceMetadata(deviceId, clientInfo)

  val vehicles = Vehicles( system.actorOf( VehicleRegistry.props() ) )(Timeout(1, TimeUnit.SECONDS))

  property("Registered vehicle can be requested by vin") {
    implicit val exec = system.dispatcher
    forAll( VehicleGen ) { vehicle =>
      vehicles.registerVehicle(vehicle).flatMap { _ =>
        vehicles.getVehicle(vehicle.deviceId)
      }.futureValue shouldBe Some(vehicle)

    }
  }

  override protected def afterAll(): Unit =
    TestKit.shutdownActorSystem(system)
}
