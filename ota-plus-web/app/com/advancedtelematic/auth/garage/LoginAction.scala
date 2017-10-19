package com.advancedtelematic.auth.garage

import javax.inject.Inject

import com.advancedtelematic.auth.OAuthConfig
import play.api.Configuration
import play.api.mvc.{AnyContent, BodyParsers, Request, Result, Results}

import scala.concurrent.{ExecutionContext, Future}

class LoginAction @Inject()(conf: Configuration,
                            val parser: BodyParsers.Default,
                            val executionContext: ExecutionContext)
    extends com.advancedtelematic.auth.LoginAction {

  private[this] val oauthConfig = OAuthConfig(conf)
  override def apply(request: Request[AnyContent]): Future[Result] = {
    Future.successful(Results.Ok(views.html.login(oauthConfig)))
  }

}
