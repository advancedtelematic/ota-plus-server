package com.advancedtelematic

import java.util.UUID
import java.util.concurrent.ConcurrentHashMap

import akka.Done
import akka.actor.{Actor, ActorLogging, Status}
import akka.kafka.scaladsl.Consumer
import akka.kafka.{ConsumerSettings, Subscriptions}
import akka.stream.ActorMaterializer
import akka.stream.scaladsl.Sink
import com.advancedtelematic.NamespaceDirectorChangedListener.{Director, DirectorV1, DirectorV2}
import com.advancedtelematic.api.{OtaApiUri, OtaPlusConfig}
import com.advancedtelematic.libats.data.DataType.Namespace
import com.advancedtelematic.libats.messaging.kafka.JsonDeserializer
import com.advancedtelematic.libats.messaging_datatype.MessageLike
import com.google.inject.AbstractModule
import io.circe.{Decoder, Encoder, Json}
import javax.inject.{Inject, Singleton}
import org.apache.kafka.clients.consumer.ConsumerConfig
import org.apache.kafka.common.serialization.ByteArrayDeserializer
import play.api.Configuration
import play.api.libs.concurrent.AkkaGuiceSupport

import scala.concurrent.Future


object NamespaceDirectorChangedListener {
  sealed trait Director
  case object DirectorV1 extends Director
  case object DirectorV2 extends Director

  case class NamespaceDirectorChanged(namespace: Namespace, director: Director)

  import com.advancedtelematic.libats.codecs.CirceCodecs.{namespaceDecoder, namespaceEncoder}

  implicit val directorEncoder: Encoder[Director] = Encoder.instance {
    case DirectorV1 => Json.fromString("directorV1")
    case DirectorV2 => Json.fromString("directorV2")
  }
  implicit val directorDecoder: Decoder[Director] = Decoder.decodeString.map(_.toLowerCase).flatMap {
    case "directorv1" => Decoder.const(DirectorV1)
    case "directorv2" => Decoder.const(DirectorV2)
    case other => Decoder.failedWithMessage("Invalid value for `director`: " + other)
  }

  implicit val namespaceDirectorChangedDecoder: Decoder[NamespaceDirectorChanged] = io.circe.generic.semiauto.deriveDecoder
  implicit val namespaceDirectorChangedMessageLike = MessageLike.derive[NamespaceDirectorChanged](_.namespace.get)
}

@Singleton
class NamespaceDirectorConfig @Inject()(val conf: Configuration) extends OtaPlusConfig {
  private val mapping = new ConcurrentHashMap[Namespace, Director]()

  def set(ns: Namespace, version: Director): Unit = {
    mapping.put(ns, version)
  }

  private def get(ns: Namespace): Director = {
    mapping.getOrDefault(ns, DirectorV1)
  }

  def getUri(ns: Namespace): OtaApiUri = get(ns) match {
    case DirectorV1 => directorApiUri
    case DirectorV2 => directorV2ApiUri
  }
}

@Singleton
class NamespaceDirectorChangedListener @Inject()(config: Configuration, namespaceDirectorConfig: NamespaceDirectorConfig) extends Actor with ActorLogging {
  import akka.pattern.pipe
  import context.dispatcher

  implicit val mat = ActorMaterializer()

  import NamespaceDirectorChangedListener._

  override def preStart(): Unit = {
    val consumerSettings = ConsumerSettings(context.system, new ByteArrayDeserializer, new JsonDeserializer[NamespaceDirectorChanged](namespaceDirectorChangedDecoder, throwException = true))
      // every instance always consumes whole topic, no commit, unique group id
      .withGroupId(s"ota-plus-server-${namespaceDirectorChangedMessageLike.streamName}-${UUID.randomUUID().toString}")
      .withProperty(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest")
    context.become(start(consumerSettings))
  }

  private def start(consumerSettings: ConsumerSettings[Array[Byte], NamespaceDirectorChanged]): Receive = {
    val suffix = config.get[String]("messaging.kafka.topicSuffix")

    val flowResult: Future[Done] = Consumer
      .plainSource(consumerSettings, Subscriptions.topics(namespaceDirectorChangedMessageLike.streamName + "-" + suffix))
      .log("event")(log)
      .map { _.value() }
      .map { msg =>
        namespaceDirectorConfig.set(msg.namespace, msg.director)
        log.info("Set {} for {}", msg.director, msg.namespace)
      }
      .runWith(Sink.ignore)

    flowResult pipeTo self

    active
  }

  val active: Receive = {
    case Status.Failure(t) =>
      log.error(t, "Event stream failed.")
      throw t

    case Done =>
      throw new IllegalStateException("Event stream finished.")
  }

  override def receive: Receive = {
    case msg =>
      log.warning(s"Unexpected msg received: $msg")
      unhandled(msg)
  }
}

class NamespaceDirectorModule extends AbstractModule with AkkaGuiceSupport {
  override def configure() = {
    bindActor[NamespaceDirectorChangedListener]("namespace-director-changed-listener")
  }
}
