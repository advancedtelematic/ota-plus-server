package com.advancedtelematic

import javax.inject.Inject
import _root_.akka.stream.Materializer
import play.api.Logger
import play.api.mvc._
import scala.concurrent.{ExecutionContext, Future}

class LoggingFilter @Inject() (implicit val mat: Materializer, ec: ExecutionContext) extends Filter {

  def apply(nextFilter: RequestHeader => Future[Result])
           (requestHeader: RequestHeader): Future[Result] = {

    val startTime = System.currentTimeMillis

    nextFilter(requestHeader) map { result =>

      val endTime = System.currentTimeMillis
      val serviceTime = endTime - startTime

      val metrics = Map(
        "method" -> requestHeader.method,
        "path" -> requestHeader.path,
        "stime" -> serviceTime.toString,
        "status" -> result.header.status.toString
      )

      val msg = metrics.toList.map { case (m, v) => s"$m=$v"}.mkString(" ")

      Logger.info(msg)

      result
    }
  }
}
