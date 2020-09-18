package com.advancedtelematic.auth

import play.api.Configuration

final case class AuthPlusCredentials(clientId: String, clientSecret: String)
object AuthPlusCredentials {
  def apply(conf: Configuration): AuthPlusCredentials = {
    val c = for {
      _conf        <- conf.get[Option[Configuration]]("authplus")
      clientId     <- _conf.get[Option[String]]("client_id")
      clientSecret <- _conf.get[Option[String]]("secret")
    } yield AuthPlusCredentials(clientId, clientSecret)
    c.getOrElse(throw new IllegalStateException("Unable to load Auth+ config."))
  }
}
