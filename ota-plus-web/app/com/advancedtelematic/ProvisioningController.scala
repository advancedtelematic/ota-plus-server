package com.advancedtelematic

import javax.inject.{ Inject, Singleton }

import com.advancedtelematic.api.{ ApiClientExec, CryptApi }
import play.api.Configuration
import play.api.libs.json.Json
import play.api.libs.ws.WSClient
import play.api.mvc.{ Action, AnyContent, Controller }

import scala.concurrent.ExecutionContext

@Singleton
class ProvisioningController @Inject()(config: Configuration, wsClient: WSClient)(
    implicit executionContext: ExecutionContext)
    extends Controller {
  val cryptApi = new CryptApi(config, new ApiClientExec(wsClient))

  def accountName(request: AuthenticatedRequest[_]): String = request.idToken.userId.id

  val provisioningStatus: Action[AnyContent] = AuthenticatedAction.async { implicit request =>
    cryptApi.getAccountInfo(accountName(request)).map(x => Ok(Json.obj("active" -> x.isDefined)))
  }

  val activateAutoProvisioning: Action[AnyContent] = AuthenticatedAction.async { implicit request =>
    cryptApi.registerAccount(accountName(request)).map(x => Ok(Json.toJson(x)))
  }

  val provisioningInfo: Action[AnyContent] = AuthenticatedAction.async { implicit request =>
    cryptApi.getAccountInfo(accountName(request)).map {
      case Some(x) => Ok(Json.toJson(x))
      case None    => NotFound
    }
  }

}
