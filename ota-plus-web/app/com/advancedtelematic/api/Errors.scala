package com.advancedtelematic.api

import play.api.libs.ws.WSResponse
import play.api.mvc.Result

import scala.util.control.NoStackTrace

object Errors {
  case class RemoteApiIOError(cause: Throwable) extends Exception(cause) with NoStackTrace

  case class RemoteApiError(result: Result, msg: String = "") extends Exception(msg) with NoStackTrace

  case class RemoteApiParseError(msg: String) extends Exception(msg) with NoStackTrace

  final case class MalformedResponse(msg: String, response: WSResponse) extends Throwable(msg)

  final case class UnexpectedResponse(response: WSResponse) extends Throwable {
    override def getMessage: String =
      s"Unexpected response with status '${response.statusText}', body: ${response.body}"
  }

  case class ConfigurationException(msg: String = "")
    extends Exception(s"Could not get required configuration " + msg) with NoStackTrace
}
