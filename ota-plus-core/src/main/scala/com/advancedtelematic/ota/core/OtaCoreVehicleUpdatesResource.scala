package com.advancedtelematic.ota.core

import akka.actor.ActorSystem
import akka.http.scaladsl.server.Directives
import akka.stream.ActorMaterializer
import cats.Show
import cats.syntax.show.toShowOps
import com.advancedtelematic.akka.http.jwt.JwtDirectives._
import com.advancedtelematic.jws.CompactSerialization
import com.advancedtelematic.ota.common.AuthNamespace
import org.genivi.sota.common.DeviceRegistry
import org.genivi.sota.core.resolver.ExternalResolverClient
import org.genivi.sota.core.transfer.DefaultUpdateNotifier
import org.genivi.sota.core.{UpdateService, DeviceUpdatesResource}
import org.genivi.sota.data.Device
import org.genivi.sota.marshalling.RefinedMarshallingSupport._
import slick.driver.MySQLDriver.api._


class OtaCoreDeviceUpdatesResource(db: Database,
                                    authPlusSignatureVerifier: CompactSerialization => Boolean,
                                    resolverClient: ExternalResolverClient,
                                    deviceRegistry: DeviceRegistry)
                                   (implicit system: ActorSystem, mat: ActorMaterializer)
  extends Directives {

  import AuthNamespace._
  import org.genivi.sota.core.WebService._
  import Device._

  val ds = new DeviceUpdatesResource(db, resolverClient, deviceRegistry, authNamespace)

  /**
    * Routes are grouped first by HTTP method to avoid tricky misunderstandings on the part of the Routing DSL.
    * These routes must be kept in synch with [[DeviceUpdatesResource]]
    */
  val route = {
    // TODO vehicle_updates -> device_updates
    (pathPrefix("api" / "v1" / "vehicle_updates") & extractDeviceUuid) { device =>
      get {
        pathEnd { ds.logDeviceSeen(device) { ds.pendingPackages(device) } } ~
        path("queued") { ds.pendingPackages(device) } ~
        path("results") { ds.results(device) } ~
        (extractUuid & path("results")) { updateId => ds.resultsForUpdate(device, updateId) } ~
        (extractUuid & path("download")) { updateId => ds.downloadPackage(device, updateId) }
      } ~
      put {
        (path("installed")) {
          authenticateJwt("auth-plus", _ => true) { jwt =>
            oauth2Scope(jwt, s"ota-core.${device.show}.write") {
              ds.updateInstalledPackages(device)
            }
          }
        } ~
        path("order") { ds.setInstallOrder(device) } ~
        (extractUuid & path("cancelupdate") & authNamespace) { (updateId, _) => ds.cancelUpdate(device, updateId) }
      } ~
      post {
        path("sync") { ds.sync(device) } ~
        (authNamespace & pathEnd) { ns => ds.queueDeviceUpdate(ns, device) } ~
        (extractUuid & pathEnd) { ds.reportInstall }
      }
    }
  }
}
