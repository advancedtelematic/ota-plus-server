package com.advancedtelematic

import play.api.libs.json.{JsError, JsResult, Json}

object JsResultSyntax {

  implicit class JsResultOps[T](res: JsResult[T]) {

    def toEither: String Either T =
      res.fold(err => Left[String, T](Json.stringify(JsError.toJson(err))), Right.apply)

  }
}
