package com.advancedtelematic.auth.oidc

import javax.inject.Inject
import play.api.mvc.{AnyContent, BodyParsers, Request, Result}

import scala.concurrent.{ExecutionContext, Future}

class LoginAction @Inject()(oidcGateway: OidcGateway, val parser: BodyParsers.Default)(
    implicit val executionContext: ExecutionContext
) extends com.advancedtelematic.auth.LoginAction {

  override def apply(request: Request[AnyContent]): Future[Result] =
    oidcGateway.redirectToAuthorize()
}
