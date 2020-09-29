package com.advancedtelematic.auth

import java.time.Instant
import java.util.UUID
import javax.crypto.spec.SecretKeySpec
import javax.inject.{Inject, Singleton}

import org.jose4j.base64url.Base64
import org.jose4j.jws.{AlgorithmIdentifiers, JsonWebSignature}
import play.api.Configuration
import play.api.libs.json.Json

@Singleton
class AccessTokenBuilder @Inject() (conf: Configuration) {

  private[this] val secret = {
    val encodedKey = conf.get[String]("oauth.token")
    new SecretKeySpec( Base64.decode(encodedKey), "HMAC" )
  }

  def mkToken(subject: String, expiresAt: Instant, scope: Set[String]): AccessToken = {
    val claims = Json.obj(
      "iss" -> "https://auth-plus.advancedtelematic.com",
      "jti" -> UUID.randomUUID().toString,
      "sub" -> subject,
      // web-events is not actually validating this, as long as it is a UUID.
      "client_id" -> "00000000-0000-0000-0000-000000000000",
      "iat" -> Instant.now().getEpochSecond,
      "exp" -> expiresAt.getEpochSecond,
      "scope" -> scope.mkString(" "),
      "aud" -> Json.arr("ota-plus")
    )

    val signer = new JsonWebSignature()
    signer.setAlgorithmHeaderValue(AlgorithmIdentifiers.HMAC_SHA256)
    signer.setKey(secret)
    signer.setPayload(Json.stringify(claims))

    AccessToken(signer.getCompactSerialization, expiresAt)
  }
}
