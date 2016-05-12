package com.advancedtelematic.ota.core

import akka.actor.ActorSystem
import akka.http.scaladsl.model.headers.OAuth2BearerToken
import akka.http.scaladsl.server.{Directive1, Directives}
import com.advancedtelematic.jws.CompactSerialization
import com.advancedtelematic.jwt.JsonWebToken
import eu.timepit.refined._
import eu.timepit.refined.auto._
import io.circe.parser._
import org.genivi.sota.data.Namespace._


trait Namespaces {
  self: Directives =>

  def defaultNs(implicit system: ActorSystem): Option[Namespace] = {
    val nsE: Either[String, Namespace] = refineV(system.settings.config.getString("core.defaultNs"))
    nsE.right.toOption
  }

  private[this] def extractToken(serializedToken: String): Option[JsonWebToken] = (for {
    serialized <- CompactSerialization.parse(serializedToken)
    token      <- decode[JsonWebToken](serialized.encodedPayload.stringData()).leftMap(_.getMessage)
  } yield token).toOption

  def extractNamespace(implicit system: ActorSystem): Directive1[Namespace] = extract { _ =>
    defaultNs.getOrElse("")
  }
}
