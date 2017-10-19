package com.advancedtelematic.auth.oidc

import java.time.Instant

import com.advancedtelematic.auth.{AccessToken, TokenVerification}

import scala.concurrent.Future

class TokenValidityCheck extends TokenVerification {
  override def apply(token: AccessToken): Future[Boolean] = {
    Future.successful(Instant.now().isBefore(token.expiresAt))
  }
}
