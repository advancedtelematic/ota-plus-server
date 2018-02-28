package com.advancedtelematic.cache

import java.util.concurrent.TimeUnit

import _root_.akka.Done
import akka.actor.{Actor, ActorRef, ActorSystem, Cancellable, Props}
import akka.util.Timeout
import com.advancedtelematic.cache.Cache.Get
import com.advancedtelematic.cache.Cache.CacheActor.CacheEntry
import javax.inject.Inject
import play.api.cache.AsyncCacheApi

import scala.concurrent.{ExecutionContext, Future}
import scala.concurrent.duration.{Duration, FiniteDuration}
import scala.reflect.ClassTag
import scala.collection.mutable.{Map => MutableMap}

class ActorBackedCache @Inject() (actorSystem: ActorSystem, executionContext: ExecutionContext) extends AsyncCacheApi {
  import akka.pattern.ask
  private[this] val actorRef: ActorRef = actorSystem.actorOf(Props(new Cache.CacheActor), "cache")
  private[this] implicit val askTimeout: Timeout = FiniteDuration(1, TimeUnit.SECONDS)
  override def set(key: String, value: Any, expiration: Duration): Future[Done] = {
      actorRef.ask(Cache.Set(key, value, FiniteDuration(expiration.length, expiration.unit))).mapTo[Done]
  }

  override def remove(key: String): Future[Done] = {
    actorRef.ask(Cache.Remove(key)).mapTo[Done]
  }

  override def getOrElseUpdate[A](key: String, expiration: Duration)(orElse: => Future[A])(
      implicit classTag: ClassTag[A]
  ): Future[A] = {
    implicit val executor = executionContext
    get(key).flatMap {
      case Some(value) =>
        Future.successful(value)

      case None =>
        orElse.flatMap[A](x => set(key, x, expiration).map(_ => x))
    }
  }

  override def get[T](key: String)(implicit classTag: ClassTag[T]): Future[Option[T]] = {
    actorRef.ask(Get(key)).mapTo[Option[T]]
  }

  override def removeAll(): Future[Done] = {
    actorRef.ask(Cache.RemoveAll).mapTo[Done]
  }
}

object Cache {
  sealed trait CacheCommand
  final case class Set(key: String, value: Any, expiration: FiniteDuration) extends CacheCommand
  final case class Remove(key: String) extends CacheCommand
  final case class Get[T: ClassTag](key: String)
  final object RemoveAll
  private[cache] final case class Evict(key: String) extends CacheCommand

  object CacheActor {
    final case class CacheEntry(value: Any, timer: Option[Cancellable])
  }

  class CacheActor extends Actor {

    private[this] val data: MutableMap[String, CacheEntry] = MutableMap.empty

    private[this] implicit val executor = context.dispatcher

    override def receive: Receive = {
      case Set(key, value, expiration) =>
        val timer = if( expiration.isFinite() ) {
          val ttl = FiniteDuration(expiration.length, expiration.unit)
          Some(context.system.scheduler.scheduleOnce(ttl, self, Evict(key)))
        }
        else None
        data += (key -> CacheEntry(value, timer))
        sender ! Done

      case Get(key) =>
        sender ! data.get(key).map(_.value)

      case Remove(key) =>
        data.remove(key).foreach(x => x.timer.foreach(_.cancel()))
        sender ! Done

      case Evict(key) =>
        data.remove(key)

      case RemoveAll =>
        data.clear()
    }
  }
}