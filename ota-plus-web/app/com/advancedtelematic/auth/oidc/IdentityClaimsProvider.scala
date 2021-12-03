package com.advancedtelematic.auth.oidc

import com.advancedtelematic.auth.{AccessToken, IdentityClaims, NoLoginData}
import com.advancedtelematic.controllers.UserId
import play.api.Configuration

import javax.inject.Inject
import scala.concurrent.{ExecutionContext, Future}

trait IdentityClaimsProvider extends (AccessToken => Future[IdentityClaims])

class OidcIdentityClaimsProvider @Inject()(oidcGateway: OidcGateway)(implicit val ec: ExecutionContext)
  extends IdentityClaimsProvider {

  override def apply(token: AccessToken): Future[IdentityClaims] = oidcGateway.getUserInfo(token)

}

class ConfiguredIdentityClaimsProvider @Inject()(conf: Configuration) extends IdentityClaimsProvider {

  private lazy val fakeUser = conf.get[String]("oidc.user")

  override def apply(token: AccessToken): Future[IdentityClaims] =
    Future.successful(IdentityClaims(UserId(fakeUser), NoLoginData.userName, None, NoLoginData.email))
}
