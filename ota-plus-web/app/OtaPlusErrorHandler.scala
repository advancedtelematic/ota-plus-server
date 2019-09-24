import javax.inject._

import com.advancedtelematic.api.{RemoteApiError, RemoteApiIOError, RemoteApiParseError}
import play.api.http.DefaultHttpErrorHandler
import play.api._
import play.api.mvc._
import play.api.mvc.Results._
import play.api.routing.Router
import play.filters.headers.SecurityHeadersFilter._
import play.filters.headers.SecurityHeadersConfig

import scala.concurrent._

class OtaPlusErrorHandler @Inject() (
                               env: Environment,
                               config: Configuration,
                               sourceMapper: OptionalSourceMapper,
                               router: Provider[Router],
                               securityHeadersConfig: SecurityHeadersConfig
                             ) extends DefaultHttpErrorHandler(env, config, sourceMapper, router) {

  override def onServerError(request: RequestHeader, exception: Throwable): Future[Result] = {
    val handler: PartialFunction[Throwable, Result] = {
      case RemoteApiError(result, _, _) =>
        result
      case RemoteApiIOError(cause) =>
        BadGateway(cause.getMessage)
      case RemoteApiParseError(e) =>
        BadGateway(e)
    }

    if (handler.isDefinedAt(exception)) { Future.successful(handler(exception)) }
    else { super.onServerError(request, exception) }
  }

  // client errors don't go through filters, add security headers here
  override def onClientError(request: RequestHeader, statusCode: Int, message: String): Future[Result] = {
    import scala.concurrent.ExecutionContext.Implicits.global

    // same as the ones from SecurityHeadersFilter
    val securityHeaders = Seq(
      securityHeadersConfig.frameOptions.map(X_FRAME_OPTIONS_HEADER -> _),
      securityHeadersConfig.xssProtection.map(X_XSS_PROTECTION_HEADER -> _),
      securityHeadersConfig.contentTypeOptions.map(X_CONTENT_TYPE_OPTIONS_HEADER -> _),
      securityHeadersConfig.permittedCrossDomainPolicies.map(X_PERMITTED_CROSS_DOMAIN_POLICIES_HEADER -> _),
      securityHeadersConfig.contentSecurityPolicy.map(CONTENT_SECURITY_POLICY_HEADER -> _)
    ).flatten

    super.onClientError(request, statusCode, message).map(_.withHeaders(securityHeaders: _*))
  }
}
