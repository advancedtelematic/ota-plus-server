package com.advancedtelematic.auth

import scala.concurrent.Future

trait TokenVerification extends (AccessToken => Future[Boolean])
