package com.advancedtelematic.api

import play.api.libs.ws.WSResponse

final case class MalformedResponse(msg: String, response: WSResponse) extends Throwable(msg)
