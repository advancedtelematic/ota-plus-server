package com.advancedtelematic.ota.resolver

import akka.actor.ActorSystem
import akka.http.scaladsl.server._
import akka.stream.ActorMaterializer
import org.genivi.sota.resolver.packages.PackageDirectives
import slick.jdbc.JdbcBackend._

import scala.concurrent.ExecutionContext

class PackageFiltersResource(implicit system: ActorSystem,
                             db: Database, mat:
                             ActorMaterializer,
                             ec: ExecutionContext) extends Directives {

  import org.genivi.sota.resolver.common.RefinementDirectives._
  import com.advancedtelematic.ota.common.AuthNamespace._

  val packageDirectives = new PackageDirectives(authNamespace)

  val routes: Route = (pathPrefix("package_filters") & refinedPackageId & authNamespace) { (pid, ns) =>
    packageDirectives.packageFilterApi(ns, pid)
  }
}
