package com.advancedtelematic.api

import brave.play.ZipkinTraceServiceLike
import com.advancedtelematic.api.clients._
import com.advancedtelematic.auth.garage.Auth0Api
import play.api.Configuration

trait ApiClientSupport {
  val conf: Configuration
  val clientExec: ApiClientExec
  val tracer: ZipkinTraceServiceLike

  private implicit val _tracer = tracer

  val authPlusApi = new AuthPlusApi(conf, clientExec)

  val auth0Api = new Auth0Api(conf, clientExec)

  val userProfileApi = new UserProfileApi(conf, clientExec)

  val deviceRegistryApi = new DeviceRegistryApi(conf, clientExec)

  val directorApi = new DirectorApi(conf, clientExec)

  val campaignerApi = new CampaignerApi(conf, clientExec)

  val repoServerApi = new RepoServerApi(conf, clientExec)

  val keyServerApi = new KeyServerApi(conf, clientExec)

}
