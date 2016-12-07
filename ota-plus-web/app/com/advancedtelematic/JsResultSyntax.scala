package com.advancedtelematic

import cats.data.Xor
import play.api.libs.json.{JsError, JsResult, Json}

object JsResultSyntax {

  implicit class JsResultOps[T](res: JsResult[T]) {

    def toXor: String Xor T =
      res.fold(err => Xor.left[String, T](Json.stringify(JsError.toJson(err))), Xor.Right.apply)

  }
}
