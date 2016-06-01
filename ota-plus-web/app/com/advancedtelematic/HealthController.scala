package com.advancedtelematic

import play.api.libs.json.Json
import play.api.mvc.{Action, Controller}

class HealthController extends Controller {

  def health() = Action { req =>
    Ok(Json.obj("status" -> "OK"))
  }

  def version() = Action { req =>
    val version = com.advancedtelematic.ota.web.BuildInfo.toMap.mapValues(_.toString)
    Ok(Json.toJson(version))
  }
}
