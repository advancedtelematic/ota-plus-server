package org.genivi.webserver.controllers

import play.api.Configuration

import scala.util.control.NoStackTrace

case class ConfigurationException(msg: String = "")
  extends Exception(s"Could not get required configuration " + msg)
    with NoStackTrace

trait OtaPlusConfig {
  val conf: Configuration

  val coreApiUri = conf.underlying.getString("core.api.uri")

  val resolverApiUri = conf.underlying.getString("resolver.api.uri")

  val devicesApiUri = conf.underlying.getString("deviceregistry.api.uri")

  val authPlusApiUri = conf.underlying.getString("authplus.host")

  val userProfileApiUri = conf.underlying.getString("userprofile.api.uri")
}
