
import javax.inject.Inject

import com.advancedtelematic.LoggingFilter
import play.api.http.HttpFilters

class OtaPlusFilters  @Inject() (
                          log: LoggingFilter
                        ) extends HttpFilters {

  val filters = Seq(log)
}

