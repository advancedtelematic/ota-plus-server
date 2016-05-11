package com.advancedtelematic.ota.core

import akka.actor.ActorSystem
import akka.http.scaladsl.server.Directives
import akka.stream.ActorMaterializer
import com.advancedtelematic.akka.http.jwt.JwtDirectives._
import com.advancedtelematic.jws.CompactSerialization
import org.genivi.sota.core.{UpdateService, VehicleUpdatesResource}
import org.genivi.sota.core.resolver.ExternalResolverClient
import org.genivi.sota.core.transfer.DefaultUpdateNotifier
import org.genivi.sota.data.Vehicle.Vin
import slick.driver.MySQLDriver.api._
import org.genivi.sota.marshalling.RefinedMarshallingSupport._

class OtaCoreVehicleUpdatesResource(db: Database,
                                    authPlusSignatureVerifier: CompactSerialization => Boolean,
                                    resolverClient: ExternalResolverClient)
                                   (implicit system: ActorSystem, mat: ActorMaterializer)
  extends Directives with Namespaces {

  import org.genivi.sota.core.WebService._

  val vs = new VehicleUpdatesResource(db, resolverClient)

  val route = {
    (pathPrefix("api" / "v1" / "vehicle_updates") & extractVin) { vin =>
      (path("installed") & put) {
        authenticateJwt("auth-plus", _ => true) { jwt =>
          oauth2Scope(jwt, s"ota-core.${vin.get}.write") {
            vs.updateInstalledPackages(vin)
          }
        }
      } ~
      (put & path("order")) { vs.setInstallOrder(vin) } ~
      (get & pathEnd & extractNamespace(system)) { ns =>
        vs.pendingPackages(ns, vin)
      } ~
      (post & extractNamespace) { ns => vs.queueVehicleUpdate(ns, vin) } ~
      (get & extractUuid & path("download")) { vs.downloadPackage } ~
      (post & extractUuid) { vs.reportInstall }
    }
  }
}
