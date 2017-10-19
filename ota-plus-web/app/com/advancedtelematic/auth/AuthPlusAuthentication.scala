package com.advancedtelematic.auth

import play.api.Configuration
import play.shaded.ahc.org.asynchttpclient.uri.Uri

final case class AuthPlusConfig(uri: Uri, clientId: String, clientSecret: String)
object AuthPlusConfig {
  def apply(conf: Configuration): Option[AuthPlusConfig] = {
    for {
      _conf        <- conf.get[Option[Configuration]]("authplus")
      clientId     <- _conf.get[Option[String]]("client_id")
      clientSecret <- _conf.get[Option[String]]("secret")
      authPlusUri  <- _conf.get[Option[String]]("uri").map(Uri.create)
    } yield AuthPlusConfig(authPlusUri, clientId, clientSecret)
  }
}
