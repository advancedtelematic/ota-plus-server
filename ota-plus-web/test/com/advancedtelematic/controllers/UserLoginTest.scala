package com.advancedtelematic.controllers

import akka.http.scaladsl.util.FastFuture
import com.advancedtelematic.libats.data.DataType.Namespace
import org.scalatest.FunSuite
import org.scalatest.concurrent.ScalaFutures

import scala.concurrent.ExecutionContext.Implicits.global

class UserLoginTest extends FunSuite with ScalaFutures {

  test("uses default values when IdentityClaims is not available") {
    val failedIdentityClaims = FastFuture.failed(new Exception)
    val userLogin = UserLogin(failedIdentityClaims, "userId", Namespace("namespace")).futureValue
    assert(userLogin.id == "userId")
    assert(userLogin.identity == None)
    assert(userLogin.namespace.get == "namespace")
  }

}
