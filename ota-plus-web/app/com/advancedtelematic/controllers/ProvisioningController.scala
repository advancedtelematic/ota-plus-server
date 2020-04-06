package com.advancedtelematic.controllers

import java.time.temporal.ChronoUnit
import java.time.{LocalDate, ZoneOffset, ZonedDateTime}
import java.util.UUID

import brave.play.ZipkinTraceServiceLike
import brave.play.implicits.ZipkinTraceImplicits
import com.advancedtelematic.api._
import com.advancedtelematic.api.clients.{CryptApi, KeyServerApi, RepoServerApi}
import com.advancedtelematic.auth.{ApiAuthAction, AuthorizedRequest}
import com.advancedtelematic.controllers.PathBinders.segment
import javax.inject.{Inject, Singleton}
import play.api.Configuration
import play.api.http.{HeaderNames, HttpEntity}
import play.api.libs.json.{JsValue, Json}
import play.api.mvc._

import scala.concurrent.ExecutionContext

@Singleton
class ProvisioningController @Inject()(val conf: Configuration,
                                       val authAction: ApiAuthAction,
                                       val clientExec: ApiClientExec,
                                       implicit val tracer: ZipkinTraceServiceLike,
                                       components: ControllerComponents)
                                      (implicit executionContext: ExecutionContext)
    extends AbstractController(components) with OtaPlusConfig with ApiClientSupport with ZipkinTraceImplicits {

  val cryptApi = new CryptApi(conf, clientExec)
  val reposerverApi = new RepoServerApi(conf, clientExec)
  val keyserverApi = new KeyServerApi(conf, clientExec)

  def accountName(request: AuthorizedRequest[_]): String = segment(request.namespace.get)

  val provisioningStatus: Action[AnyContent] = authAction.async { implicit request =>
    cryptApi.getAccountInfo(accountName(request)).map(x => Ok(Json.obj("active" -> x.isDefined)))
  }

  val activateAutoProvisioning: Action[AnyContent] = authAction.async { implicit request =>
    cryptApi.registerAccount(accountName(request)).map(x => Ok(Json.toJson(x)))
  }

  val provisioningInfo: Action[AnyContent] = authAction.async { implicit request =>
    import com.advancedtelematic.api.clients.CryptAccountInfo._
    cryptApi.getAccountInfo(accountName(request)).map {
      case Some(x) => Ok(Json.obj(
        "hostName" -> x.hostName,
        "uri" -> cryptApi.getAccountGatewayUri(x),
        "subject" -> x.name))
      case None    => NotFound
    }
  }

  val getCredentials: Action[AnyContent] = authAction.async { implicit request =>
    cryptApi.getCredentials(accountName(request)).map {
      case Some(x) => Ok(Json.toJson(x))
      case None    => NotFound
    }
  }

  val credentialsRegistration: Action[JsValue] =
    authAction.async(parse.json) { implicit request =>
      val description = (request.body \ "description").as[String]
      val until = (request.body \ "until").as[LocalDate]
      val now = ZonedDateTime.now(ZoneOffset.UTC)

      // until is is inclusive so we plus 1 day
      val untilDate = until.plusDays(1).atStartOfDay(ZoneOffset.UTC)
      val ttl = ChronoUnit.HOURS.between(now, untilDate) + 1 // between gives us how many whole hours fit
                                                             // we add one more to guarantee to reach untilDate

      cryptApi.credentialsRegistration(accountName(request), description, ttl).map(x =>
        Ok(Json.toJson(x))
      )
    }

  def downloadCredentials(uuid: UUID): Action[AnyContent] = authAction.async { implicit request =>
    cryptApi.downloadCredentials(accountName(request), uuid).map { entity =>
        Ok.sendEntity(HttpEntity.Streamed(entity.dataStream, None, Some("application/x-pkcs12")))
          .withHeaders(HeaderNames.CONTENT_DISPOSITION -> "attachment; filename=credentials.p12")
    }
  }

  def keysStatus: Action[AnyContent] = authAction.async { implicit request =>
    for {
      repoId <- reposerverApi.fetchRepoId(request.namespace)
      online <- keyserverApi.areKeysOnline(repoId)
    } yield Ok(Json.obj("keys-online" -> online))
  }

}
