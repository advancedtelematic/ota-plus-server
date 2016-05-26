package com.advancedtelematic.ota.core

import akka.actor.ActorSystem
import akka.event.Logging
import akka.http.scaladsl.server.{Directives, Route}
import akka.stream.ActorMaterializer
import com.advancedtelematic.ota.common.Namespaces
import org.genivi.sota.core._
import org.genivi.sota.core.resolver.{Connectivity, ExternalResolverClient}
import org.genivi.sota.core.transfer._
import org.genivi.sota.data.Vehicle
import org.genivi.sota.data.Vehicle.Vin
import slick.driver.MySQLDriver.api._
import org.genivi.sota.marshalling.RefinedMarshallingSupport._

class OtaPlusCoreWebservice(notifier: UpdateNotifier, resolver: ExternalResolverClient, db : Database)
                           (implicit system: ActorSystem, mat: ActorMaterializer,
                            connectivity: Connectivity) extends Directives with Namespaces {

  implicit val log = Logging(system, "webservice")

  import ErrorHandler._
  import PackagesResource._
  import WebService._

  val vehiclesResource = new VehiclesResource(db, connectivity.client, resolver)
  val packagesResource = new PackagesResource(resolver, db)
  val updateRequestsResource = new UpdateRequestsResource(db, resolver, new UpdateService(notifier))
  val historyResource = new HistoryResource(db)

  val deviceRoutes: Route = pathPrefix("vehicles") {
    extractExecutionContext { implicit ec =>
      extractNamespace(system) { ns =>
        extractVin { vin =>
          pathEnd {
            get { vehiclesResource.fetchVehicle(ns, vin) } ~
            put { vehiclesResource.updateVehicle(ns, vin) } ~
            delete { vehiclesResource.deleteVehicle(ns, vin) }
          }
        } ~
        (pathEnd & get) { vehiclesResource.search(ns) }
      }
    }
  }

  val packageRoutes: Route =
    pathPrefix("packages") {
      extractNamespace(system) { ns =>
        (pathEnd & get) { packagesResource.searchPackage(ns) } ~
        extractPackageId { pid =>
          pathEnd {
            get { packagesResource.fetch(ns, pid) } ~
            put { packagesResource.updatePackage(ns, pid) }
          } ~
          path("queued") { packagesResource.queuedVins(ns, pid) }
        }
      }
    }


  val updateRequestRoute: Route =
    pathPrefix("update_requests") {
      (get & extractUuid) { updateRequestsResource.fetch } ~
        pathEnd {
          get { updateRequestsResource.fetchUpdates } ~
          (extractNamespace & post) { updateRequestsResource.createUpdate }
        }
    }

  val historyRoutes: Route = {
    (pathPrefix("history") & parameter('vin.as[Vin])) { vin =>
      extractNamespace(system) { ns =>
        (get & pathEnd) {
          historyResource.history(ns, vin)
        }
      }
    }
  }

  val route = (handleErrors & pathPrefix("api" / "v1")) {
    deviceRoutes ~ packageRoutes ~ updateRequestRoute ~ historyRoutes
  }
}
