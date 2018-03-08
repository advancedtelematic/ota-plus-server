package com.advancedtelematic.auth

import scala.util.Try

object SessionCodecs {
  import play.api.libs.json._
  import play.api.libs.functional.syntax._

  // format: off
  implicit val AccessTokenFormat: Format[AccessToken] = (
    (JsPath \ "access_token").format[String] and
    (JsPath \ "notAfter").format(AccessTokenClaims.InstantAsSecondsSinceEpoch)
  )(AccessToken.apply, unlift(AccessToken.unapply))
  // format: on

  def parseAccessToken(sessionValue: String): Try[AccessToken] = {
    Try(Json.parse(sessionValue)).flatMap(json => JsResult.toTry(json.validate[AccessToken]))
  }
}
