package com.advancedtelematic.api

import java.util.UUID

import akka.stream.Materializer
import com.advancedtelematic.TraceIdFilter
import org.genivi.sota.http.{TraceId, TraceIdSig}
import org.scalatestplus.play.{OneServerPerSuite, PlaySpec}
import play.api.mvc._
import play.api.test.FakeRequest
import play.api.test.Helpers._

import scala.concurrent.ExecutionContext

class TraceIdFilterSpec extends PlaySpec with OneServerPerSuite with Results {
  implicit val ec = ExecutionContext.global
  implicit lazy val materializer: Materializer = app.materializer

  val filter = new TraceIdFilter

  val action = Action(NoContent)

  "TraceIdFilter" should {
    "add traceid header if none is supplied" in {
      val rh = FakeRequest()
      val result = filter(action)(rh).run()

      status(result) must be(204)
      header(TraceId.TRACEID_HEADER, result).map(UUID.fromString) must be(defined)
      header(TraceId.TRACEID_HMAC_HEADER, result) must be(defined)
    }

    "add trace id headers if an invalid one is supplied" in {
      val rh = FakeRequest().withHeaders(TraceId.TRACEID_HEADER -> "InvalidHeader")
      val result = filter(action)(rh).run()

      status(result) must be(204)
      header(TraceId.TRACEID_HEADER, result).map(UUID.fromString) must be(defined)
      header(TraceId.TRACEID_HMAC_HEADER, result) must be(defined)
    }

    "adds a trace id headers if an invalid sig is supplied" in {
      val rh = FakeRequest().withHeaders(TraceId.TRACEID_HEADER -> UUID.randomUUID().toString,
        TraceId.TRACEID_HMAC_HEADER -> "invalid")
      val result = filter(action)(rh).run()

      status(result) must be(204)
      header(TraceId.TRACEID_HEADER, result).map(UUID.fromString) must be(defined)
      header(TraceId.TRACEID_HMAC_HEADER, result) must be(defined)
    }

    "keep the header if a valid one is supplied" in {
      val traceId = UUID.randomUUID().toString
      val sig = TraceIdSig(traceId).get
      val rh = FakeRequest().withHeaders(TraceId.TRACEID_HEADER -> traceId, TraceId.TRACEID_HMAC_HEADER -> sig)
      val result = filter(action)(rh).run()

      status(result) must be(204)
      header(TraceId.TRACEID_HEADER, result) must contain(traceId)
      header(TraceId.TRACEID_HMAC_HEADER, result) must contain(sig)
    }

    "traceid sig must be a valid sig for given traceid" in {
      val rh = FakeRequest()

      val action = Action { req =>
        val id = req.headers.get(TraceId.TRACEID_HEADER).get
        val sig = req.headers.get(TraceId.TRACEID_HMAC_HEADER).get

        sig mustEqual TraceIdSig(id).get

        NoContent
      }

      val result = filter(action)(rh).run()

      header(TraceId.TRACEID_HEADER, result) must be(defined)
      header(TraceId.TRACEID_HMAC_HEADER, result) must be(defined)
    }
  }
}
