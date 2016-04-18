package com.advancedtelematic.ota.core

import akka.actor.ActorSystem
import akka.http.scaladsl.server.Directives
import akka.stream.ActorMaterializer
import com.advancedtelematic.akka.http.jwt.JwtDirectives._
import com.advancedtelematic.jws.CompactSerialization
import org.genivi.sota.core.VehicleService
import org.genivi.sota.core.resolver.ExternalResolverClient
import slick.driver.MySQLDriver.api._

class OtaPlusCoreVehicleService(db: Database,
                                authPlusSignatureVerifier: CompactSerialization => Boolean,
                                resolverClient: ExternalResolverClient)
                               (implicit system: ActorSystem, mat: ActorMaterializer)
  extends Directives {

  import org.genivi.sota.core.WebService._
  import org.genivi.sota.core.common.NamespaceDirective._

  val vs = new VehicleService(db, resolverClient)

  val route = {
    (pathPrefix("api" / "v1" / "vehicles") & extractVin & pathPrefix("updates")) { vin =>
      pathEnd {
        post {
          authenticateJwt("auth-plus", _ => true) { jwt =>
            oauth2Scope(jwt, s"ota-core.${vin.get}.write") {
              vs.updateInstalledPackages(vin)
            }
          }
        } ~
        get {
          extractNamespace(system) { ns =>
            vs.pendingPackages(ns, vin)
          }
        }
      } ~
      (get & extractUuid & path("download")) { vs.downloadPackage } ~
      (post & extractUuid) { vs.reportInstall }
    }
  }
}
