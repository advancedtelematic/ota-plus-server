package com.advancedtelematic.ota.core

import akka.actor.ActorSystem
import akka.event.Logging
import akka.http.scaladsl.Http
import akka.http.scaladsl.model.Uri
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import akka.stream.ActorMaterializer
import com.advancedtelematic.jwa.`HMAC SHA-256`
import com.advancedtelematic.jws.{JwsVerifier, KeyLookup}
import com.advancedtelematic.ota.common.TraceId
import com.typesafe.config.{Config, ConfigFactory}
import javax.crypto.SecretKey
import javax.crypto.spec.SecretKeySpec
import org.apache.commons.codec.binary.Base64
import org.genivi.sota.client.DeviceRegistryClient
import org.genivi.sota.core.db._
import org.genivi.sota.core.resolver.{Connectivity, DefaultConnectivity, DefaultExternalResolverClient}
import org.genivi.sota.core.transfer._
import org.genivi.sota.http.HealthResource
import org.genivi.sota.http.SotaDirectives._
import scala.util.{Failure, Success, Try}


class Settings(config: Config) {
  val host = config.getString("server.host")
  val port = config.getInt("server.port")

  val resolverUri = Uri(config.getString("resolver.baseUri"))
  val resolverResolveUri = Uri(config.getString("resolver.resolveUri"))
  val resolverPackagesUri = Uri(config.getString("resolver.packagesUri"))
  val resolverVehiclesUri = Uri(config.getString("resolver.vehiclesUri"))

  val deviceRegistryUri = Uri(config.getString("device_registry.baseUri"))
  val deviceRegistryApi = Uri(config.getString("device_registry.devicesUri"))

  val authPlusSignatureVerifier = {
    import com.advancedtelematic.json.signature.JcaSupport._
    val keyBase64 = config.getString("token.secret")
    val key: SecretKey = new SecretKeySpec( Base64.decodeBase64(keyBase64), "HMAC")
    JwsVerifier().algorithmAndKeys(`HMAC SHA-256`, KeyLookup.const(key)).verifySignature _
  }
}


object Boot extends App {
  val config = ConfigFactory.load()
  val settings = new Settings(config)
  import slick.driver.MySQLDriver.api._
  val db = Database.forConfig("database", config)

  implicit val session: Session = db.createSession()
  implicit val connectivity: Connectivity = DefaultConnectivity

  implicit val system = ActorSystem("sota-core-service")
  implicit val materializer = ActorMaterializer()
  implicit val exec = system.dispatcher
  implicit val log = Logging(system, "boot")

  sys.addShutdownHook {
    Try(db.close())
    Try(system.terminate())
  }

  if (config.getBoolean("database.migrate")) {
    val url = config.getString("database.url")
    val user = config.getString("database.properties.user")
    val password = config.getString("database.properties.password")

    import org.flywaydb.core.Flyway
    val flyway = new Flyway
    flyway.setDataSource(url, user, password)
    flyway.migrate()
  }

  val externalResolverClient = new DefaultExternalResolverClient(
    settings.resolverUri, settings.resolverResolveUri, settings.resolverPackagesUri, settings.resolverVehiclesUri
  )

  val deviceRegistry= new DeviceRegistryClient(
    settings.deviceRegistryUri, settings.deviceRegistryApi
  )

  val healthResource = new HealthResource(db, com.advancedtelematic.ota.core.BuildInfo.toMap)
  val webService = new OtaPlusCoreWebService(DefaultUpdateNotifier, externalResolverClient, deviceRegistry, db)
  val vehicleService = new OtaCoreDeviceUpdatesResource(db,
    settings.authPlusSignatureVerifier, externalResolverClient, deviceRegistry)

  lazy val version = {
    val bi = org.genivi.sota.core.BuildInfo
    val otabi = com.advancedtelematic.ota.core.BuildInfo
    s"${otabi.name}/${otabi.version} ${bi.name}/${bi.version}"
  }

  val routes = Route.seal(
    healthResource.route ~
    webService.route ~
    vehicleService.route
  )

  val loggedRoutes = {
    (logRequestResult("ota-plus-core", Logging.DebugLevel) &
      TraceId.withTraceId &
      logResponseMetrics("ota-plus-core", TraceId.traceMetrics) &
      versionHeaders(version)) {
      routes
    }
  }

  val startF = Http().bindAndHandle(loggedRoutes, settings.host, settings.port)

  startF onComplete {
    case Success(services) =>
      log.info(s"ota-plus-server/core online at http://${settings.host}:${settings.port}")
    case Failure(e) =>
      log.error(e, "Unable to start")
      sys.exit(1)
  }
}
