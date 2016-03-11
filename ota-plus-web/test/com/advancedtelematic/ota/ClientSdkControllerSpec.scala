package com.advancedtelematic.ota

import org.scalatest.prop.GeneratorDrivenPropertyChecks
import org.scalatestplus.play.{OneServerPerSuite, PlaySpec}
import play.api.http.Status
import play.api.libs.ws.WSClient

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
        val webappLink = s"client/${vin.get}/${packfmt.fileExtension}/${arch.toString}"
        val fileResponse = await(wsClient.url(s"http://localhost:$port/api/v1/$webappLink").get())
        fileResponse.status mustBe Status.OK
    }
  }

}
