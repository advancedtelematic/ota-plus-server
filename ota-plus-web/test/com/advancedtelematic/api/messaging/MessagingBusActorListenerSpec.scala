package com.advancedtelematic.api.messaging

import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import akka.stream.testkit.scaladsl.TestSink
import akka.testkit.TestKit
import com.advancedtelematic.api.MessagingData
import org.genivi.sota.messaging.Messages.DeviceSeen
import com.advancedtelematic.ota.Messages.MessageWriters.deviceSeenWrites
import org.genivi.sota.messaging.MessageBus
import org.genivi.webserver.controllers.messaging.MessageBusActorListener
import org.scalatest.WordSpecLike

class MessagingBusActorListenerSpec extends TestKit(ActorSystem()) with WordSpecLike {

  implicit val mat = ActorMaterializer()
  implicit val ec = system.dispatcher

  "MessageBusActorListener" should {
    "push relevant messages to akka stream" in {
      val source = new MessageBusActorListener().getSource[DeviceSeen]()

      val publisher =  MessageBus.publisher(system, system.settings.config).toOption.get

      val stream = source.runWith(TestSink.probe)
      stream.request(1)

      publisher.publish(MessagingData.deviceSeenMessage)

      stream.expectNextN(1)
    }
  }
}
