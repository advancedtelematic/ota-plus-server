/**
 * Copyright: Copyright (C) 2015, Jaguar Land Rover
 * License: MPL-2.0
 */

import java.net.{HttpURLConnection, URL}

import play.api.test.Helpers._
import org.scalatestplus.play._
import org.scalatestplus.play.guice.GuiceOneServerPerSuite
import play.api.libs.ws.WSClient

/**
 * Test the Application controller
 */
class ApplicationSpec extends PlaySpec with GuiceOneServerPerSuite {

  "send 404 on a bad request" in {
    val wsClient = app.injector.instanceOf[WSClient]
    val response = await(wsClient.url(s"http://localhost:$port/invalid").get())
    response.status mustBe NOT_FOUND
  }

  "bad request with invalid character returns security headers" in {
    // WSClient fails while parsing the URL, use the Java one:
    val url = new URL(s"http://localhost:$port/]")
    val conn = url.openConnection.asInstanceOf[HttpURLConnection]
    conn.getResponseCode mustBe BAD_REQUEST
    conn.getHeaderField("X-Frame-Options") mustBe "SAMEORIGIN"
    conn.getHeaderField("X-XSS-Protection") mustBe "1; mode=block"
    conn.getHeaderField("X-Content-Type-Options") mustBe "nosniff"
    conn.getHeaderField("X-Permitted-Cross-Domain-Policies") mustBe "master-only"
    conn.getHeaderField("Content-Security-Policy") must not be null
  }

}
