package com.advancedtelematic.api

import com.advancedtelematic.api.Errors.{RemoteApiError, RemoteApiIOError, RemoteApiParseError}
import com.fasterxml.jackson.core.JsonParseException
import javax.inject.Inject
import play.api.http.HttpEntity
import play.api.libs.json.{JsError, JsSuccess, JsValue, Reads}
import play.api.libs.ws.{WSClient, WSRequest, WSResponse}
import play.api.mvc.Results.Ok
import play.api.mvc.{ResponseHeader, Result}

import scala.concurrent.{ExecutionContext, Future}
import scala.util.Try


class ApiClientExec @Inject()(wsClient: WSClient)(implicit ec: ExecutionContext) {
  def runApiResult(request: WSClient => WSRequest): Future[Result] = {
    run(request(wsClient)).map(toResult)
  }

  def runApiJson[T](request: WSClient => WSRequest)(implicit ev: Reads[T]): Future[T] = {
    runSafe(request)
      .flatMap { wresp =>
        wresp.json.validate[T] match {
          case JsSuccess(v, _) =>
            Future.successful(v)
          case JsError(errors) =>
            Future.failed(RemoteApiParseError(errors.mkString))
        }
      }
      .recoverWith {
        case t: JsonParseException =>
          Future.failed(RemoteApiParseError(t.getMessage))
      }
  }

  def runApiJsonValue(request: WSClient => WSRequest) : Future[JsValue] = {
    runSafe(request).flatMap { wresp =>
      val t: Try[JsValue] = Try(wresp.json)
      Future.fromTry(t)
    }
  }

  def runStreamedResult(request: WSClient => WSRequest): Future[Result] = {
    request(wsClient).stream().map { resp =>
      val body = resp.bodyAsSource
      val contentType = resp.headers.get("Content-Type").flatMap(_.headOption)
        .getOrElse("application/octet-stream")

      // If there's a content length, send that, otherwise return the body chunked
      val resultBody = resp.headers.get("Content-Length") match {
        case Some(Seq(length)) =>
          HttpEntity.Streamed(body, Some(length.toLong), Some(contentType))
        case _ =>
          Ok.chunked(body).as(contentType).body
      }
      Result(toResultHeader(resp.status, resp.headers), resultBody)
    }
  }

  def runSafe(request: WSClient => WSRequest): Future[WSResponse] = {
    run(request(wsClient))
      .recoverWith { case t => Future.failed(RemoteApiIOError(t)) }
      .flatMap { result =>
        if (isSuccess(result)) { Future.successful(result) }
        else { Future.failed(RemoteApiError(toResult(result), result.statusText)) }
      }
  }

  def runUnsafe(request: WSClient => WSRequest): Future[WSResponse] = {
    run(request(wsClient))
      .recoverWith { case t => Future.failed(RemoteApiIOError(t)) }
  }

  protected def run(request: WSRequest): Future[WSResponse] = {
    request.execute()
  }

  private def isSuccess(response: WSResponse): Boolean = {
    (200 to 299) contains response.status
  }

  private val toResult: WSResponse => Result = { resp =>
    Result(
      header = toResultHeader(resp.status, resp.headers),
      body = HttpEntity.Strict(resp.bodyAsBytes, None)
    )
  }

  private val toResultHeader: (Int, Map[String, Seq[String]]) => ResponseHeader = { (status, headers) =>
    ResponseHeader(
      status,
      headers.filterNot { case (k, v) => k == "Content-Length" }.mapValues(_.head)
    )
  }
}
