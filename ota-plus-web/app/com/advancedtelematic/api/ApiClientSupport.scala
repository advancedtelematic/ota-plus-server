package com.advancedtelematic.api

import play.api.Configuration
import play.api.libs.ws.WSClient

trait ApiClientSupport {
  val ws: WSClient
  val conf: Configuration
  val clientExec: ApiClientExec

  val coreApi = new CoreApi(conf, clientExec)

  val authPlusApi = new AuthPlusApi(conf, clientExec)

  val devicesApi = new DevicesApi(conf, clientExec)
}
