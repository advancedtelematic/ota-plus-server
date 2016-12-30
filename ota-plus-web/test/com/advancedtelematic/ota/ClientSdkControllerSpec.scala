package com.advancedtelematic.ota

import cats.syntax.show._
import org.genivi.sota.data._
import org.scalatest.Tag
import org.scalatest.prop.GeneratorDrivenPropertyChecks
import org.scalatestplus.play.{OneServerPerSuite, PlaySpec}
import play.api.http.Status
import play.api.libs.ws.{WSClient, WSRequest}

class ClientSdkControllerSpec extends PlaySpec
    with OneServerPerSuite
    with GeneratorDrivenPropertyChecks with DeviceIdGenerators with DeviceGenerators {

  import play.api.test.Helpers._
  import Generators._
  import Device._
  import UuidGenerator._

  override lazy val port = app.configuration.getString("test.webserver.port").map(_.toInt).getOrElse(9010)

  "test download a preconfigured client" ignore { // TODO PRO-341
    import org.genivi.webserver.controllers.{Architecture, ArtifactType}
    val attempts = 5
    val wsClient = app.injector.instanceOf[WSClient]
    forAll (minSuccessful(attempts)) {
      (device: Uuid, artifact: ArtifactType, arch: Architecture) =>

        def fullUri(suffix: String): WSRequest = {
          wsClient.url(s"http://localhost:$port/api/v1/$suffix")
        }
        // Step 1: Register Vin
        val webappRegistrationLink = s"vehicles/${device.show}"
        val registrationResponse = await(fullUri(webappRegistrationLink).put(""))
        registrationResponse.status mustBe Status.NO_CONTENT
        // Step 2: Request preconf client
        val webappDownloadLink = s"client/${device.show}/${artifact.fileExtension}/${arch.toString}"
        val fileResponse = await(fullUri(webappDownloadLink).get)
        fileResponse.status mustBe Status.OK
    }
  }

}
