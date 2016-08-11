package com.advancedtelematic.api

import play.api.libs.ws.WSResponse

final case class MalformedResponse(response: WSResponse) extends Throwable {
  override def getMessage: String =
    s"No tokens found in response: Status '${response.statusText}', body ${response.body}"
}
