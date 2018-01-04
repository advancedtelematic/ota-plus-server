package com.advancedtelematic.auth

import play.api.mvc.{Action, AnyContent}

abstract class LoginAction extends Action[AnyContent]
abstract class LogoutAction extends Action[AnyContent]
