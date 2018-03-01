package com.advancedtelematic.auth.oidc

import javax.inject.Inject
import play.api.mvc.{AnyContent, BodyParsers, Request, Result, Results}

import scala.concurrent.{ExecutionContext, Future}

class LogoutAction @Inject()(val parser: BodyParsers.Default)(implicit val executionContext: ExecutionContext)
    extends com.advancedtelematic.auth.LogoutAction {
  override def apply(request: Request[AnyContent]): Future[Result] = {
    Future.successful(
      Results.Redirect(com.advancedtelematic.controllers.routes.LoginController.login()).withNewSession
    )
  }
}
