package com.advancedtelematic.controllers

import javax.inject.{Inject, Singleton}

import com.advancedtelematic.{AuthenticatedAction, AuthenticatedRequest}
import com.advancedtelematic.api.{ApiClientExec, CryptApi}
import java.time.{LocalDate, ZonedDateTime, ZoneOffset}
import java.time.temporal.ChronoUnit

import org.genivi.sota.data.Uuid
import play.api.Configuration
import play.api.http.{HeaderNames, HttpEntity}
import play.api.libs.json.{Json, JsValue}
import play.api.libs.ws.WSClient
import play.api.mvc.{AbstractController, Action, AnyContent, Controller, ControllerComponents, ResponseHeader, Result}

import scala.concurrent.ExecutionContext

@Singleton
class ProvisioningController @Inject()(config: Configuration, wsClient: WSClient, authAction: AuthenticatedAction,
                                       components: ControllerComponents)(
    implicit executionContext: ExecutionContext)
    extends AbstractController(components) {
  val cryptApi = new CryptApi(config, new ApiClientExec(wsClient))
  val gatewayPort = config.get[Option[Int]]("crypt.gateway.port").getOrElse(8000)

  def accountName(request: AuthenticatedRequest[_]): String = request.idToken.userId.id

  val provisioningStatus: Action[AnyContent] = authAction.async { implicit request =>
    cryptApi.getAccountInfo(accountName(request)).map(x => Ok(Json.obj("active" -> x.isDefined)))
  }

  val activateAutoProvisioning: Action[AnyContent] = authAction.async { implicit request =>
    cryptApi.registerAccount(accountName(request)).map(x => Ok(Json.toJson(x)))
  }

  val provisioningInfo: Action[AnyContent] = authAction.async { implicit request =>
    cryptApi.getAccountInfo(accountName(request)).map {
      case Some(x) => Ok(Json.obj(
        "hostName" -> x.hostName.toString,
        "uri" -> s"https://${x.hostName}:$gatewayPort",
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

  def downloadCredentials(uuid: Uuid): Action[AnyContent] = authAction.async { implicit request =>
    cryptApi.downloadCredentials(accountName(request), uuid.toJava).map { source =>
        Ok.sendEntity(HttpEntity.Streamed(source, None, Some("application/x-pkcs12")))
          .withHeaders(HeaderNames.CONTENT_DISPOSITION -> "attachment; filename=credentials.p12")
    }
  }
}
