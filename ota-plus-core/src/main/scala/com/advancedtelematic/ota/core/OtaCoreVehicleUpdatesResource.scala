package com.advancedtelematic.ota.core

import akka.actor.ActorSystem
import akka.http.scaladsl.server.Directives
import akka.stream.ActorMaterializer
import com.advancedtelematic.akka.http.jwt.JwtDirectives._
import com.advancedtelematic.jws.CompactSerialization
import com.advancedtelematic.ota.common.AuthNamespace
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
  extends Directives {

  import org.genivi.sota.core.WebService._
  import AuthNamespace._

  val vs = new VehicleUpdatesResource(db, resolverClient, authNamespace)

  /**
    * Routes are grouped first by HTTP method to avoid tricky misunderstandings on the part of the Routing DSL.
    * These routes must be kept in synch with [[VehicleUpdatesResource]]
    */
  val route = {
    (pathPrefix("api" / "v1" / "vehicle_updates") & extractVin) { vin =>
      get {
        pathEnd { vs.logVehicleSeen(vin) { vs.pendingPackages(vin) } } ~
        path("queued") { vs.pendingPackages(vin) } ~
        path("results") { vs.resultsForVehicle(vin) } ~
        (extractUuid & path("results")) { uuid => vs.resultsForUpdate(uuid) } ~
        (extractUuid & path("download")) { uuid => vs.downloadPackage(vin, uuid) }
      } ~
      put {
        (path("installed")) {
          authenticateJwt("auth-plus", _ => true) { jwt =>
            oauth2Scope(jwt, s"ota-core.${vin.get}.write") {
              vs.updateInstalledPackages(vin)
            }
          }
        } ~
        path("order") { vs.setInstallOrder(vin) } ~
        (extractUuid & path("cancelupdate") & authNamespace) { (uuid, ns) => vs.cancelUpdate(ns, vin, uuid) }
      } ~
      post {
        path("sync") { vs.sync(vin) } ~
        (authNamespace & pathEnd) { ns => vs.queueVehicleUpdate(ns, vin) } ~
        (extractUuid & pathEnd) { vs.reportInstall }
      }
    }
  }
}
