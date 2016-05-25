package com.advancedtelematic.ota.resolver

import akka.actor.ActorSystem
import akka.http.scaladsl.server.Directives
import akka.stream.ActorMaterializer
import com.advancedtelematic.ota.common.Namespaces
import org.genivi.sota.resolver.vehicles.VehicleDirectives
import slick.jdbc.JdbcBackend.Database

import scala.concurrent.ExecutionContext

class OtaPlusVehiclesResource(implicit system: ActorSystem,
                              db: Database,
                              mat: ActorMaterializer,
                              ec: ExecutionContext) extends Directives with Namespaces {

  val vs = new VehicleDirectives()

  val routes = {
    (pathPrefix("vehicles") & extractNamespace) { ns =>
      (get & pathEnd) {
        vs.searchVehicles(ns)
      } ~
        vs.extractVin { vin =>
          (get & pathEnd) {
            vs.getVehicle(ns, vin)
          } ~
            (put & pathEnd) {
              vs.addVehicle(ns, vin)
            } ~
            (delete & pathEnd) {
              vs.deleteVehicle(ns, vin)
            } ~
            vs.packageApi(vin) ~
            vs.componentApi(vin)
        }
    }
  }
}
