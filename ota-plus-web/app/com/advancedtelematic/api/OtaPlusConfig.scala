package com.advancedtelematic.api

import play.api.Configuration

import scala.util.control.NoStackTrace

case class ConfigurationException(msg: String = "")
  extends Exception(s"Could not get required configuration " + msg)
    with NoStackTrace

trait OtaPlusConfig {
  val conf: Configuration

  val coreApiUri = conf.underlying.getString("core.uri")

  val resolverApiUri = conf.underlying.getString("resolver.uri")

  val devicesApiUri = conf.underlying.getString("deviceregistry.uri")

  val authPlusApiUri = conf.underlying.getString("authplus.uri")

  val buildSrvApiUri = conf.underlying.getString("buildservice.uri")

  val userProfileApiUri = conf.underlying.getString("userprofile.uri")

  val auditorApiUri = conf.underlying.getString("auditor.uri")

  val directorApiUri = conf.underlying.getString("director.uri")

  val repoApiUri = conf.underlying.getString("repo.uri")

  val campaignerApiUri = conf.underlying.getString("campaigner.uri")

  val keyServerApiUri = conf.underlying.getString("keyserver.uri")
}
