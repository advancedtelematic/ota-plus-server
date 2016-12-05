package com.advancedtelematic.ota.provisioning

import akka.http.scaladsl.model.Uri.NamedHost
import com.advancedtelematic.api.CryptAccountInfo
import mockws.MockWS
import play.api.libs.json.Json
import play.api.mvc.Action

object MockCrypt {

  val CryptHost = "http://crypt.ats.com"

  val TestAccount     = CryptAccountInfo(name = "test", hostName = NamedHost("test.api-atsgarage.dev"))
  val TestAccountJson = Json.obj("subject" -> TestAccount.name, "hostName" -> TestAccount.hostName.address)
  val testAccountUrl  = CryptHost + "/accounts/test"
  import play.api.mvc.Results._
  import play.api.test.Helpers._
  val mockClient = MockWS {
    case (PUT, _) =>
      Action(_ => Created(TestAccountJson))

    case (GET, `testAccountUrl`) =>
      Action(_ => Ok(TestAccountJson))

    case (GET, _) =>
      Action(_ => NotFound)
  }
}
