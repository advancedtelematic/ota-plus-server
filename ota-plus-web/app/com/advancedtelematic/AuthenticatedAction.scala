package com.advancedtelematic

import play.api.mvc._
import scala.concurrent.Future


object AuthenticatedAction extends ActionBuilder[Request] {

  def invokeBlock[A](request: Request[A], block: (Request[A]) => Future[Result]) = {
    request.session.get("id_token")
      .map( _ => block(request))
      .getOrElse( Future.successful(Results.Redirect(com.advancedtelematic.login.routes.LoginController.login())) )
  }

}

