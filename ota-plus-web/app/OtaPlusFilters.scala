
import javax.inject.Inject

import com.advancedtelematic.LoggingFilter
import play.api.http.HttpFilters
import play.filters.csrf.CSRFFilter
import play.filters.headers.SecurityHeadersFilter

class OtaPlusFilters  @Inject() (
                          securityHeadersFilter: SecurityHeadersFilter,
                          csrfFilter: CSRFFilter,
                          log: LoggingFilter
                        ) extends HttpFilters {

  val filters = Seq(securityHeadersFilter, csrfFilter, log)
}

