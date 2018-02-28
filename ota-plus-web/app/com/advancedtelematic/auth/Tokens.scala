package com.advancedtelematic.auth

import java.time.Instant

import com.advancedtelematic.controllers.UserId
import com.advancedtelematic.jwk.KeyInfoCodec.toJson
import com.advancedtelematic.jws.{Base64Url, CompactSerialization}
import play.api.libs.json.{Format, JsPath, JsResult, Json, Reads}

import scala.util.{Failure, Success, Try}

final case class IdentityClaims(userId: UserId, name: String, picture: Option[String], email: String)

sealed abstract case class IdToken(value: String, userId: UserId)

final case class AccessToken(value: String, expiresAt: Instant)

object AccessToken {

  val FromTokenResponseReads: Reads[AccessToken] = {
    // format: off
    import play.api.libs.functional.syntax._
    (
      (JsPath \ "access_token").read[String] and
      (JsPath \ "expires_in").read[Long].map(x => Instant.now().plusSeconds(x))
    )(AccessToken.apply _)
    // format: on
  }
}

final case class Tokens(accessToken: AccessToken, idToken: IdToken)

final case class JwsParseError(msg: String) extends Throwable(msg)

object IdToken {

  import play.api.libs.functional.syntax._

  private[auth] implicit val subjClaimFormat = (JsPath \ "sub").format[String].inmap[UserId](UserId, _.id)


  def from(id: String, name: String, pic: String, email: String): IdToken = {
    val claims = UserId(id)

    val payload = Json.toBytes(Json.toJson(claims))

    val value =
      s"""${Base64Url("header".getBytes()).underlying}.
         |${Base64Url(payload).underlying}.
         |${Base64Url("https://sig".getBytes()).underlying}""".stripMargin

    new IdToken(value, UserId(id)) {}
  }

  def fromTokenValue(tokenValue: String): Try[IdToken] = {
    for {
      cs <- CompactSerialization
        .parse(tokenValue)
        .fold[Try[CompactSerialization]](x => Failure(JwsParseError(x)), Success(_))
      json   <- Try(Json.parse(cs.encodedPayload.stringData()))
      userId <- JsResult.toTry(json.validate[UserId](subjClaimFormat))
    } yield new IdToken(tokenValue, userId) {}
  }
}
