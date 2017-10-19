package com.advancedtelematic.auth

import scala.concurrent.Future

trait TokenExchange {
  def run(tokens: Tokens): Future[Tokens]
}

class NoExchange extends TokenExchange {
  override def run(tokens: Tokens): Future[Tokens] = Future.successful(tokens)
}
