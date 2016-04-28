package com.advancedtelematic.ota.resolver

import akka.actor.ActorSystem
import akka.event.Logging
import akka.http.scaladsl.server._
import akka.stream.ActorMaterializer
import org.genivi.sota.resolver.common.NamespaceDirective
import org.genivi.sota.resolver.packages.PackageDirectives
import slick.jdbc.JdbcBackend._

import scala.concurrent.ExecutionContext

class PackageFiltersResource(implicit system: ActorSystem,
                             db: Database, mat:
                             ActorMaterializer,
                             ec: ExecutionContext) extends Directives {

  import org.genivi.sota.resolver.common.RefinementDirectives._
  import NamespaceDirective._

  val packageDirectives = new PackageDirectives()

  val routes: Route = (pathPrefix("package_filters") & refinedPackageId & extractNamespace) { (pid, ns) =>
    packageDirectives.packageFilterApi(ns, pid)
  }
}
