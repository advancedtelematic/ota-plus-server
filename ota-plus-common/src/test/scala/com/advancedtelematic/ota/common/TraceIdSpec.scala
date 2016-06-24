package com.advancedtelematic.ota.common

import java.util.UUID

import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.model.headers.RawHeader
import akka.http.scaladsl.server.{Directives, Route}
import org.scalatest.{FunSuite, ShouldMatchers}
import akka.http.scaladsl.testkit.ScalatestRouteTest

class TraceIdSpec extends FunSuite
  with ScalatestRouteTest
  with ShouldMatchers {

  import Directives._

  def route: Route = (path("test") & TraceId.withTraceId) {
    get { complete(StatusCodes.NoContent) }
  }

  test("adds traceid if there isn't one in headers") {
    Get("/test") ~> route ~> check {
      response.headers
        .find(_.is(TraceId.TRACEID_HEADER))
        .map(_.value)
        .map(UUID.fromString) shouldBe defined
    }
  }

  test("adds traceid if header is invalid") {
    Get("/test").withHeaders(RawHeader(TraceId.TRACEID_HEADER, "invalid")) ~> route ~> check {
      response.headers
        .find(_.is(TraceId.TRACEID_HEADER))
        .map(_.value)
        .map(UUID.fromString) shouldBe defined
    }
  }

  test("keeps traceid header if header is valid") {
    val traceId = UUID.randomUUID().toString

    Get("/test").withHeaders(RawHeader(TraceId.TRACEID_HEADER, traceId)) ~> route ~> check {
      response.headers
        .find(_.is(TraceId.TRACEID_HEADER))
        .map(_.value) should contain(traceId)
    }
  }
}
