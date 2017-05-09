package com.advancedtelematic.util

import akka.http.scaladsl.testkit.ScalatestRouteTest
import com.advancedtelematic.web_events.http.WebEventsRoutes
import org.scalatest.Suite

trait ResourceSpec extends ScalatestRouteTest {
  self: Suite =>

  def apiUri(path: String): String = "/api/v1/" + path

  lazy val routes = new WebEventsRoutes().routes
}


