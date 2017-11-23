package com.advancedtelematic.auth.garage

import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.UUID
import javax.crypto.SecretKey
import javax.crypto.spec.SecretKeySpec

import com.advancedtelematic.jwa.HS256
import org.apache.commons.codec.binary.Base64
import com.advancedtelematic.json.signature.JcaSupport._
import com.advancedtelematic.jws._
import io.circe.syntax._

import scala.language.implicitConversions
import cats.syntax.either._
import com.advancedtelematic.auth.AccessToken

object AuthPlusSignature {
  private def signKey(keyData: String) = HS256.octet(new SecretKeySpec(
    Base64.decodeBase64(
      keyData
    ),
    "HMAC"
  ): SecretKey).valueOr(throw _)

  private def sign(keyData: String, payload: JwsPayload) = HS256.withKey(payload, signKey(keyData))

  def fakeSignedToken(jwtSecret: String, namespace: String) = {
    val expires = Instant.now().plus(30, ChronoUnit.DAYS)

    val tokenMeta = io.circe.Json.obj(
      "iss" -> "https://auth-plus.advancedtelematic.com".asJson,
      "jti"       -> "ats/ota-web-nologin".asJson,
      "client_id" -> UUID.randomUUID().toString.asJson,
      "sub"       -> namespace.asJson,
      "iat"       -> Instant.now().getEpochSecond.asJson,
      "exp"       -> expires.getEpochSecond.asJson,
      "scope"     -> s"namespace.$namespace".asJson,
      "aud" -> Array(namespace).asJson
    )

    val signedTokenMeta = AuthPlusSignature.sign(jwtSecret, JwsPayload(tokenMeta))

    val compactSerialization = CompactSerialization(signedTokenMeta).value

    AccessToken(compactSerialization, expires)
  }
}
