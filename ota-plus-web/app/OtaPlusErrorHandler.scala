import javax.inject._

import com.advancedtelematic.api.{RemoteApiError, RemoteApiIOError, RemoteApiParseError}
import play.api.http.DefaultHttpErrorHandler
import play.api._
import play.api.mvc._
import play.api.mvc.Results._
import play.api.routing.Router

import scala.concurrent._

class OtaPlusErrorHandler @Inject() (
                               env: Environment,
                               config: Configuration,
                               sourceMapper: OptionalSourceMapper,
                               router: Provider[Router]
                             ) extends DefaultHttpErrorHandler(env, config, sourceMapper, router) {

  override def onServerError(request: RequestHeader, exception: Throwable): Future[Result] = {
    val handler: PartialFunction[Throwable, Result] = {
      case RemoteApiError(result, _) =>
        result
      case RemoteApiIOError(cause) =>
        BadGateway(cause.getMessage)
      case RemoteApiParseError(e) =>
        BadGateway(e)
    }

    if(handler.isDefinedAt(exception))
      Future.successful(handler(exception))
    else
      super.onServerError(request, exception)
  }
}
