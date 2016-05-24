package com.advancedtelematic.ota.devices

import akka.actor.ActorSystem
import akka.event.Logging
import akka.http.scaladsl.Http
import akka.http.scaladsl.server.{Directives, Route}
import akka.stream.ActorMaterializer
import org.genivi.sota.device_registry.Routes
import org.genivi.sota.http.SotaDirectives._

import scala.concurrent.ExecutionContext
import scala.util.Try
import slick.jdbc.JdbcBackend.Database
import org.genivi.sota.http.HealthResource

class Routing
(implicit db: Database, system: ActorSystem, mat: ActorMaterializer, exec: ExecutionContext)
  extends Directives {

  import org.genivi.sota.rest.Handlers._

  val route: Route = pathPrefix("api" / "v1") {
    handleRejections(rejectionHandler) {
      handleExceptions(exceptionHandler) {
        new Routes().route
      }
    }
  }
}

object Boot extends App with Directives {
  implicit val system       = ActorSystem("ota-plus-device-registry")
  implicit val materializer = ActorMaterializer()
  implicit val exec         = system.dispatcher
  implicit val log          = Logging(system, "boot")
  implicit val db           = Database.forConfig("database")
  val config = system.settings.config

  lazy val version = {
    val bi = org.genivi.sota.device_registry.BuildInfo
    "ota-plus-devices/" + bi.version
  }

  lazy val routes = versionHeaders(version) { Route.seal((new Routing).route ~ new HealthResource(db).route) }

  // Database migrations
  if (config.getBoolean("database.migrate")) {
    val url = config.getString("database.url")
    val user = config.getString("database.properties.user")
    val password = config.getString("database.properties.password")

    import org.flywaydb.core.Flyway
    val flyway = new Flyway
    flyway.setDataSource(url, user, password)
    flyway.migrate()
  }

  val host          = system.settings.config.getString("server.host")
  val port          = system.settings.config.getInt("server.port")
  val bindingFuture = Http().bindAndHandle(routes, host, port)

  log.info(s"Server online at http://$host:$port/")

  sys.addShutdownHook {
    Try(db.close())
    Try(system.terminate())
  }
}
