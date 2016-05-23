package org.genivi.webserver.controllers

import play.api.Configuration

case object ConfigurationException extends Exception(s"Could not get required configuration")

trait OtaPlusConfig {
  val conf: Configuration

  val coreApiUri = conf.underlying.getString("core.api.uri")

  val resolverApiUri = conf.underlying.getString("resolver.api.uri")

  val authPlusApiUri = conf.underlying.getString("authplus.host")

  val deviceRegistryUri = conf.underlying.getString("device_registry.uri")
}
