package com.advancedtelematic.api

import java.util.UUID

import akka.stream.Materializer
import com.advancedtelematic.TraceIdFilter
import com.advancedtelematic.ota.common.TraceId
import org.scalatestplus.play.{OneServerPerSuite, PlaySpec}
import play.api.mvc._
import play.api.test.FakeRequest
import play.api.test.Helpers._

import scala.concurrent.ExecutionContext

class TraceIdFilterSpec extends PlaySpec with OneServerPerSuite with Results {
  implicit val ec = ExecutionContext.global
  implicit lazy val materializer: Materializer = app.materializer

  val filter = new TraceIdFilter

  val action = Action { rh =>
    Results.NoContent.withHeaders(rh.headers.toMap.mapValues(_.head).toList: _*)
  }

  "TraceIdFilter" should {
    "add traceid header if none is supplied" in {
      val rh = FakeRequest()
      val result = filter(action)(rh).run()

      status(result) must be(204)
      header(TraceId.TRACEID_HEADER, result).map(UUID.fromString) must be(defined)
    }

    "add trace id header if an invalid one is supplied" in {
      val rh = FakeRequest().withHeaders(TraceId.TRACEID_HEADER -> "InvalidHeader")
      val result = filter(action)(rh).run()

      status(result) must be(204)
      header(TraceId.TRACEID_HEADER, result).map(UUID.fromString) must be(defined)
    }

    "keep the header if a valid one is supplied" in {
      val traceId = UUID.randomUUID()
      val rh = FakeRequest().withHeaders(TraceId.TRACEID_HEADER -> traceId.toString)
      val result = filter(action)(rh).run()

      status(result) must be(204)
      header(TraceId.TRACEID_HEADER, result).map(UUID.fromString) must contain(traceId)
    }
  }
}
