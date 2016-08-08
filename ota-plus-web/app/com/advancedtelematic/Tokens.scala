package com.advancedtelematic

final case class IdToken(value: String)      extends AnyVal
final case class Auth0AccessToken(value: String)  extends AnyVal
final case class AuthPlusAccessToken(value: String)  extends AnyVal
final case class JwtAssertion(value: String) extends AnyVal
