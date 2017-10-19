package com.advancedtelematic.auth

import play.api.Configuration

final case class OAuthConfig(domain: String,
                             secret: String,
                             clientId: String,
                             callbackURL: String,
                             parameters: Map[String, String])

object OAuthConfig {
  def apply(configuration: Configuration): OAuthConfig = {
    val domain       = configuration.get[String]("oauth.domain")
    val clientSecret = configuration.get[String]("oauth.clientSecret")
    val clientId     = configuration.get[String]("oauth.clientId")
    val callbackUrl  = configuration.get[String]("oauth.callbackURL")
    val parameters   = configuration.get[Map[String, String]]("oauth.authorizationParams")
    OAuthConfig(domain, clientSecret, clientId, callbackUrl, parameters)
  }
}
