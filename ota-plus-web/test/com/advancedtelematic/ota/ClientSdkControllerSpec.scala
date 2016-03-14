package com.advancedtelematic.ota

import org.scalatest.prop.GeneratorDrivenPropertyChecks
import org.scalatestplus.play.{OneServerPerSuite, PlaySpec}
import play.api.http.{HttpEntity, Status}
import play.api.libs.ws.{WSRequest, WSClient}

class ClientSdkControllerSpec extends PlaySpec
    with OneServerPerSuite
    with GeneratorDrivenPropertyChecks {

  import play.api.test.Helpers._
  import Generators._

  "test download a preconfigured client" in {
    import org.genivi.webserver.controllers.{Architecture, PackageType}
    val attempts = 5
    val wsClient = app.injector.instanceOf[WSClient]
    forAll (minSuccessful(attempts)) {
      (vin: com.advancedtelematic.ota.vehicle.Vehicle.Vin, packfmt: PackageType, arch: Architecture) =>

        def fullUri(suffix: String): WSRequest = {
          wsClient.url(s"http://localhost:$port/api/v1/$suffix")
        }
        // Step 1: Register Vin
        val webappRegistrationLink = s"vehicles/${vin.get}"
        val registrationResponse = await(fullUri(webappRegistrationLink).put(""))
        // Step 2: Request preconf client
        val webappDownloadLink = s"client/${vin.get}/${packfmt.fileExtension}/${arch.toString}"
        val fileResponse = await(fullUri(webappDownloadLink).get)
        fileResponse.status mustBe Status.OK
    }
  }

}
