package com.advancedtelematic

import javax.inject.Inject

import com.advancedtelematic.api.RemoteApiError
import play.api.Logger
import play.api.mvc.{Filter, RequestHeader, Result}
import _root_.akka.stream.Materializer

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}

class LoggingFilter @Inject()(implicit val mat: Materializer, ec: ExecutionContext) extends Filter {

  def apply(nextFilter: RequestHeader => Future[Result])
           (requestHeader: RequestHeader): Future[Result] = {

    val startTime = System.currentTimeMillis
    nextFilter(requestHeader) andThen {
      case Success(result) =>
        logRequest(requestHeader, result.header.status.toString, startTime)
      case Failure(RemoteApiError(result, _)) =>
        logRequest(requestHeader, result.header.status.toString, startTime)
      case _ =>
        logRequest(requestHeader, "???", startTime)
    }
  }

  protected def logRequest(requestHeader: RequestHeader, resultCode: String, startTime: Long): Unit = {
    val endTime = System.currentTimeMillis
    val serviceTime = endTime - startTime

    val metrics = Map(
      "service_name" -> "ota-plus-web",
      "traceid" -> requestHeader.headers.get("x-ats-traceid").getOrElse("?"),
      "method" -> requestHeader.method,
      "path" -> requestHeader.path,
      "stime" -> serviceTime.toString,
      "status" -> resultCode.toString
    )

    val msg = metrics.toList.map { case (m, v) => s"$m=$v"}.mkString(" ")

    Logger.info(msg)
  }

}
