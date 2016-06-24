
import javax.inject.Inject

import com.advancedtelematic.{LoggingFilter, TraceIdFilter}
import play.api.http.HttpFilters

class OtaPlusFilters  @Inject() (
                          log: LoggingFilter,
                          traceIdFilter: TraceIdFilter
                        ) extends HttpFilters {

  val filters = Seq(traceIdFilter, log)
}

