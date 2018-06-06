package com.advancedtelematic.auth.garage

import play.api.Configuration

final case class Auth0Config(
    audience: String,
    dbConnection: String,
    signUpUrl: String
)

object Auth0Config {
  def apply(configuration: Configuration): Auth0Config = {
    val audience = configuration.get[String]("auth0.audience")
    val dbConnection = configuration.get[String]("auth0.dbConnection")
    val signUpUrl = configuration.get[String]("auth0.signUpUrl")
    Auth0Config(audience, dbConnection, signUpUrl)
  }
}
