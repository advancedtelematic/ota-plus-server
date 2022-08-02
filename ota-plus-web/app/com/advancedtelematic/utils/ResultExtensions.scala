package com.advancedtelematic.utils

import com.advancedtelematic.auth.{AccessToken, IdToken, SessionCodecs}
import com.advancedtelematic.libats.data.DataType.Namespace
import play.api.libs.json.Json
import play.api.mvc.Result

import java.time.{Duration, Instant}

object ResultExtensions {

  implicit class ResultOps(val result: Result) extends AnyVal {

    def withAuthSession(ns: Namespace, idToken: IdToken, accessToken: AccessToken, sessionTTL: Duration): Result = {
      val expiredAtEpochSecond = Instant.now().plus(sessionTTL).getEpochSecond
      result.withSession(
        "namespace" -> ns.get,
        "id_token" -> idToken.value,
        "access_token" -> Json.stringify(Json.toJson(accessToken)(SessionCodecs.AccessTokenFormat)),
        "expired_at" -> expiredAtEpochSecond.toString
      )
    }

  }

}
