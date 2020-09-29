package com.advancedtelematic.auth

import play.api.Configuration

final case class OAuthConfig(secret: String,
                             clientId: String,
                             callbackURL: String,
                             parameters: Map[String, String])

object OAuthConfig {
  def apply(configuration: Configuration): OAuthConfig = {
    val clientSecret = configuration.get[String]("oauth.clientSecret")
    val clientId     = configuration.get[String]("oauth.clientId")
    val callbackUrl  = configuration.get[String]("oauth.callbackURL")
    val parameters   = configuration.get[Map[String, String]]("oauth.authorizationParams")
    OAuthConfig(clientSecret, clientId, callbackUrl, parameters)
  }
}
