
import akka.stream.Materializer
import brave.play.filter.ZipkinTraceFilter

import javax.inject.Inject
import com.advancedtelematic.LoggingFilter
import com.advancedtelematic.api.Errors.RemoteApiError
import com.advancedtelematic.metrics.MetricsSupport
import com.codahale.metrics.{Counter, Histogram, MetricRegistry}
import play.api.http.{HttpFilters, Status}
import play.api.mvc.{Filter, RequestHeader, Result}
import play.filters.csrf.CSRFFilter
import play.filters.headers.SecurityHeadersFilter

import scala.concurrent.Future
import scala.util.{Failure, Success}

class B3HeaderPropagation @Inject() (implicit val mat: Materializer) extends Filter {
  import mat.executionContext

  override def apply(nextFilter: RequestHeader => Future[Result])(rh: RequestHeader): Future[Result] = {
    nextFilter(rh).map { result =>
      rh.headers.get("x-b3-traceid") match {
        case Some(traceId) => result.withHeaders("x-b3-traceid" -> traceId)
        case None => result
      }
    }
  }
}

class StrictTransportSecurityHeaderFilter @Inject()(implicit val mat: Materializer) extends Filter {
  import mat.executionContext

  override def apply(nextFilter: RequestHeader => Future[Result])(requestHeader: RequestHeader): Future[Result] = {
    nextFilter(requestHeader)
      .map(_.withHeaders("Strict-Transport-Security" -> "max-age=31536000"))
  }
}

class HttpRequestMetricsFilter @Inject()(implicit val mat: Materializer) extends Filter {
  import mat.executionContext
  val registry: MetricRegistry = MetricsSupport.metricRegistry
  val requests: Counter = registry.counter("http_requests")
  val success: Counter = registry.counter("http_requests_success")
  val failures_4xx: Counter = registry.counter("http_requests_failed_4xx")
  val failures_5xx: Counter = registry.counter("http_requests_failed_5xx")
  val responseTime: Histogram = registry.histogram("http_app_response_time")

  private def addMetric(startAt: Long, statusCode: Int): Unit = {
    requests.inc()
    statusCode match {
      case status if status < 400                  => success.inc()
      case status if status >= 400 && status < 500 => failures_4xx.inc()
      case status if status >= 500                 => failures_5xx.inc()
    }
    responseTime.update(System.currentTimeMillis() - startAt)
  }

  override def apply(nextFilter: RequestHeader => Future[Result])(requestHeader: RequestHeader): Future[Result] = {
    val startAt = System.currentTimeMillis()
    nextFilter(requestHeader) andThen  {
      case Success(result)                    => addMetric(startAt, result.header.status)
      case Failure(RemoteApiError(result, _)) => addMetric(startAt, result.header.status)
      case Failure(_)                         => addMetric(startAt, Status.INTERNAL_SERVER_ERROR)
    }
  }
}

class OtaPlusFilters  @Inject() (
                                  securityHeadersFilter: SecurityHeadersFilter,
                                  csrfFilter: CSRFFilter,
                                  log: LoggingFilter,
                                  b3HeaderPropagation: B3HeaderPropagation,
                                  zipkinTraceFilter: ZipkinTraceFilter,
                                  strictTransportSecurityHeaderFilter: StrictTransportSecurityHeaderFilter,
                                  httpRequestMetricsFilter: HttpRequestMetricsFilter
                        ) extends HttpFilters {

  val filters = Seq(
    securityHeadersFilter,
    csrfFilter,
    zipkinTraceFilter,
    log,
    b3HeaderPropagation,
    strictTransportSecurityHeaderFilter,
    httpRequestMetricsFilter
  )
}
