package com.advancedtelematic

import play.api.libs.json.Json
import play.api.mvc.{Action, AnyContent, Controller}

class HealthController extends Controller {

  def health(): Action[AnyContent] = Action { req =>
    Ok(Json.obj("status" -> "OK"))
  }

  def version(): Action[AnyContent] = Action { req =>
    val version = com.advancedtelematic.ota.web.BuildInfo.toMap.mapValues(_.toString)
    Ok(Json.toJson(version))
  }
}
