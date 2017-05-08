package com.advancedtelematic.persistence

import akka.actor.ActorSystem
import akka.http.scaladsl.model.Uri
import akka.testkit.TestKit
import akka.util.Timeout
import eu.timepit.refined.api.Refined
import java.util.concurrent.TimeUnit
import org.genivi.sota.data.{DeviceGenerators, DeviceIdGenerators, Uuid, UuidGenerator}
import org.scalacheck.{Arbitrary, Gen}
import org.scalatest.concurrent.ScalaFutures
import org.scalatest.prop.PropertyChecks
import org.scalatest.{BeforeAndAfterAll, Matchers, PropSpecLike}


class RegistryProps extends TestKit(ActorSystem("device-metadata-registry"))
    with PropSpecLike
    with PropertyChecks
    with Matchers
    with ScalaFutures
    with BeforeAndAfterAll {

  import Arbitrary._
  import Gen._
  import UuidGenerator._

  val ClientInfoGen: Gen[ClientInfo] = for {
    id    <- uuid
    token <- alphaStr.map( RegistrationAccessToken.apply )
  } yield ClientInfo(id, Uri(s"http://ota.plus/clients/$uuid"), token)

  val DeviceMetadataGen: Gen[DeviceMetadata] = for {
    clientInfo <- ClientInfoGen
    uuid <- arbitrary[Uuid]
  } yield DeviceMetadata(uuid, clientInfo)

  val journal = DeviceMetadataJournal( system.actorOf( DeviceMetadataRegistry.props() ) )(Timeout(10, TimeUnit.SECONDS))

  ignore("Registered device-metadata can be requested by device-uuid") {
    implicit val exec = system.dispatcher
    forAll( DeviceMetadataGen ) { devMeta =>
      journal.registerDeviceMetadata(devMeta).flatMap { _ =>
        journal.getDeviceMetadata(devMeta.uuid)
      }.futureValue shouldBe Some(devMeta)

    }
  }

  override protected def afterAll(): Unit =
    TestKit.shutdownActorSystem(system)
}
