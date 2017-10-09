package com.advancedtelematic.controllers

import javax.inject.Inject

import play.api.libs.json.Json
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}

class HealthController @Inject() (components: ControllerComponents) extends AbstractController(components) {

  def health(): Action[AnyContent] = Action { req =>
    Ok(Json.obj("status" -> "OK"))
  }

  def version(): Action[AnyContent] = Action { req =>
    val version = com.advancedtelematic.ota.web.BuildInfo.toMap.mapValues(_.toString)
    Ok(Json.toJson(version))
  }
}
