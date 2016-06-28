package com.advancedtelematic.ota.core

import akka.actor.ActorSystem
import akka.event.Logging
import akka.http.scaladsl.server.{Directives, Route}
import akka.stream.ActorMaterializer
import com.advancedtelematic.ota.common.AuthNamespace
import eu.timepit.refined.api.Refined
import eu.timepit.refined.string.Uuid
import org.genivi.sota.common.DeviceRegistry
import org.genivi.sota.core._
import org.genivi.sota.core.resolver.{Connectivity, ExternalResolverClient}
import org.genivi.sota.core.transfer._
import org.genivi.sota.data.Device
import org.genivi.sota.marshalling.RefinedMarshallingSupport._
import scala.concurrent.ExecutionContext
import slick.driver.MySQLDriver.api._


class OtaPlusCoreWebService(notifier: UpdateNotifier,
                            resolver: ExternalResolverClient,
                            deviceRegistry: DeviceRegistry,
                            db: Database)
                           (implicit system: ActorSystem,
                            mat: ActorMaterializer,
                            connectivity: Connectivity,
                            ec: ExecutionContext) extends Directives {

  implicit val log = Logging(system, "webservice")

  import AuthNamespace._
  import ErrorHandler._
  import PackagesResource._
  import WebService._

  val devicesResource = new DevicesResource(db, connectivity.client, resolver, deviceRegistry, authNamespace)
  val packagesResource = new PackagesResource(resolver, db, authNamespace)
  val updateService = new UpdateService(notifier, deviceRegistry)
  val updateRequestsResource = new UpdateRequestsResource(db, resolver, updateService, authNamespace)
  val historyResource = new HistoryResource(db, authNamespace)

  val deviceRoutes: Route = pathPrefix("devices") {
    extractExecutionContext { implicit ec =>
      authNamespace { ns =>
        (pathEnd & get) { devicesResource.search(ns) }
      }
    }
  }

  val packageRoutes: Route =
    pathPrefix("packages") {
      authNamespace { ns =>
        (pathEnd & get) { packagesResource.searchPackage(ns) } ~
        extractPackageId { pid =>
          pathEnd {
            get { packagesResource.fetch(ns, pid) } ~
            put { packagesResource.updatePackage(ns, pid) }
          } ~
          path("queued") { packagesResource.queuedDevices(ns, pid) }
        }
      }
    }


  val updateRequestRoute: Route =
    pathPrefix("update_requests") {
      (get & extractUuid) { updateRequestsResource.fetch } ~
        pathEnd {
          get { updateRequestsResource.fetchUpdates } ~
          (post & authNamespace) { updateRequestsResource.createUpdate }
        }
    }

  val historyRoutes: Route = {
    (pathPrefix("history") & parameter('uuid.as[String Refined Device.ValidId])) { uuid =>
      authNamespace { ns =>
        (get & pathEnd) {
          historyResource.history(ns, Device.Id(uuid))
        }
      }
    }
  }

  val route = (handleErrors & pathPrefix("api" / "v1")) {
    deviceRoutes ~ packageRoutes ~ updateRequestRoute ~ historyRoutes
  }
}
