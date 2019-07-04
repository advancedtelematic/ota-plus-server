package com.advancedtelematic

import _root_.akka.stream.Materializer
import akka.actor._
import com.advancedtelematic.api.RemoteApiError
import com.advancedtelematic.libats.http.logging.RequestLoggingActor
import javax.inject.{Inject, Named}
import play.api.http.Status
import play.api.libs.json._
import play.api.mvc.{Filter, RequestHeader, Result}

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}

class LoggingFilter @Inject()(@Named("logging-actor") loggingActor: ActorRef)
                             (implicit val mat: Materializer, ec: ExecutionContext)
    extends Filter {

  import LoggingFilter._

  def apply(nextFilter: RequestHeader => Future[Result])(requestHeader: RequestHeader): Future[Result] = {
    val logMessage = (getMetrics(requestHeader, System.currentTimeMillis) _).tupled andThen getLogMsg

    nextFilter(requestHeader) andThen {
      case Success(result) =>
        loggingActor ! logMessage((result.header.status, result.body.contentLength.getOrElse(0)))
      case Failure(RemoteApiError(result, _)) =>
        loggingActor ! logMessage((result.header.status, result.body.contentLength.getOrElse(0)))
      case _ =>
        loggingActor ! logMessage((Status.INTERNAL_SERVER_ERROR, 0))
    }
  }
}

object LoggingFilter {

  private val getLogMsg: Map[String, String] => RequestLoggingActor.LogMsg =
    LoggingFilter.format _ andThen ((m: String) => RequestLoggingActor.LogMsg(m, Map.empty))

  val serviceName    = sys.env.getOrElse("SERVICE_NAME", "ota-plus-web")

  def getMetrics(requestHeader: RequestHeader, startTime: Long)
                (responseCode: Int, responseContentLength: Long): Map[String, String] = {
    val endTime     = System.currentTimeMillis
    val serviceTime = endTime - startTime
    val traceId = requestHeader.headers.get("x-b3-traceid").map("traceid" -> _).toMap

    Map(
      "http_method" -> requestHeader.method,
      "http_path" -> requestHeader.path,
      "http_query" -> s"'${requestHeader.rawQueryString}'",
      "http_stime" -> serviceTime.toString,
      "http_status" -> responseCode.toString,
      "http_service_name" -> serviceName) ++
      traceId ++
      (if (responseContentLength > 0) Map("http_content_ln" -> responseContentLength.toString) else Map.empty)
  }

  def format(metrics: Map[String, String]): String = Json.stringify(Json.toJson(metrics))

}
