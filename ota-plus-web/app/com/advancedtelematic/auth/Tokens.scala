package com.advancedtelematic.auth

import java.time.Instant

import com.advancedtelematic.controllers.UserId
import com.advancedtelematic.jwk.KeyInfoCodec.toJson
import com.advancedtelematic.jws.{Base64Url, CompactSerialization}
import play.api.libs.json.{Format, JsPath, JsResult, Json, Reads}

import scala.util.{Failure, Success, Try}

final case class IdentityClaims(userId: UserId, name: String, picture: String, email: String)

sealed abstract case class IdToken(value: String, claims: IdentityClaims)

final case class AccessToken(value: String, expiresAt: Instant)

object AccessToken {

  val FromTokenResponseReads: Reads[AccessToken] = {
    // format: off
    import play.api.libs.functional.syntax._
    (
      (JsPath \ "access_token").read[String] and
        (JsPath \ "expires_in").read[Long].map(Instant.now().plusSeconds)
      )(AccessToken.apply _)
    // format: on
  }
}

final case class Tokens(accessToken: AccessToken, idToken: IdToken)

final case class JwsParseError(msg: String) extends Throwable(msg)

object IdToken {

  import play.api.libs.functional.syntax._

  private[this] implicit val UserIdFormat: Format[UserId] = implicitly[Format[String]].inmap[UserId](UserId, _.id)

  // format: off
  private[this] implicit val identityClaimsFormat: Format[IdentityClaims] = (
    (JsPath \ "sub").format[UserId] and
    (JsPath \ "name").format[String] and
    (JsPath \ "picture").format[String] and
    (JsPath \ "email").format[String]
  )(IdentityClaims.apply, unlift(IdentityClaims.unapply))
  // format: on

  def from(id: String, name: String, pic: String, email: String): IdToken = {
    val claims = IdentityClaims(UserId(id), name, pic, email)

    val payload = Json.toBytes(Json.toJson(claims))

    val value =
      s"""${Base64Url("header".getBytes()).underlying}.
         |${Base64Url(payload).underlying}.
         |${Base64Url("https://sig".getBytes()).underlying}""".stripMargin

    new IdToken(value, claims) {}
  }

  def fromTokenValue(tokenValue: String): Try[IdToken] = {
    for {
      cs <- CompactSerialization
        .parse(tokenValue)
        .fold[Try[CompactSerialization]](x => Failure(JwsParseError(x)), Success(_))
      json   <- Try(Json.parse(cs.encodedPayload.stringData()))
      claims <- JsResult.toTry(json.validate[IdentityClaims])
    } yield new IdToken(tokenValue, claims) {}
  }
}
