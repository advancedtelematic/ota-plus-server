/**
 * Copyright: Copyright (C) 2015, Jaguar Land Rover
 * License: MPL-2.0
 */

package org.genivi.webserver.controllers

import com.advancedtelematic.login.Auth0Config
import javax.inject.{Inject, Named, Singleton}

import com.advancedtelematic.ota.vehicle.Vehicles
import com.advancedtelematic.{AuthenticatedAction, AuthenticatedApiAction, AuthenticatedRequest}
import org.slf4j.LoggerFactory
import play.api._
import play.api.http.HttpEntity
import play.api.i18n.{I18nSupport, MessagesApi}
import play.api.libs.ws._
import play.api.mvc._

import scala.concurrent.Future

/**
 * The main application controller. Handles authentication and request proxying.
 *
 */
@Singleton
class Application @Inject() (ws: WSClient,
                             val messagesApi: MessagesApi,
                             val conf: Configuration,
                             @Named("vehicles-store") vehiclesStore: Vehicles)
  extends Controller with I18nSupport with OtaPlusConfig {

  val auditLogger = LoggerFactory.getLogger("audit")

  private[this] val auth0Config = Auth0Config(conf).get

  private def logToAudit(caller: String, msg: String) {
    // Useful to debug instances running in the cloud.
    auditLogger.info(s"[Application.$caller()] $msg")
  }

  implicit val context = play.api.libs.concurrent.Execution.Implicits.defaultContext

  /**
   * Returns the uri of the service to proxy to.
   * Note: core knows nothing about Filters and Components.
   *
   * @param path The path of the request
   * @return The service to proxy to
   */
  private def apiByPath(path: String) : Option[String] = {
    val pathComponents = path.split("/").toList

    val proxiedPrefixes = coreProxiedPrefixes orElse resolverProxiedPrefixes

    proxiedPrefixes.lift(pathComponents)
  }

  private val coreProxiedPrefixes: PartialFunction[List[String], String] = {
    case "packages" :: _ => coreApiUri
    case "device_updates" :: _ => coreApiUri
    case "vehicle_updates" :: _ => coreApiUri
    case "update_requests" :: _ => coreApiUri
    case "history" :: _ => coreApiUri
    case "blacklist" :: _ => coreApiUri
  }

  private val resolverProxiedPrefixes: PartialFunction[List[String], String] = {
    case "resolver" :: _ => resolverApiUri
    case "firmware" :: _ => resolverApiUri
    case "filters" :: _ => resolverApiUri
    case "components" :: _ => resolverApiUri
    case "resolve" :: _ => resolverApiUri
    case "package_filters" :: _ => resolverApiUri
  }

  /**
   * Proxies the request to the given service
   *
   * @param apiUri Uri of the service to proxy to
   * @param req request to proxy
   * @return The proxied request
   */
  private def proxyTo(apiUri: String, req: AuthenticatedRequest[RawBuffer]) : Future[Result] = {
    def toWsHeaders(hdrs0: Headers): Map[String, String] = {
      // destination for the outgoing request, including port
      val dest = {
        val destURI = java.net.URI.create(apiUri)
        val portIfAny = if (destURI.getPort == -1) "" else s":${destURI.getPort}"
        destURI.getHost + portIfAny
      }
      val hdrs1 = hdrs0.remove("Host").add("Host" -> dest)
      hdrs1.toMap.map {
        case(name, values) => name -> values.head
      }
    }

    val w = ws.url(apiUri + req.path)
      .withFollowRedirects(false)
      .withMethod(req.method)
      .withQueryString(req.queryString.mapValues(_.head).toSeq :_*)
      .withHeaders(toWsHeaders(req.headers).toSeq :_*)
      .withHeaders(("Authorization", "Bearer " + req.idToken.value))
      // TODO: Switch back to access_token after https://advancedtelematic.atlassian.net/browse/PRO-858

    val wreq = req.body.asBytes() match {
      case Some(b) => w.withBody(b)
      case None => w.withBody(FileBody(req.body.asFile))
    }

    wreq.stream().map { resp =>
      val rStatus = resp.headers.status
      val rHeaders = resp.headers
        .headers
        .filterNot { case(k, v) => k == "Content-Length" }
        .mapValues(_.head)

      Result(
        header = ResponseHeader(rStatus, rHeaders),
        body = play.api.http.HttpEntity.Streamed(resp.body, contentLength = None, contentType = None)
      )
    }
  }

  /**
   * Controller method delegating to the Core and to the Resolver APIs.
   *
   * @param path Path of the request
   * @return
   */
  def apiProxy(path: String) : Action[RawBuffer] = AuthenticatedApiAction.async(parse.raw) { req =>
    apiByPath(path) match {
      case Some(p) => proxyTo(p, req)
      case None => Future.successful(NotFound("Could not proxy request to requested path"))
    }
  }

  /**
   * Renders index.html
   *
   * @return OK response and index html
   */
  def index : Action[AnyContent] = AuthenticatedAction { implicit req =>
    Ok(views.html.main(auth0Config))
  }
}
