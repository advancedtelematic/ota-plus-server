package com.advancedtelematic.web_events.http

import akka.actor.ActorSystem
import akka.http.scaladsl.server.{Directives, _}
import akka.stream.ActorMaterializer
import com.advancedtelematic.web_events.daemon.EventBusActorListener
import com.advancedtelematic.web_events.VersionInfo
import com.advancedtelematic.libats.http.{ErrorHandler, HealthResource}
import com.advancedtelematic.libats.http.DefaultRejectionHandler.rejectionHandler

import scala.concurrent.ExecutionContext


class WebEventsRoutes()
                     (implicit val system: ActorSystem, ec: ExecutionContext, mat: ActorMaterializer) extends VersionInfo {

  import Directives._

  val messageBusProvider = new EventBusActorListener

  val routes: Route =
    handleRejections(rejectionHandler) {
      ErrorHandler.handleErrors {
        pathPrefix("api" / "v1") {
          new WebSocketResource(messageBusProvider).route
        } ~ new HealthResource(Seq.empty, versionMap).route
      }
    }
}
