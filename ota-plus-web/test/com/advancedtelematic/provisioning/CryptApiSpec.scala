package com.advancedtelematic.provisioning

import brave.play.TraceData
import com.advancedtelematic.api.{ApiClientExec, CryptApi}
import org.scalatest.concurrent.ScalaFutures
import org.scalatest.time.{Millis, Seconds, Span}
import org.scalatestplus.play.PlaySpec
import org.scalatestplus.play.guice.GuiceOneAppPerSuite
import play.api.Application
import play.api.inject.guice.GuiceApplicationBuilder

import scala.concurrent.ExecutionContext

class CryptApiSpec extends PlaySpec with GuiceOneAppPerSuite with ScalaFutures {
  implicit val tracer = new TestZipkinTraceService()
  implicit val noTraceData = TraceData(tracer.tracing.tracer().newTrace())

  implicit override lazy val app: Application =
    new GuiceApplicationBuilder().configure("crypt.uri" -> MockCrypt.CryptHost).build()

  implicit val defaultPatience =
    PatienceConfig(timeout = Span(5, Seconds), interval = Span(200, Millis))

  implicit val ec = app.injector.instanceOf[ExecutionContext]
  val cryptApi = new CryptApi(app.configuration, new ApiClientExec(MockCrypt.mockClient))
  "registerAccount" should {
    "return account info if response 204 created" in {
      cryptApi.registerAccount("test").futureValue mustEqual MockCrypt.TestAccount
    }
  }

  "getAccount" should {
    "return some account for if response is Ok" in {
      cryptApi.getAccountInfo("test").futureValue mustEqual Some(MockCrypt.TestAccount)
    }

    "return none if response is 404" in {
      cryptApi.getAccountInfo("notfound").futureValue mustEqual None
    }
  }

}
