package com.advancedtelematic.auth.oidc

import javax.inject.Inject

import com.advancedtelematic.auth.{AccessToken, AuthPlusConfig, TokenVerification}
import play.api.{Configuration, Logger}
import play.api.libs.ws.{WSAuthScheme, WSClient}
import play.shaded.ahc.org.asynchttpclient.util.HttpConstants.ResponseStatusCodes

import scala.concurrent.{ExecutionContext, Future}

class NoTokenIntrospection @Inject()(conf: Configuration, wsClient: WSClient) extends TokenVerification {
  override def apply(v1: AccessToken): Future[Boolean] = Future.successful(true)
}

class TokenIntrospection @Inject()(conf: Configuration, wsClient: WSClient)(implicit executionContext: ExecutionContext)
    extends TokenVerification {
  private[this] val authPlusConfig = AuthPlusConfig(conf).get
  private[this] val log            = Logger(this.getClass)
  override def apply(accessToken: AccessToken): Future[Boolean] = {
    wsClient
      .url(s"${authPlusConfig.uri}/introspect")
      .withAuth(authPlusConfig.clientId, authPlusConfig.clientSecret, WSAuthScheme.BASIC)
      .post(Map("token" -> Seq(accessToken.value)))
      .map { resp =>
        resp.status match {
          case ResponseStatusCodes.OK_200 =>
            (resp.json \ "active").asOpt[Boolean].getOrElse(true)
          case _ =>
            log.debug(s"Unexpected introspection response $resp, token is not valid")
            false
        }
      }
      .recover {
        case t =>
          log.debug("Token introspection failed", t)
          true
      }
  }
}
