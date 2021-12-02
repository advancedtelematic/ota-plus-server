package com.advancedtelematic.auth.oidc

import com.advancedtelematic.auth.TokenExchange
import play.api.{Configuration, Environment}
import play.api.inject.{Binding, Module}

import scala.reflect.ClassTag

class OidcModule extends Module {
  override def bindings(environment: Environment,
                        configuration: Configuration): Seq[Binding[_]] = {
    def bindToClass[T : ClassTag](path: String): Binding[T] = {
      val clazz = environment.classLoader.loadClass(configuration.get[String](path)).asInstanceOf[Class[T]]
      bind[T].to(clazz)
    }
    Seq(
      bindToClass[com.advancedtelematic.auth.LoginAction]("oidc.loginAction"),
      bindToClass[com.advancedtelematic.auth.LogoutAction]("oidc.logoutAction"),
      bindToClass[TokenExchange]("oidc.tokenExchange"),
      bindToClass[NamespaceProvider]("oidc.namespaceProvider"),
      bindToClass[IdentityClaimsProvider]("oidc.identityClaimsProvider")
    )
  }
}
