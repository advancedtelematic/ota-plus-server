package com.advancedtelematic.api

import javax.inject.Inject

import com.fasterxml.jackson.core.JsonParseException
import play.api.http.HttpEntity
import play.api.libs.json.{JsError, JsSuccess, JsValue, Reads}
import play.api.libs.ws.{WSClient, WSRequest, WSResponse}
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
    request.execute
  }

  private def isSuccess(response: WSResponse): Boolean = {
    (200 to 299) contains response.status
  }

  private val toResult: WSResponse => Result = { resp =>
    val resultHeaders = resp.allHeaders
      .filterNot { case (k, v) => k == "Content-Length" }
      .mapValues(_.head)

    Result(
      header = ResponseHeader(resp.status, resultHeaders),
      body = HttpEntity.Strict(resp.bodyAsBytes, None)
    )
  }
}
