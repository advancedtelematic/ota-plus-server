package com.advancedtelematic.api.messaging

import akka.actor.{ActorSystem, Props}
import akka.stream.ActorMaterializer
import akka.stream.scaladsl.Source
import akka.stream.testkit.scaladsl.TestSink
import akka.testkit.TestKit
import com.advancedtelematic.api.MessagingData
import org.genivi.sota.messaging.Messages.DeviceSeen
import org.genivi.webserver.controllers.messaging.Actors.MessageRelayActor
import org.scalatest.WordSpecLike

class MessagingActorSpec extends TestKit(ActorSystem()) with WordSpecLike {

  implicit val mat = ActorMaterializer()

  "MessageRelayActor" should {
    "push relevant messages to akka stream" in {
      val source = Source.actorPublisher(Props(new MessageRelayActor[DeviceSeen]()))
      val stream = source.runWith(TestSink.probe)
      stream.request(1)
      system.eventStream.publish(MessagingData.deviceSeenMessage)
      stream.expectNextN(1)
    }
  }
}
