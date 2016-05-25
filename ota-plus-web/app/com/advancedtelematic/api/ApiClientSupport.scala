package com.advancedtelematic.api

import play.api.Configuration
import play.api.libs.ws.WSClient

trait ApiClientSupport {
  val ws: WSClient
  val conf: Configuration
  val clientExec: ApiClientExec

  val coreApi = new CoreApi(conf, ws, clientExec)

  val resolverApi = new ResolverApi(conf, ws, clientExec)

  val authPlusApi = new AuthPlusApi(conf, ws, clientExec)

  val deviceApi = new DeviceRegistryApi(conf, ws, clientExec)
}
