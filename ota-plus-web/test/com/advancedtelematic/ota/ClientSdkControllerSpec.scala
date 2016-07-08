package com.advancedtelematic.ota

import org.genivi.sota.data.Device.{DeviceId, DeviceName}
import org.genivi.sota.data.{Device, Vehicle, VinGenerators}
import org.scalatest.Tag
import org.scalatest.prop.GeneratorDrivenPropertyChecks
import org.scalatestplus.play.{OneServerPerSuite, PlaySpec}
import play.api.http.Status
import play.api.libs.json.Json
import play.api.libs.ws.{WSClient, WSRequest}

/**
  * Purpose of a tag: ScalaTest's command line options -n (include) and -l (exclude).
  * For example, Integration runs only those tests tagged "APITests".
  * Other tags in use: "BrowserTests" and so on.
  */
object APITests extends Tag("APITests")

class ClientSdkControllerSpec extends PlaySpec
    with OneServerPerSuite
    with GeneratorDrivenPropertyChecks with VinGenerators {

  import play.api.test.Helpers._
  import Generators._
  import com.advancedtelematic.ota.device.Devices._

  override lazy val port = app.configuration.getString("test.webserver.port").map(_.toInt).getOrElse(9010)

  "test download a preconfigured client" taggedAs APITests in { // PRO-341 PRO-840
    import org.genivi.webserver.controllers.{Architecture, PackageType}
    val attempts = 5
    val wsClient = app.injector.instanceOf[WSClient]
    forAll (minSuccessful(attempts)) {
      (vin: Vehicle.Vin, packfmt: PackageType, arch: Architecture) =>

        def fullUri(suffix: String): WSRequest = {
          wsClient.url(s"http://localhost:$port/api/v1/$suffix")
        }
        // Step 1: Register Vin
        val webappRegistrationLink = s"devices"
        val uuid = java.util.UUID.randomUUID()
        val device = org.genivi.sota.data.DeviceT(
          deviceName = DeviceName("EXTRAPOWER2"),
          deviceId = Some(DeviceId(uuid.toString)),
          deviceType = Device.DeviceType.Other
        )
        val data = Json.toJson(device)
        val registrationResponse = await(fullUri(webappRegistrationLink).put(data))
        registrationResponse.status mustBe Status.CREATED
        // Step 2: Request preconf client
        val webappDownloadLink = s"client/${uuid.toString}/${packfmt.fileExtension}/${arch.toString}"
        val fileResponse = await(fullUri(webappDownloadLink).get)
        fileResponse.status mustBe Status.OK
    }
  }

}
