package com.advancedtelematic.controllers

import java.time.Instant

import brave.play.implicits.ZipkinTraceImplicits
import brave.play.{TraceData, ZipkinTraceServiceLike}
import com.advancedtelematic.api.{ApiClientExec, ApiClientSupport}
import com.advancedtelematic.auth.PlainAction
import com.advancedtelematic.controllers.Data.{FeedResource, feedResourceReads, feedResourcesReads}
import com.advancedtelematic.libats.data.DataType.Namespace
import javax.inject.{Inject, Singleton}
import play.api.Configuration
import play.api.libs.json._
import play.api.libs.ws.WSClient
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}

@Singleton
class FeedController @Inject()(val conf: Configuration,
                               val ws: WSClient,
                               val clientExec: ApiClientExec,
                               implicit val tracer: ZipkinTraceServiceLike,
                               authAction: PlainAction,
                               components: ControllerComponents)(implicit exec: ExecutionContext)
  extends AbstractController(components) with ApiClientSupport with ZipkinTraceImplicits {

  private val defaultLimit = conf.get[Int]("app.homepage.recently_created.limit")

  private def fetchRemoteActivityFeed(namespace: Namespace, limit: Int)(resourceType: String)
                             (implicit traceData: TraceData): Future[Seq[FeedResource]] =
    resourceType.toLowerCase match {
      case "device" =>
        implicit val devicesReads = feedResourcesReads("device")
        deviceRegistryApi.recentDevices(namespace, limit).map(_ \ "values").map(_.as[Seq[FeedResource]])

      case "device_group" =>
        implicit val deviceGroupsReads = feedResourcesReads("device_group")
        enrichWithDeviceCount(
          deviceRegistryApi.recentDeviceGroups(namespace, limit),
          deviceRegistryApi.countDevicesInGroup(namespace, _)
        )

      case "campaign" =>
        implicit val campaignsReads = feedResourcesReads("campaign")
        enrichWithDeviceCount(
          campaignerApi.recentCampaigns(namespace, limit),
          campaignerApi.countDevicesInCampaign(namespace, _)
        )

      case "update" =>
        implicit val updatesReads = feedResourcesReads("update")
        campaignerApi.recentUpdates(namespace, limit).map(_ \ "values").map(_.as[Seq[FeedResource]])

      case "software" =>
        implicit val softwareReads = feedResourceReads("software")
        repoServerApi.fetchTargets(namespace)
          .map(_ \ "signed" \ "targets")
          .map(_.as[Map[String, JsObject]])
          .map(_.values.map(_ \ "custom").toSeq)
          .map(_.map(_.as[FeedResource]))

      case _ =>
        Future.successful(Seq())
    }

  private def enrichWithDeviceCount(rawData: => Future[JsValue],
                                    fetchCounts: String => Future[JsValue])
                                   (implicit feedResourceReads: Reads[Seq[FeedResource]]): Future[Seq[FeedResource]] =
    for {
      frs <- rawData.map(_ \ "values").map(_.as[Seq[FeedResource]])
      enriched <- Future.traverse(frs) { fr =>
        val id = (fr.resource \ "id").as[String]
        fetchCounts(id)
          .map("deviceCount" -> _)
          .map(extraField => fr.copy(resource = fr.resource + extraField))
      }
    } yield enriched

  def activityFeed(types: Option[String], limit: Option[Int]): Action[AnyContent] =
    authAction.async { implicit request =>
      val namespace = request.namespace
      val l = limit.getOrElse(defaultLimit)
      val ts = types.getOrElse("device,device_group,campaign,update,software")
      Future
        .traverse(ts.split(",").toSeq)(fetchRemoteActivityFeed(namespace, l))
        .map(_.flatten)
        .map(_.sortBy(_.createdAt)(Ordering[Instant].reverse))
        .map(_.take(l))
        .map(Json.toJson(_))
        .map(Ok(_))
    }
}
