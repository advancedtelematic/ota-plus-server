package com.advancedtelematic.api

import play.api.libs.ws.WSResponse

final case class UnexpectedResponse(response: WSResponse) extends Throwable {
  override def getMessage: String =
    s"Unexpected response with status '${response.statusText}', body: ${response.body}"
}
