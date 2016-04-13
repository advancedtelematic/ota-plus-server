package com.advancedtelematic.core

import akka.actor.ActorSystem
import akka.http.scaladsl.server.Directives
import akka.stream.ActorMaterializer
import slick.driver.MySQLDriver.api._
import org.genivi.sota.core.VehicleService
import org.genivi.sota.core.resolver.ExternalResolverClient

class OtaPlusCoreVehicleService(db: Database, resolverClient: ExternalResolverClient)
                               (implicit system: ActorSystem, mat: ActorMaterializer)
  extends Directives {

  import org.genivi.sota.core.WebService._

  val vs = new VehicleService(db, resolverClient)

  val route = {
    (pathPrefix("api" / "v1" / "vehicles") & extractVin & pathPrefix("updates")) { vin =>
      (post & pathEnd) { vs.updateInstalledPackages(vin) } ~
      (get & pathEnd) { vs.pendingPackages(vin) } ~
      (get & extractUuid & path("download")) { vs.downloadPackage } ~
      (post & extractUuid) { vs.reportInstall }
    }
  }
}
