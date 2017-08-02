/**
 * Copyright: Copyright (C) 2015, Jaguar Land Rover
 * License: MPL-2.0
 */

package com.advancedtelematic.controllers

import javax.inject.{Inject, Named, Singleton}

import com.advancedtelematic.api.ApiVersion
import com.advancedtelematic.api.OtaPlusConfig
import com.advancedtelematic.{AuthenticatedAction, AuthenticatedRequest, AuthPlusAuthentication}
import org.slf4j.LoggerFactory
import play.api._
import play.api.http.HttpEntity
import play.api.i18n.{I18nSupport, MessagesApi}
import play.api.libs.ws._
import play.api.mvc._
import play.filters.csrf.CSRF

import scala.concurrent.Future

/**
 * The main application controller. Handles authentication and request proxying.
 *
 */
@Singleton
class Application @Inject() (ws: WSClient,
                             val messagesApi: MessagesApi,
                             val conf: Configuration,
                             val authAction: AuthPlusAuthentication)
  extends Controller with I18nSupport with OtaPlusConfig {

  import ApiVersion.ApiVersion

  val auditLogger = LoggerFactory.getLogger("audit")

  private[this] val auth0Config = Auth0Config(conf).get
  private[this] val wsScheme = conf.underlying.getString("ws.scheme")
  private[this] val wsHost = conf.underlying.getString("ws.host")
  private[this] val wsPort = conf.underlying.getString("ws.port")
  private[this] val wsPath = conf.underlying.getString("ws.path")

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
  private def apiByPath(version: ApiVersion, path: String) : Option[String] = {
    val pathComponents = path.split("/").toList

    val proxiedPrefixes = coreProxiedPrefixes orElse
      deviceRegistryProxiedPrefixes orElse
      resolverProxiedPrefixes orElse
      auditorProxiedPrefixes orElse
      directorProxiedPrefixes orElse
      repoProxiedPrefixes orElse
      campaignerProxiedPrefixes

    proxiedPrefixes.lift((version, pathComponents))
  }

  type Dispatcher = PartialFunction[(ApiVersion, List[String]), String]

  private val auditorProxiedPrefixes: Dispatcher = {
    case (_, "auditor" :: "devices_seen_in" :: _) => auditorApiUri
    case (_, "auditor" :: "update_reports" :: _) => auditorApiUri
  }

  private val directorProxiedPrefixes: Dispatcher = {
    case (_, "multi_target_updates" :: _) => directorApiUri
    case (_, "admin" :: _) => directorApiUri
  }

  private val coreProxiedPrefixes: Dispatcher = {
    case (_, "packages" :: _) => coreApiUri
    case (_, "devices_info" :: _) => coreApiUri
    case (_, "device_updates" :: _) => coreApiUri
    case (_, "vehicle_updates" :: _) => coreApiUri
    case (_, "update_requests" :: _) => coreApiUri
    case (_, "history" :: _) => coreApiUri
    case (_, "blacklist" :: _) => coreApiUri
    case (_, "impact" :: _) => coreApiUri
    case (ApiVersion.v1, "campaigns" :: _) => coreApiUri
    case (_, "auto_install" :: _) => coreApiUri
  }

  private val deviceRegistryProxiedPrefixes: Dispatcher = {
    case (_, "devices" :: _) => devicesApiUri
    case (_, "device_groups" :: _) => devicesApiUri
    case (_, "device_count" :: _) => devicesApiUri
    case (_, "active_device_count" :: _) => devicesApiUri
    case (_, "device_packages" :: _) => devicesApiUri
  }

  private val resolverProxiedPrefixes: Dispatcher = {
    case (_, "resolver" :: _) => resolverApiUri
    case (_, "firmware" :: _) => resolverApiUri
    case (_, "filters" :: _) => resolverApiUri
    case (_, "components" :: _) => resolverApiUri
    case (_, "resolve" :: _) => resolverApiUri
    case (_, "package_filters" :: _) => resolverApiUri
  }

  private val repoProxiedPrefixes: Dispatcher = {
    case (_, "user_repo" :: _) => repoApiUri
  }

  private val campaignerProxiedPrefixes: Dispatcher = {
    case (ApiVersion.v2, "campaigns" :: _) => campaignerApiUri
  }

  /**
   * Proxies the request to the given service
   *
   * @param apiUri Uri of the service to proxy to
   * @param req request to proxy
   * @return The proxied request
   */
  private def proxyTo(apiUri: String, req: AuthenticatedRequest[RawBuffer]) : Future[Result] = {

    val allowedHeaders = Seq("content-type", "x-ats-traceid")
    def passHeaders(hdrs: Headers) = hdrs.toSimpleMap.filter(h => allowedHeaders.contains(h._1.toLowerCase)) +
          ("x-ats-namespace" -> req.namespace.get)

    val w = ws.url(apiUri + req.path)
      .withFollowRedirects(false)
      .withMethod(req.method)
      .withQueryString(req.queryString.mapValues(_.head).toSeq :_*)
      .withHeaders(passHeaders(req.headers).toSeq :_*)
      .withHeaders(("Authorization", "Bearer " + req.authPlusAccessToken.value))

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
  def apiProxy(version: ApiVersion, path: String): Action[RawBuffer] =
    authAction.AuthenticatedApiAction.async(parse.raw) { req =>
      apiByPath(version, path) match {
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
    val wsUrl = s"$wsScheme://bearer:${req.authPlusAccessToken.value}@$wsHost:$wsPort$wsPath"
    Ok(views.html.main(auth0Config, CSRF.getToken, wsUrl))
  }
}
