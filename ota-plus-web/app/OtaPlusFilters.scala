
import akka.stream.Materializer
import brave.play.filter.ZipkinTraceFilter
import javax.inject.Inject
import com.advancedtelematic.LoggingFilter
import play.api.http.HttpFilters
import play.api.mvc.{Filter, RequestHeader, Result}
import play.filters.csrf.CSRFFilter
import play.filters.headers.SecurityHeadersFilter

import scala.concurrent.Future

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

class OtaPlusFilters  @Inject() (
                                  securityHeadersFilter: SecurityHeadersFilter,
                                  csrfFilter: CSRFFilter,
                                  log: LoggingFilter,
                                  b3HeaderPropagation: B3HeaderPropagation,
                                  zipkinTraceFilter: ZipkinTraceFilter,
                                  strictTransportSecurityHeaderFilter: StrictTransportSecurityHeaderFilter
                        ) extends HttpFilters {

  val filters = Seq(
    securityHeadersFilter,
    csrfFilter,
    zipkinTraceFilter,
    log,
    b3HeaderPropagation,
    strictTransportSecurityHeaderFilter
  )
}

