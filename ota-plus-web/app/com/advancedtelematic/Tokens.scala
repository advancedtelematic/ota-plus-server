package com.advancedtelematic

import cats.data.Xor
import com.advancedtelematic.jws.CompactSerialization
import com.advancedtelematic.controllers.UserId
import play.api.libs.json.Json

sealed abstract case class IdToken(value: String, userId: UserId, email: String)

object IdToken {
  def fromTokenValue(tokenValue: String): Xor[String, IdToken] = {
    import JsResultSyntax._
    for {
      cs    <- CompactSerialization.parse(tokenValue)
      json = Json.parse(cs.encodedPayload.stringData())
      id<- (json \ "sub").validate[String].toXor.map(UserId.apply)
      email <- (json \ "email").validate[String].toXor
    } yield new IdToken(tokenValue, id, email) {}
  }
}

final case class Auth0AccessToken(value: String)  extends AnyVal
final case class AuthPlusAccessToken(value: String)  extends AnyVal
final case class JwtAssertion(value: String) extends AnyVal
