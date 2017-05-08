package com.advancedtelematic.messaging

import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import akka.stream.testkit.scaladsl.TestSink
import akka.testkit.TestKit
import com.advancedtelematic.controllers.MessagingData
import com.advancedtelematic.messaging.MessageWriters.deviceSeenWrites
import org.genivi.sota.messaging.Messages.DeviceSeen
import org.genivi.sota.messaging.MessageBus
import org.scalatest.WordSpecLike

class MessagingBusActorListenerSpec extends TestKit(ActorSystem()) with WordSpecLike {

  implicit val mat = ActorMaterializer()
  implicit val ec = system.dispatcher

  "EventBusActorListener" should {
    "push relevant messages to akka stream" in {
      val source = new EventBusActorListener().getSource[DeviceSeen]()
      val stream = source.runWith(TestSink.probe)
      stream.request(1)

      val publisher =  MessageBus.publisher(system, system.settings.config).toOption.get
      publisher.publish(MessagingData.deviceSeenMessage)

      stream.expectNextN(1)
    }
  }
}
