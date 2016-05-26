package com.advancedtelematic.ota.core

import akka.actor.ActorSystem
import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.model.headers.{Authorization, HttpChallenge, OAuth2BearerToken}
import akka.http.scaladsl.server._
import akka.http.scaladsl.testkit.ScalatestRouteTest
import com.advancedtelematic.json.signature.JcaSupport._
import com.advancedtelematic.jwa.`HMAC SHA-256`
import com.advancedtelematic.jws.{Jws, KeyInfo}
import com.advancedtelematic.jwt.JsonWebToken
import com.advancedtelematic.ota.core.Generators._
import javax.crypto.SecretKey

import com.advancedtelematic.ota.common.Namespaces
import org.genivi.sota.data.Namespace._
import org.scalacheck.Gen
import org.scalatest.prop.PropertyChecks
import org.scalatest.{Matchers, PropSpec}


class NamespaceSpec extends PropSpec
    with PropertyChecks
    with ScalatestRouteTest
    with Matchers
    with Directives
    with Namespaces
    // with ScalaFutures
    // with BeforeAndAfterAll
    {


  def route: Route = path("test") {
    extractNamespace(system) { (ns: Namespace) =>
      get { complete(StatusCodes.OK -> ns.get) }
    }
  }

  property("namespace is deriveable from user context") {
    pending

    forAll(TokenGen, SecretKeyGen) { (token, key) =>
      val keyInfo = KeyInfo[SecretKey](key, None, None, None)
      val jwsSerialized = Jws.signCompact(token, `HMAC SHA-256`, keyInfo)
      Get("/test").withHeaders(Authorization(OAuth2BearerToken(jwsSerialized.toString))) ~>
        route ~> check { responseAs[String] shouldEqual token.subject.underlying }
    }
  }

  property("yields default namespace without user context") {
    pending

      Get("/test") ~>
        route ~> check { responseAs[String] shouldEqual "default" }
  }

}
