package com.advancedtelematic.auth

import java.time.Instant

import com.advancedtelematic.controllers.UserId
import org.jose4j.base64url.{Base64, Base64Url}
import org.jose4j.jws.JsonWebSignature
import org.jose4j.jwx.CompactSerializer
import play.api.libs.json.{Format, Json, JsPath, JsResult, Reads}

import scala.util.{Failure, Success, Try}

final case class IdentityClaims(userId: UserId, name: String, picture: Option[String], email: String)

sealed abstract case class IdToken(value: String, userId: UserId)

final case class AccessToken(value: String, expiresAt: Instant)

final case class AccessTokenClaims(userId: UserId, scope: Array[String], expirationTime: Instant)

object AccessTokenClaims {
  import play.api.libs.functional.syntax._

  val InstantAsSecondsSinceEpoch: Format[Instant] =
    implicitly[Format[Long]].inmap(Instant.ofEpochSecond, _.getEpochSecond)

  val scopeClaimFormat: Reads[Array[String]] = (JsPath \ "scope").readNullable[String].map {
    case Some(scopeStr) =>
      scopeStr.split("[\\s+]")

    case None =>
      Array.empty[String]
  }

  implicit val ReadsInstance: Reads[AccessTokenClaims] =
    (
      (Tokens.subjClaimFormat: Reads[UserId]) and
      scopeClaimFormat and
      (JsPath \ "exp").read(InstantAsSecondsSinceEpoch)
    )(AccessTokenClaims.apply _)

}

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

object Tokens {
  import play.api.libs.functional.syntax._

  private[auth] val subjClaimFormat = (JsPath \ "sub").format[String].inmap[UserId](UserId, _.id)

}

final case class JwsParseError(msg: String) extends Throwable(msg)

object IdToken {

  def from(id: String, name: String, pic: String, email: String): IdToken = {
    val claims = UserId(id)

    val payload = Json.toBytes(Json.toJson(claims)(Tokens.subjClaimFormat))

    val value =
      s"""${Base64.encode("header".getBytes())}.
         |${Base64.encode(payload)}.
         |${Base64.encode("https://sig".getBytes())}""".stripMargin

    new IdToken(value, UserId(id)) {}
  }

  private[this] def readUserId(claims: String): Try[UserId] = {
    Try(Json.parse(claims)).flatMap { json =>
      JsResult.toTry(json.validate[UserId](Tokens.subjClaimFormat))
    }
  }

  def fromCompactSerialization(idToken: String): Try[IdToken] = {
    for {
      parts <- Try { CompactSerializer.deserialize(idToken) }
      payload <- if (parts.length != JsonWebSignature.COMPACT_SERIALIZATION_PARTS) {
        Failure(
          JwsParseError(
            s"""A JWS Compact Serialization must have exactly ${JsonWebSignature.COMPACT_SERIALIZATION_PARTS}
            |parts separated by period ('.') characters""".stripMargin
          )
        )
      } else {
        Success(Base64Url.decodeToUtf8String(parts(1)))
      }
      userId <- readUserId(payload)
    } yield new IdToken(idToken, userId) {}
  }

}
