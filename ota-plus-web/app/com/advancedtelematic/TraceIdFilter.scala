package com.advancedtelematic

import javax.inject.Inject

import _root_.akka.stream.Materializer
import com.advancedtelematic.ota.common.TraceId
import play.api.mvc.{Filter, RequestHeader, Result}
import scala.concurrent.{ExecutionContext, Future}


class TraceIdFilter @Inject()(implicit val mat: Materializer, ec: ExecutionContext) extends Filter {

  import TraceId._

  private def validTraceId(requestHeader: RequestHeader): Option[TraceId] = {
    val idH = requestHeader.headers.get(TRACEID_HEADER)
    val sigH = requestHeader.headers.get(TRACEID_HMAC_HEADER)
    parseValidHeader(idH, sigH)
  }

  override def apply(nextFilter: (RequestHeader) => Future[Result])(requestHeader: RequestHeader): Future[Result] = {
    val extracted = validTraceId(requestHeader)

    val (rh, traceId) = if(extracted.isEmpty) {
      val newId = newTraceId

      val newHeaders = requestHeader.headers
        .remove(TRACEID_HEADER)
        .remove(TRACEID_HMAC_HEADER)
        .add(TRACEID_HEADER -> newId.id, TRACEID_HMAC_HEADER -> newId.sig)

      (requestHeader.copy(headers = newHeaders), newId)
    } else {
      (requestHeader, extracted.get)
    }

    nextFilter(rh) map { result =>
      result.withHeaders(TRACEID_HEADER -> traceId.id, TRACEID_HMAC_HEADER -> traceId.sig)
    }
  }
}
