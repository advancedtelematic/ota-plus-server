/**
 * Copyright: Copyright (C) 2015, Jaguar Land Rover
 * License: MPL-2.0
 */

package com.advancedtelematic.controllers

import akka.stream.scaladsl.Source
import akka.util.ByteString
import brave.play.implicits.ZipkinTraceImplicits
import brave.play.{TraceWSClient, ZipkinTraceServiceLike}
import com.advancedtelematic.api.{ApiVersion, OtaApiUri, OtaPlusConfig}
import com.advancedtelematic.auth.{AccessTokenBuilder, AuthorizedSessionRequest, OAuthConfig, PlainAction, UiAuthAction}
import javax.inject.{Inject, Singleton}
import play.api.i18n.I18nSupport
import play.api.libs.streams.Accumulator
import play.api.libs.ws._
import play.api.mvc._
import play.filters.csrf.CSRF
import play.api.Configuration

import scala.concurrent.Future
import com.advancedtelematic.controllers.Data.OmnitureSource

final case class UiToggles(
  atsGarageTheme: Boolean,
  autoFeatureActivation: Boolean,
  credentialsDownload: Boolean,
  userProfileEdit: Boolean,
  userProfileMenu: Boolean)

object UiToggles {
  def apply(configuration: Configuration): UiToggles = {
    val atsGarageTheme = configuration.get[Boolean]("ui.toggle.atsGarageTheme")
    val autoFeatureActivation = configuration.get[Boolean]("ui.toggle.autoFeatureActivation")
    val credentialsDownload = configuration.get[Boolean]("ui.toggle.credentialsDownload")
    val userProfileEdit = configuration.get[Boolean]("ui.toggle.userProfileEdit")
    val userProfileMenu = configuration.get[Boolean]("ui.toggle.userProfileMenu")
    UiToggles(
      atsGarageTheme,
      autoFeatureActivation,
      credentialsDownload,
      userProfileEdit,
      userProfileMenu)
  }
}

/**
 * The main application controller. Handles authentication and request proxying.
 *
 */
@Singleton
class Application @Inject() (ws: TraceWSClient,
                             val tracer: ZipkinTraceServiceLike,
                             components: ControllerComponents,
                             val conf: Configuration,
                             uiAuth: UiAuthAction,
                             val apiAuth: PlainAction,
                             tokenBuilder: AccessTokenBuilder)
  extends AbstractController(components) with I18nSupport with OtaPlusConfig with ZipkinTraceImplicits {

  import ApiVersion.ApiVersion

  implicit val ec = components.executionContext

  private[this] val oauthConfig = OAuthConfig(conf)
  private[this] val uiToggles = UiToggles(conf)
  private[this] val omnitureSource = OmnitureSource(conf)
  private[this] val wsScheme = conf.underlying.getString("ws.scheme")
  private[this] val wsHost = conf.underlying.getString("ws.host")
  private[this] val wsPort = conf.underlying.getString("ws.port")
  private[this] val wsPath = conf.underlying.getString("ws.path")

  /**
   * Returns the uri of the service to proxy to.
   * Note: core knows nothing about Filters and Components.
   *
   * @param path The path of the request
   * @return The service to proxy to
   */
  private def apiByPath(version: ApiVersion, path: String) : Option[OtaApiUri] = {
    val pathComponents = path.split("/").toList

    val proxiedPrefixes =
      deviceRegistryProxiedPrefixes orElse
      auditorProxiedPrefixes orElse
      directorProxiedPrefixes orElse
      repoProxiedPrefixes orElse
      campaignerProxiedPrefixes

    proxiedPrefixes.lift((version, pathComponents))
  }

  type Dispatcher = PartialFunction[(ApiVersion, List[String]), OtaApiUri]

  private val auditorProxiedPrefixes: Dispatcher = {
    case (_, "auditor" :: "devices_seen_in" :: _) => auditorApiUri
    case (_, "auditor" :: "update_reports" :: _) => auditorApiUri
  }

  private val directorProxiedPrefixes: Dispatcher = {
    case (_, "multi_target_updates" :: _) => directorApiUri
    case (_, "admin" :: _) => directorApiUri
    case (_, "assignments" :: _) => directorApiUri
  }

  private val deviceRegistryProxiedPrefixes: Dispatcher = {
    case (_, "devices" :: _) => devicesApiUri
    case (_, "device_groups" :: _) => devicesApiUri
    case (_, "device_count" :: _) => devicesApiUri
    case (_, "device_tags" :: _) => devicesApiUri
    case (_, "active_device_count" :: _) => devicesApiUri
    case (_, "device_packages" :: _) => devicesApiUri
    case (_, "package_lists" :: _) => devicesApiUri
  }

  private val repoProxiedPrefixes: Dispatcher = {
    case (_, "user_repo" :: _) => repoApiUri
  }

  private val campaignerProxiedPrefixes: Dispatcher = {
    case (ApiVersion.v2, "campaigns" :: _) => campaignerApiUri
    case (ApiVersion.v2, "cancel_device_update_campaign" :: _) => campaignerApiUri
    case (ApiVersion.v2, "device" :: _) => campaignerApiUri
    case (ApiVersion.v2, "updates" :: _) => campaignerApiUri
  }
  val allowedHeaders = Seq("content-type")


  val bodySource = BodyParser { _ =>
    Accumulator.source[ByteString].map(Right.apply)
  }
  /**
   * Proxies the request to the given service
   *
   * @param apiUri Uri of the service to proxy to
   * @param req request to proxy
   * @return The proxied request
   */
  private def proxyTo(apiUri: OtaApiUri)
                     (implicit req: AuthorizedSessionRequest[Source[ByteString, _]]) : Future[Result] = {
    val allowedHeaders = Seq("content-type")
    def passHeaders(hdrs: Headers) =
      hdrs.toSimpleMap
        .filter(h => allowedHeaders.contains(h._1.toLowerCase)) + ("x-ats-namespace" -> req.namespace.get)

    val wreq = ws.url(apiUri.serviceName, apiUri.uri + req.path)
      .withFollowRedirects(false)
      .withMethod(req.method)
      .withQueryStringParameters(req.queryString.toArray.flatMap{ case (nm, xs) => xs.map(nm -> _) } :_*)
      .addHttpHeaders(passHeaders(req.headers).toSeq :_*)
      .addHttpHeaders(("Authorization", "Bearer " + req.accessToken.value))
      .withBody(req.body)

    wreq.stream().map { resp =>
      val rStatus = resp.status
      val rHeaders = resp.headers
        .filterNot { case(k, v) => k == "Content-Length" }
        .mapValues(_.head)

      Result(
        header = ResponseHeader(rStatus, rHeaders),
        body = play.api.http.HttpEntity.Streamed(resp.bodyAsSource, contentLength = None, contentType = None)
      )
    }
  }

  /**
   * Controller method delegating to the Core and to the Resolver APIs.
   *
   * @param path Path of the request
   * @return
   */
  def apiProxy(version: ApiVersion, path: String): Action[Source[ByteString, _]] =
    apiAuth.async(bodySource) { implicit req =>
      apiByPath(version, path) match {
        case Some(p) => proxyTo(p)
        case None => Future.successful(NotFound("Could not proxy request to requested path"))
      }
    }

  /**
   * Renders index.html
   *
   * @return OK response and index html
   */
  def index : Action[AnyContent] = uiAuth { implicit req =>
    val subject = req.idToken.userId.id
    val token = tokenBuilder.mkToken(subject, req.accessToken.expiresAt, Set(s"namespace.${req.namespace.get}"))
    val wsUrl = s"$wsScheme://bearer:${token.value}@$wsHost:$wsPort$wsPath"
    Ok(views.html.main(oauthConfig, CSRF.getToken, wsUrl, uiToggles, omnitureSource))
  }
}
