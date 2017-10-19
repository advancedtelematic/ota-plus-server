package com.advancedtelematic.auth.garage

import play.api.Configuration

private[garage] final case class Auth0Config(
    audience: String,
    dbConnection: String
)

object Auth0Config {
  def apply(configuration: Configuration): Auth0Config = {
    val audience = configuration.get[String]("auth0.audience")
    val dbConnection = configuration.get[String]("auth0.dbConnection")
    Auth0Config(audience, dbConnection)
  }
}
