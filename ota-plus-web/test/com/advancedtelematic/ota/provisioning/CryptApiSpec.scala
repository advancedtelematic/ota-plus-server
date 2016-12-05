package com.advancedtelematic.ota.provisioning

import com.advancedtelematic.api.{ApiClientExec, CryptApi}
import org.scalatest.concurrent.ScalaFutures
import org.scalatestplus.play.{OneAppPerSuite, PlaySpec}
import play.api.Application
import play.api.inject.guice.GuiceApplicationBuilder

class CryptApiSpec extends PlaySpec with OneAppPerSuite with ScalaFutures {
  implicit override lazy val app: Application =
    new GuiceApplicationBuilder().configure("crypt.host" -> MockCrypt.CryptHost).build()
  import play.api.libs.concurrent.Execution.Implicits.defaultContext
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
