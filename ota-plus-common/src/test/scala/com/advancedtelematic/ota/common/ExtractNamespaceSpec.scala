package com.advancedtelematic.ota.common

import javax.crypto.SecretKey

import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.model.headers.{Authorization, OAuth2BearerToken}
import akka.http.scaladsl.server._
import akka.http.scaladsl.testkit.ScalatestRouteTest
import com.advancedtelematic.json.signature.JcaSupport._
import com.advancedtelematic.jwa.`HMAC SHA-256`
import com.advancedtelematic.jws.{Jws, KeyInfo}
import org.genivi.sota.data.Namespace._
import org.scalatest.prop.PropertyChecks
import org.scalatest.{Matchers, PropSpec}

class ExtractNamespaceSpec extends PropSpec
  with PropertyChecks
  with ScalatestRouteTest
  with Matchers
  with Directives {

  import Generators._
  import AuthNamespace._

  def route: Route = (path("test") & authNamespace) { (ns: Namespace) =>
    get { complete(StatusCodes.OK -> ns.get) }
  }

  property("namespace is deriveable from user context") {
    forAll(TokenGen, SecretKeyGen) { (token, key) =>
      val keyInfo = KeyInfo[SecretKey](key, None, None, None)
      val jwsSerialized = Jws.signCompact(token, `HMAC SHA-256`, keyInfo)
      Get("/test").withHeaders(Authorization(OAuth2BearerToken(jwsSerialized.toString))) ~>
        route ~> check { responseAs[String] shouldEqual token.subject.underlying }
    }
  }

  property("returns an unauthorized response if namespace is not available") {
    Get("/test") ~> route ~> check {
      rejection shouldBe a[AuthorizationFailedRejection.type]
    }
  }
}
