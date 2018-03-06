package com.advancedtelematic.cache

import com.google.inject.AbstractModule
import play.api.cache.AsyncCacheApi

class ActorBasedCacheModule extends AbstractModule {

  override def configure(): Unit = {
    bind(classOf[AsyncCacheApi]).to(classOf[ActorBackedCache])
  }

}
