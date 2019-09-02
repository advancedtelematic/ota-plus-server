package com.advancedtelematic

import akka.event.Logging
import com.advancedtelematic.libats.http.logging.RequestLoggingActor
import com.google.inject.AbstractModule
import play.api.libs.concurrent.AkkaGuiceSupport

class LoggingActorModule extends AbstractModule with AkkaGuiceSupport {
  override def configure(): Unit =
    bindActor[RequestLoggingActor]("logging-actor", _ => RequestLoggingActor.props(Logging.InfoLevel))
}
