package com.advancedtelematic.auth.garage

import javax.inject.Inject

import com.advancedtelematic.auth.{TokenExchange, Tokens}
import play.api.Configuration
import scala.concurrent.Future

class OidcToFakeJwtTokenExchange @Inject()(conf: Configuration) extends TokenExchange {
  override def run(tokens: Tokens): Future[Tokens] = {
    val jwtSecret = conf.get[String]("authplus.token")

    Future.successful(Tokens(AuthPlusSignature.fakeSignedToken(jwtSecret, tokens.accessToken.value), tokens.idToken))
  }
}
