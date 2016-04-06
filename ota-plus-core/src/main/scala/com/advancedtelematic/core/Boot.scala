package com.advancedtelematic.core

import akka.actor.ActorSystem
import akka.event.Logging
import akka.http.scaladsl.Http
import akka.http.scaladsl.model.Uri
import akka.http.scaladsl.server.Directives
import akka.stream.ActorMaterializer
import org.genivi.sota.core.db._
import org.genivi.sota.core.rvi._
import org.genivi.sota.core.transfer._
import slick.driver.MySQLDriver.api._
import Directives._
import org.genivi.sota.core._
import org.genivi.sota.core.resolver.{Connectivity, DefaultConnectivity, DefaultExternalResolverClient}
import scala.util.{Failure, Success, Try}

object Boot extends App with DatabaseConfig {

  implicit val connectivity: Connectivity = DefaultConnectivity

  implicit val system = ActorSystem("sota-core-service")
  implicit val materializer = ActorMaterializer()
  implicit val exec = system.dispatcher
  implicit val log = Logging(system, "boot")
  val config = system.settings.config

  val externalResolverClient = new DefaultExternalResolverClient(
    Uri(config.getString("resolver.baseUri")),
    Uri(config.getString("resolver.resolveUri")),
    Uri(config.getString("resolver.packagesUri")),
    Uri(config.getString("resolver.vehiclesUri"))
  )

  val host = config.getString("server.host")
  val port = config.getInt("server.port")

  lazy val healthResource = new HealthResource(db)
  lazy val webService = new OtaPlusCoreWebservice(DefaultUpdateNotifier, externalResolverClient, db)
  lazy val vehicleService = new OtaPlusCoreVehicleService(db, externalResolverClient)

  lazy val routes = logRequestResult("ota-plus-core", Logging.DebugLevel) {
    healthResource.route ~
    webService.route ~
    vehicleService.route
  }

  val startF = Http().bindAndHandle(routes, host, port)

  startF onComplete {
    case Success(services) =>
      log.info(s"ota-plus-server/core online at http://$host:$port")
    case Failure(e) =>
      log.error(e, "Unable to start")
      sys.exit(-1)
  }

  sys.addShutdownHook {
    Try(db.close())
    Try(system.terminate())
  }
}
