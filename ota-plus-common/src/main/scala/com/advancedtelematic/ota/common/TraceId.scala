package com.advancedtelematic.ota.common

import java.util.UUID

import akka.http.scaladsl.model.{HttpRequest, HttpResponse}
import akka.http.scaladsl.model.headers.RawHeader
import akka.http.scaladsl.server.Directive0

import scala.util.Try

object TraceId {

  import akka.http.scaladsl.server.Directives._

  val TRACEID_HEADER = "x-ats-traceid"

  def parseValidHeader(header: Option[String]): Option[UUID] = {
    header.flatMap { h =>
      Try(UUID.fromString(h)).toOption
    }
  }

  val traceMetrics = (req: HttpRequest, resp: HttpResponse) => {
    Map("traceid" -> req.headers.find(_.is(TRACEID_HEADER)).map(_.value()).getOrElse("?"))
  }

  def withTraceId: Directive0 = {
    mapRequest{ r =>
      val existingHeader = parseValidHeader(r.headers.find(_.is(TRACEID_HEADER)).map(_.value()))

      existingHeader match {
        case Some(h) => r
        case None =>
          r.removeHeader(TRACEID_HEADER).addHeader(RawHeader(TRACEID_HEADER, newTraceId))
      }
    } tflatMap { _ =>
      optionalHeaderValue(h => if(h.is(TRACEID_HEADER)) Some(h.value()) else None)
    } tflatMap { h =>
      respondWithHeader(RawHeader(TRACEID_HEADER, h._1.getOrElse(newTraceId)))
    }
  }

  def newTraceId: String = {
    UUID.randomUUID().toString
  }
}
