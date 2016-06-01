package com.advancedtelematic.ota.device_registry

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.server.{Directives, Route}
import akka.stream.ActorMaterializer
import org.genivi.sota.device_registry.Routes
import org.genivi.sota.http.HealthResource
import org.genivi.sota.http.SotaDirectives._
import org.genivi.sota.rest.Handlers.{exceptionHandler, rejectionHandler}
import org.slf4j.LoggerFactory
import scala.util.Try
import slick.jdbc.JdbcBackend.Database


object Boot extends App with Directives {
  implicit val system = ActorSystem("ota-plus-device-registry")
  implicit val materializer = ActorMaterializer()
  implicit val exec = system.dispatcher
  implicit val log = LoggerFactory.getLogger(this.getClass)
  implicit val db = Database.forConfig("database")
  val config = system.settings.config

  import com.advancedtelematic.ota.common.AuthNamespace._

  if (config.getBoolean("database.migrate")) {
    val url = config.getString("database.url")
    val user = config.getString("database.properties.user")
    val password = config.getString("database.properties.password")

    import org.flywaydb.core.Flyway
    val flyway = new Flyway
    flyway.setDataSource(url, user, password)
    flyway.migrate()
  }

  lazy val version = {
    val bi = org.genivi.sota.device_registry.BuildInfo
    val otabi = com.advancedtelematic.ota.device_registry.BuildInfo
    s"${otabi.name}/${otabi.version} ${bi.name}/${bi.version}"
  }

  val routes: Route =
    (logResponseMetrics("ota-plus-device-registry") & versionHeaders(version)) {
      (handleRejections(rejectionHandler) & handleExceptions(exceptionHandler)) {
        pathPrefix("api" / "v1") {
          new Routes(authNamespace).route
        } ~ new HealthResource(db, com.advancedtelematic.ota.device_registry.BuildInfo.toMap).route
      }
    }

  val host = config.getString("server.host")
  val port = config.getInt("server.port")
  val binding = Http().bindAndHandle(routes, host, port)

  log.info(s"OTA device registry started at http://$host:$port/")

  sys.addShutdownHook {
    Try(db.close())
    Try(system.terminate())
  }
}
