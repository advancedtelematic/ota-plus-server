package com.advancedtelematic.provisioning

import akka.http.scaladsl.model.Uri.NamedHost
import akka.stream.scaladsl.Source
import akka.util.ByteString
import com.advancedtelematic.api.CryptAccountInfo
import java.time.{Clock, Instant}
import java.time.temporal.ChronoUnit

import mockws.{MockWS, MockWSHelpers}
import play.api.http.{HeaderNames, HttpEntity}
import play.api.libs.json.Json

object MockCrypt extends MockWSHelpers {
  val CryptHost = "http://crypt.ats.com"

  val now = Instant.now(Clock.systemUTC())

  val TestAccount     = CryptAccountInfo(name = "test", hostName = NamedHost("test.api-atsgarage.dev"))
  val TestAccountJson = Json.obj("subject" -> TestAccount.name, "hostName" -> TestAccount.hostName.address)

  val TestDeviceUuid = "331a24da-d430-41f9-9785-7563d6d8f4b7"
  val TestDeviceDescription = "simple description"

  def TestDeviceJson(description: String, ttl: Long) = Json.obj(
    "id" -> TestDeviceUuid,
    "description" -> description,
    "validFrom" -> Json.toJson(now),
    "validUntil" -> Json.toJson(now.plus(ttl, ChronoUnit.HOURS))
  )

  val testAccountUrl  = CryptHost + "/accounts/test"
  val testAccountRegistrationUrl = testAccountUrl + "/credentials/registration"
  val testAccountCredentialsUrl = testAccountRegistrationUrl + s"/$TestDeviceUuid"

  import play.api.mvc.Results._
  import play.api.test.Helpers._
  val mockClient = MockWS {
    case (PUT, _) =>
      Action(_ => Created(TestAccountJson))

    case (GET, `testAccountUrl`) =>
      Action(_ => Ok(TestAccountJson))

    case (GET, `testAccountCredentialsUrl`) => {
      val source = Source.single(ByteString("file-content"))
      Action(_ =>
          Ok.sendEntity(HttpEntity.Streamed(source, None, Some("application/x-pkcs12")))
            .withHeaders(HeaderNames.CONTENT_DISPOSITION -> "attachment; filename=credentials.p12")
      )
    }

    case (GET, _) =>
      Action(_ => NotFound)

    case (POST, `testAccountRegistrationUrl`) =>
      Action{ req =>
        req.body.asJson match {
          case Some(body) => {
            val desc = (body \ "description").as[String]
            val ttl = (body \ "ttl").as[Long]
            Ok(TestDeviceJson(desc, ttl))
          }
          case None =>
            BadRequest
        }
      }
  }
}
