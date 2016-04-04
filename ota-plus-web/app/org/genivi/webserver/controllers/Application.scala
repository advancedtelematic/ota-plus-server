/**
 * Copyright: Copyright (C) 2015, Jaguar Land Rover
 * License: MPL-2.0
 */

package org.genivi.webserver.controllers

import javax.inject.{Inject, Named, Singleton}

import com.advancedtelematic.ota.vehicle.{ClientInfo, Vehicle, VehicleMetadata, Vehicles}
import org.slf4j.LoggerFactory
import play.api._
import play.api.http.HttpEntity
import play.api.i18n.{I18nSupport, MessagesApi}
import play.api.libs.ws._
import play.api.mvc._

import scala.concurrent.Future
import scala.util.control.NoStackTrace

/**
 * The main application controller. Handles authentication and request proxying.
 *
 */
@Singleton
class Application @Inject() (ws: WSClient,
                             val messagesApi: MessagesApi,
                             val conf: Configuration,
                             @Named("vehicles-store") vehiclesStore: Vehicles)
  extends Controller with I18nSupport {

  val auditLogger = LoggerFactory.getLogger("audit")
  private def logToAudit(caller: String, msg: String) {
    // Useful to debug instances running in the cloud.
    auditLogger.info(s"[Application.$caller()] $msg")
  }

  implicit val context = play.api.libs.concurrent.Execution.Implicits.defaultContext

  val coreApiUri = conf.getString("core.api.uri").get
  val resolverApiUri = conf.getString("resolver.api.uri").get

  /**
   * Returns an Option[String] of the uri of the service to proxy to
   *
   * @param path The path of the request
   * @return The service to proxy to
   */
  private def apiByPath(path: String) : String = path.split("/").toList match {
    case "packages" :: _ => coreApiUri
    case "updates" :: _ => coreApiUri
    case "vehicles" :: vin :: part :: _
      if (Set("queued", "history", "sync")(part)) => coreApiUri
    case _ => resolverApiUri
  }

  /**
   * Proxies the request to the given service
   *
   * @param apiUri Uri of the service to proxy to
   * @param req request to proxy
   * @return The proxied request
   */
  private def proxyTo(apiUri: String, req: Request[RawBuffer]) : Future[Result] = {
    def toWsHeaders(hdrs: Headers): Map[String, String] = {

      // PRO-188. Temporary fix: remove "Host" header, which trips the infrastructure.
      hdrs.remove("Host").toMap.map {
        case(name, values) => name -> values.head
      }
    }

    val w = ws.url(apiUri + req.path)
      .withFollowRedirects(false)
      .withMethod(req.method)
      .withQueryString(req.queryString.mapValues(_.head).toSeq :_*)
      .withHeaders(toWsHeaders(req.headers).toSeq :_*)

    val wreq = req.body.asBytes() match {
      case Some(b) => w.withBody(b)
      case None => w.withBody(FileBody(req.body.asFile))
    }
    wreq.execute.map { resp =>
      Result(
        header = ResponseHeader(resp.status, resp.allHeaders.mapValues(x => x.head)),
        body = HttpEntity.Strict(resp.bodyAsBytes, None)
      )
    }
  }

  /**
   * Controller method delegating to the Core and to the Resolver APIs,
   * provided the path does not denote the route to create or delete a VIN
   * (see [[apiProxyBroadcast]] for that).
   *
   * @param path Path of the request
   * @return
   */
  def apiProxy(path: String) : Action[RawBuffer] = Action.async(parse.raw) { implicit req =>
    proxyTo(apiByPath(path), req)
  }

  /**
   * Controller method to create (PUT) or delete (DELETE) a VIN.
   * Proxies request to both core and resolver
   *
   * @param path The path of the request
   * @return
   */
  def apiProxyBroadcast(path: String) : Action[RawBuffer] = Action.async(parse.raw) { implicit req =>
    val vinStr = path.split("/").toList.last
    import eu.timepit.refined.api.Refined
    // compile-time refinement only works with literals or constant predicates
    val vin: Vehicle.Vin = Refined.unsafeApply(vinStr) // TODO (mg) the predicate, has been checked already?

    val futAuthPlus: Future[VehicleMetadata] = (req.method) match {
      case "PUT" => getVehicleMetadata(vin)
      case "DELETE" => Future.failed(throw ???) // TODO (mg) There's no endpoint to delete a VIN in Auth+. What to do?
      case _ => Future.failed(throw ???) // TODO (mg) dedicated exception
    }

    // Must PUT "vehicles" on both core and resolver
    // TODO: Retry until both responses are success
    for {
      respCore <- proxyTo(coreApiUri, req)
      respResult <- proxyTo(resolverApiUri, req)
      vMetadata <- futAuthPlus
    } yield {
      vehiclesStore.registerVehicle(vMetadata)
      respCore
    }
  }

  private[this] object ConfigAuthPlusHostNotFound extends Throwable with NoStackTrace
  private[this] object ClientInfoUnparseable extends Throwable with NoStackTrace

  /**
    * Contact Auth+ to register for the first time the given VIN, obtaining [[VehicleMetadata]]
    */
  private def getVehicleMetadata(vin: Vehicle.Vin): Future[VehicleMetadata] = {
    conf.getString("authplus.host") match {
      case None =>
        Future.failed(ConfigAuthPlusHostNotFound)
      case Some(authplusHost) =>
        val clientUrl = authplusHost + "/clients"
        import play.api.libs.json._
        val w =
          ws.url(clientUrl).withFollowRedirects(false)
          .withMethod("POST")
          .withBody(Json.parse("{}"))

        w.execute flatMap { wresp =>
          wresp.json.asOpt[ClientInfo] match {
            case None => Future.failed(ClientInfoUnparseable)
            case Some(clientInfo) => Future.successful(VehicleMetadata(vin, clientInfo))
          }
        }
    }
  }

  /**
   * Renders index.html
   *
   * @return OK response and index html
   */
  def index : Action[AnyContent] = Action{ implicit req =>
    Ok(views.html.main())
  }

}
