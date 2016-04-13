package com.advancedtelematic.core

import akka.actor.ActorSystem
import akka.event.Logging
import akka.http.scaladsl.server.Directives
import akka.http.scaladsl.server.Route
import akka.stream.ActorMaterializer
import org.genivi.sota.core.transfer._
import slick.driver.MySQLDriver.api._
import org.genivi.sota.core._
import org.genivi.sota.core.resolver.{Connectivity, ExternalResolverClient}

class OtaPlusCoreWebservice(notifier: UpdateNotifier, resolver: ExternalResolverClient, db : Database)
                           (implicit system: ActorSystem, mat: ActorMaterializer,
                            connectivity: Connectivity) extends Directives  {
  implicit val log = Logging(system, "webservice")

  import ErrorHandler._
  import PackagesResource._
  import WebService._

  val vehiclesResource = new VehiclesResource(db, connectivity.client, resolver)
  val packagesResource = new PackagesResource(resolver, db)
  val updateRequestsResource = new UpdateRequestsResource(db, resolver, new UpdateService(notifier))

  val vehicleRoutes: Route = pathPrefix("vehicles") {
    extractVin { vin =>
      pathEnd {
        get { vehiclesResource.fetchVehicle(vin) } ~
          put { vehiclesResource.updateVehicle(vin) } ~
          delete { vehiclesResource.deleteVehicle(vin) }
      } ~
        (path("queued") & get) { vehiclesResource.queuedPackages(vin) } ~
        (path("history") & get) { vehiclesResource.history(vin) } ~
        (path("sync") & put) { vehiclesResource.sync(vin) }
    } ~
      (pathEnd & get) { vehiclesResource.search }
  }

  val packageRoutes: Route =
    pathPrefix("packages") {
      (pathEnd & get) { packagesResource.searchPackage } ~
        extractPackageId { pid =>
          pathEnd {
            get { packagesResource.fetch(pid) } ~
              put { packagesResource.updatePackage(pid) }
          } ~
            path("queued") { packagesResource.queued(pid) }
        }
    }


  val updateRequestRoute: Route =
    pathPrefix("updates") {
      (get & extractUuid) { updateRequestsResource.fetch } ~
        (extractVin & post) { updateRequestsResource.queueVehicleUpdate } ~
        pathEnd {
          get { updateRequestsResource.fetchUpdates } ~
            post { updateRequestsResource.createUpdate }
        }
    }

  val route = (handleErrors & pathPrefix("api" / "v1")) {
    vehicleRoutes ~ packageRoutes ~ updateRequestRoute
  }
}

