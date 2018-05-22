package com.advancedtelematic.api

import io.circe.Json
import org.scalatest.FunSuite
import play.api.libs.ws.InMemoryBody

class ApiClientTest extends FunSuite with CirceJsonBodyWritables {

  test("circeJsonBodyWritable") {
    val json = Json.obj("k" -> Json.fromInt(17))
    val wsBody = circeJsonBodyWritable.transform(json)
    val inMem = wsBody.asInstanceOf[InMemoryBody]
    assert(inMem.bytes.utf8String == """{"k":17}""")
  }

}
