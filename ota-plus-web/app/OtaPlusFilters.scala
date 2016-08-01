
import javax.inject.Inject

import com.advancedtelematic.{LoggingFilter, TraceIdFilter}
import play.api.http.HttpFilters
import play.filters.csrf.CSRFFilter
import play.filters.headers.SecurityHeadersFilter

class OtaPlusFilters  @Inject() (
                          securityHeadersFilter: SecurityHeadersFilter,
                          csrfFilter: CSRFFilter,
                          log: LoggingFilter,
                          traceIdFilter: TraceIdFilter
                        ) extends HttpFilters {

  val filters = Seq(securityHeadersFilter, csrfFilter, traceIdFilter, log)
}

