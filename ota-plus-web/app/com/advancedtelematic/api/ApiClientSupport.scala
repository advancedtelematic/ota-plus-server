package com.advancedtelematic.api

import com.advancedtelematic.auth.garage.Auth0Api
import play.api.Configuration
import play.api.libs.ws.WSClient

trait ApiClientSupport {
  val ws: WSClient
  val conf: Configuration
  val clientExec: ApiClientExec

  val authPlusApi = new AuthPlusApi(conf, clientExec)

  val auth0Api = new Auth0Api(conf, clientExec)

  val buildSrvApi = new BuildSrvApi(conf, clientExec)

  val devicesApi = new DevicesApi(conf, clientExec)

  val userProfileApi = new UserProfileApi(conf, clientExec)

}
