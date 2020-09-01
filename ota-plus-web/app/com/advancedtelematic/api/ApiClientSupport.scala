package com.advancedtelematic.api

import brave.play.ZipkinTraceServiceLike
import com.advancedtelematic.api.clients._
import play.api.Configuration

trait ApiClientSupport {
  val conf: Configuration
  val clientExec: ApiClientExec
  val tracer: ZipkinTraceServiceLike

  private implicit val _tracer = tracer

  val userProfileApi = new UserProfileApi(conf, clientExec)

  val deviceRegistryApi = new DeviceRegistryApi(conf, clientExec)

  val directorApi = new DirectorApi(conf, clientExec)

  val campaignerApi = new CampaignerApi(conf, clientExec)

  val repoServerApi = new RepoServerApi(conf, clientExec)

  val keyServerApi = new KeyServerApi(conf, clientExec)

}
