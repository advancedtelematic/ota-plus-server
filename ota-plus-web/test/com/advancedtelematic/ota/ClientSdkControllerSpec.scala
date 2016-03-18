package com.advancedtelematic.ota

import org.scalatest.Tag
import org.scalatest.prop.GeneratorDrivenPropertyChecks
import org.scalatestplus.play.{OneServerPerSuite, PlaySpec}
import play.api.http.Status
import play.api.libs.ws.{WSRequest, WSClient}

/**
  * Purpose of a tag: ScalaTest's command line options -n (include) and -l (exclude).
  * For example, Integration runs only those tests tagged "APITests".
  * Other tags in use: "BrowserTests" and so on.
  */
object APITests extends Tag("APITests")

class ClientSdkControllerSpec extends PlaySpec
    with OneServerPerSuite
    with GeneratorDrivenPropertyChecks {

  import play.api.test.Helpers._
  import Generators._

  override lazy val port = app.configuration.getString("test.webserver.port").map(_.toInt).getOrElse(9000)

  "test download a preconfigured client" taggedAs APITests in {
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
