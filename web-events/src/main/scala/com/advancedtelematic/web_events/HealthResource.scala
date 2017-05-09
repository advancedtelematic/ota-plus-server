/**
 * Copyright: Copyright (C) 2016, ATS Advanced Telematic Systems GmbH
 * License: MPL-2.0
 */
package com.advancedtelematic.web_events

import java.lang.management.ManagementFactory
import javax.management.{JMX, ObjectName}

import akka.http.scaladsl.server.Directives
import scala.collection.JavaConverters._
import scala.concurrent.{ExecutionContext, Future}
import org.genivi.sota.marshalling.CirceMarshallingSupport._
import io.circe.syntax._
import org.genivi.sota.monitoring.MetricsSupport

class HealthResource(versionRepr: Map[String, Any] = Map.empty)
                    (implicit val ec: ExecutionContext) {
  import Directives._

  val metricRegistry = MetricsSupport.metricRegistry

  val route =
    (get & pathPrefix("health")) {
      pathEnd {
        val f = Future.successful(Map("status" -> "OK"))
        complete(f)
      } ~
      path("version") {
        val f = versionRepr.mapValues(_.toString).asJson

        complete(f)
      } ~
      path("jvm") {
        val jvm = metricRegistry.getGauges(MetricsSupport.JvmFilter).asScala
        val data = jvm.mapValues(_.getValue.toString)

        complete(data.toMap.asJson)
      }
    }
}
