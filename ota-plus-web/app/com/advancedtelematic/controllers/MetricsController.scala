package com.advancedtelematic.controllers

import java.io.StringWriter

import akka.util.ByteString
import com.advancedtelematic.metrics.{JvmMetrics, LoggerMetrics, MetricsRepresentation, MetricsSupport}
import io.prometheus.client.dropwizard.DropwizardExports
import io.prometheus.client.CollectorRegistry
import io.prometheus.client.exporter.common.TextFormat
import javax.inject.{Inject, Singleton}
import play.api.http.{ContentTypes, Writeable}
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}
import play.api.Logger

import scala.concurrent.Await

object MetricsController {
  import scala.concurrent.ExecutionContext.Implicits.global
  import scala.concurrent.duration.DurationInt
  implicit val metricsWriteable: Writeable[MetricsRepresentation] = Writeable( (x: MetricsRepresentation) =>
    Await.result(x.metricsJson.map(y => ByteString(y.noSpaces)), 0.millis), Some(ContentTypes.JSON))
}

@Singleton
class MetricsController @Inject() (components: ControllerComponents) extends AbstractController(components) {

  private[this] val log = Logger(this.getClass)

  // We cannot extend MetricsSupport because it will try to register metrics in an singleton
  // registry and fail second time. The controller can be instantiated several times inside
  // same JVM during the tests.
  try {
    new MetricsSupport {}
  } catch {
    case t: IllegalArgumentException =>
      log.warn("Failed to initialize metrics. It is possible they are already initialized.", t)
  }

  CollectorRegistry.defaultRegistry.register(new DropwizardExports(MetricsSupport.metricRegistry))

  private[this] val metricSets =
    List(new JvmMetrics(MetricsSupport.metricRegistry), new LoggerMetrics(MetricsSupport.metricRegistry))
      .map(x => x.urlPrefix -> x).toMap

  def metric(metricSet: String): Action[AnyContent] = Action { _ =>
    import MetricsController.metricsWriteable
    metricSets.get(metricSet) match {
      case Some(ms) => Ok(ms)
      case None => NotFound
    }
  }

  def metricSamples(names: List[String]): Action[AnyContent] = Action { _ =>
    val stringWriter = new StringWriter()
    val samples = names match {
      case Nil =>
        CollectorRegistry.defaultRegistry.metricFamilySamples()
      case xs =>
        import scala.collection.JavaConverters._
        CollectorRegistry.defaultRegistry.filteredMetricFamilySamples(names.toSet.asJava)
    }
    TextFormat.write004(stringWriter, samples)
    Ok(stringWriter.toString)
  }
}
