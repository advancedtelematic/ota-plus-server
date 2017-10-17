package com.advancedtelematic.auth.oidc

import javax.inject.Inject

import com.advancedtelematic.auth.OAuthConfig
import play.api.{Configuration, Logger}
import play.api.http.Status
import play.api.mvc.{AnyContent, BodyParsers, Request, Result, Results}

import scala.concurrent.{ExecutionContext, Future}

class LoginAction @Inject()(config: Configuration, val parser: BodyParsers.Default)(
    implicit val executionContext: ExecutionContext
) extends com.advancedtelematic.auth.LoginAction {
  val log         = Logger(this.getClass)
  val oauthConfig = OAuthConfig(config)

  override def apply(request: Request[AnyContent]): Future[Result] = Future.successful(
    Results.Redirect(
      s"https://${oauthConfig.domain}/authorize",
      Map(
        "response_type" -> Seq("code"),
        "client_id"     -> Seq(oauthConfig.clientId),
        "redirect_uri"  -> Seq(oauthConfig.callbackURL),
        "scope"         -> Seq("openid profile email")
      ) ++ oauthConfig.parameters.mapValues(Seq(_)),
      Status.SEE_OTHER
    )
  )
}
