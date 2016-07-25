package com.advancedtelematic.api.messaging

import akka.actor.{ActorSystem, Props}
import akka.stream.ActorMaterializer
import akka.stream.scaladsl.Source
import akka.stream.testkit.scaladsl.TestSink
import akka.testkit.TestKit
import com.advancedtelematic.api.MessagingData
import org.genivi.webserver.controllers.messaging.Actors.{DeviceCreatedActor, DeviceSeenActor}
import org.scalatest.WordSpecLike

class MessagingActorSpec extends TestKit(ActorSystem()) with WordSpecLike {

  implicit val mat = ActorMaterializer()

  "DeviceSeenActor" should {
    "push relevant DeviceSeenMessages to akka stream" in {
      val source = Source.actorPublisher(Props(new DeviceSeenActor(MessagingData.deviceId)))
      val stream = source.runWith(TestSink.probe)
      stream.request(1)
      system.eventStream.publish(MessagingData.deviceSeenMessage)
      stream.expectNextN(1)
    }

    "not push irrelevant DeviceSeenMessages to akka stream" in {
      val source = Source.actorPublisher(Props(new DeviceSeenActor(MessagingData.nonMatchingDeviceId)))
      val stream = source.runWith(TestSink.probe)
      stream.request(1)
      system.eventStream.publish(MessagingData.deviceSeenMessage)
      stream.expectNoMsg()
    }
  }

  "DeviceCreatedActor" should {
    "push relevant DeviceCreatedMessages to akka stream" in {
      val source = Source.actorPublisher(Props(new DeviceCreatedActor(MessagingData.namespace)))
      val stream = source.runWith(TestSink.probe)
      stream.request(1)
      system.eventStream.publish(MessagingData.deviceCreatedMessage)
      stream.expectNextN(1)
    }

    "not push irrelevant DeviceCreatedMessages to akka stream" in {
      val source = Source.actorPublisher(Props(new DeviceCreatedActor(MessagingData.invalidNamespace)))
      val stream = source.runWith(TestSink.probe)
      stream.request(1)
      system.eventStream.publish(MessagingData.deviceCreatedMessage)
      stream.expectNoMsg()
    }
  }
}
