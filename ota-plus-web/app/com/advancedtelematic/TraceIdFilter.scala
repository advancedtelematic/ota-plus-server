package com.advancedtelematic

import java.util.UUID
import javax.inject.Inject

import _root_.akka.stream.Materializer
import com.advancedtelematic.ota.common.TraceId
import play.api.mvc.{Filter, RequestHeader, Result}

import scala.concurrent.{ExecutionContext, Future}
import scala.util.Success

class TraceIdFilter @Inject()(implicit val mat: Materializer, ec: ExecutionContext) extends Filter {

  import TraceId._

  private def validTraceId(requestHeader: RequestHeader): Option[UUID] =
    parseValidHeader(requestHeader.headers.get(TRACEID_HEADER))

  override def apply(nextFilter: (RequestHeader) => Future[Result])(requestHeader: RequestHeader): Future[Result] = {
    println("RUNNING FILTER")

    val rh = if(validTraceId(requestHeader).isEmpty) {
      val newHeaders = requestHeader.headers.remove(TRACEID_HEADER).add(TRACEID_HEADER -> newTraceId)
      requestHeader.copy(headers = newHeaders)
    } else {
      requestHeader
    }

    val f = nextFilter(rh)

    f andThen  {
      case Success(r) =>

        println("AFTER ALL FILTERS")
        println(requestHeader.headers.keys)
      case _ =>
        println("fail")
    }

    f
  }
}
