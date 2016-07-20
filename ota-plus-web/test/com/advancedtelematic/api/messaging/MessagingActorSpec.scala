package com.advancedtelematic.api.messaging

import akka.actor.{ActorSystem, Props}
import akka.stream.ActorMaterializer
import akka.stream.scaladsl.Source
import akka.stream.testkit.scaladsl.TestSink
import akka.testkit.TestKit
import com.advancedtelematic.api.MessagingData
import org.genivi.webserver.controllers.messaging.DeviceSeenActor
import org.scalatest.WordSpecLike

class MessagingActorSpec extends TestKit(ActorSystem()) with WordSpecLike {

  implicit val mat = ActorMaterializer()

  "DeviceSeenActor" should {
    "Push DeviceSeenMessages to akka stream" in {
      val source = Source.actorPublisher(Props(new DeviceSeenActor(MessagingData.deviceId)))
      val stream = source.runWith(TestSink.probe)
      stream.request(1)
      system.eventStream.publish(MessagingData.deviceSeenMessage)
      stream.expectNextN(1)
    }
  }
}
