package com.advancedtelematic.auth

import java.time.Instant

import scala.util.Try

object SessionCodecs {
  import play.api.libs.json._
  import play.api.libs.functional.syntax._

  val InstantAsSecondsSinceEpoch: Format[Instant] =
    implicitly[Format[Long]].inmap(Instant.ofEpochSecond, _.getEpochSecond)

  // format: off
  implicit val AccessTokenFormat: Format[AccessToken] = (
    (JsPath \ "access_token").format[String] and
    (JsPath \ "notAfter").format(InstantAsSecondsSinceEpoch)
  )(AccessToken.apply, unlift(AccessToken.unapply))
  // format: on

  def parseAccessToken(sessionValue: String): Try[AccessToken] = {
    Try(Json.parse(sessionValue)).flatMap(json => JsResult.toTry(json.validate[AccessToken]))
  }
}
