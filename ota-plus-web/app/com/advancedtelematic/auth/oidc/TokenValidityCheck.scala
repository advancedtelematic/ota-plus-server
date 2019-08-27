package com.advancedtelematic.auth.oidc

import com.advancedtelematic.auth.{AccessToken, TokenVerification}

import scala.concurrent.Future

class TokenValidityCheck extends TokenVerification {
  override def apply(token: AccessToken): Future[Boolean] = {
    Future.successful(true)
  }
}
