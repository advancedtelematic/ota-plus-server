package com.advancedtelematic.web_events.http

import akka.actor.ActorSystem
import akka.http.scaladsl.server.{Directives, _}
import akka.http.scaladsl.model.headers.{Authorization,OAuth2BearerToken}
import akka.stream.ActorMaterializer

import org.genivi.sota.http.{AuthedNamespaceScope, NamespaceDirectives, TokenValidator}
import org.slf4j.LoggerFactory

object Http {
  import Directives._

  val log = LoggerFactory.getLogger(this.getClass)

  val setAuthenticationHeaderFromCookie: Directive0 = {
    extractCredentials.flatMap {
      case None => optionalCookie("auth_plus_access_token").flatMap {
        case None =>
          log.info(s"No Cookie found")
          Directives.pass
        case Some(t) =>
          log.info(s"Cookie is: $t")
          mapRequest { r => r.addHeader(Authorization(OAuth2BearerToken(t.value)))}
      }
      case _ => Directives.pass
    }
  }

  val authNamespace: Directive1[AuthedNamespaceScope] = {
    val nsDir = NamespaceDirectives.fromConfig()
    setAuthenticationHeaderFromCookie.tflatMap {_ => nsDir}
  }

  def tokenValidator()(implicit system: ActorSystem, mat: ActorMaterializer): Directive0 = {
    val nsDir = TokenValidator().fromConfig()
    setAuthenticationHeaderFromCookie.tflatMap {_ => nsDir}
  }
}
