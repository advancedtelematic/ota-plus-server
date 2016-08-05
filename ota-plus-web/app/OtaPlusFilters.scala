
import javax.inject.Inject

import com.advancedtelematic.{LoggingFilter, TraceIdFilter}
import play.api.http.HttpFilters
import play.filters.csrf.CSRFFilter

class OtaPlusFilters  @Inject() (
                          csrfFilter: CSRFFilter,
                          log: LoggingFilter,
                          traceIdFilter: TraceIdFilter
                        ) extends HttpFilters {

  val filters = Seq(csrfFilter, traceIdFilter, log)
}

