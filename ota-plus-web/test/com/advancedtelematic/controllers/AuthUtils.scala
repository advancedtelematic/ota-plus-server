package com.advancedtelematic.controllers

import java.time.Instant

import com.advancedtelematic.TokenUtils
import com.advancedtelematic.auth.AccessToken
import play.api.libs.json.Json
import play.api.test.FakeRequest
import com.advancedtelematic.auth.SessionCodecs.AccessTokenFormat

object AuthUtils {
  implicit class RequestSyntax[A](request: FakeRequest[A]) {
    def withAuthSession(ns: String): FakeRequest[A] = {
      request.withSession(
        "id_token"               -> TokenUtils.identityTokenFor(ns).value,
        "access_token"           -> Json.toJson(AccessToken("XXXX", Instant.now().plusSeconds(3600))).toString(),
        "auth_plus_access_token" -> "",
        "namespace"              -> ns)
    }
  }
}
