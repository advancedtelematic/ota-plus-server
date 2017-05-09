package com.advancedtelematic.web_events.http

import akka.actor.ActorSystem
import akka.http.scaladsl.server.{Directives, _}
import akka.stream.ActorMaterializer
import com.advancedtelematic.web_events.daemon.EventBusActorListener
import com.advancedtelematic.web_events.{HealthResource, VersionInfo}
import org.genivi.sota.http.ErrorHandler
import org.genivi.sota.rest.SotaRejectionHandler._

import scala.concurrent.ExecutionContext


class WebEventsRoutes()
                     (implicit val system: ActorSystem, ec: ExecutionContext, mat: ActorMaterializer) extends VersionInfo {

  import Directives._

  val messageBusProvider = new EventBusActorListener
  val tokenValidator = Http.tokenValidator()

  val routes: Route =
    handleRejections(rejectionHandler) {
      ErrorHandler.handleErrors {
        pathPrefix("api" / "v1") {
          tokenValidator {
            new WebSocketResource(Http.authNamespace, messageBusProvider).route
          }
        } ~ new HealthResource(versionMap).route
      }
    }
}
