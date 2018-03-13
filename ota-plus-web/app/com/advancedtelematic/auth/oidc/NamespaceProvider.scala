package com.advancedtelematic.auth.oidc

import javax.inject.Inject
import com.advancedtelematic.auth.Tokens
import com.advancedtelematic.libats.data.DataType.Namespace
import play.api.Configuration

trait NamespaceProvider extends (Tokens => Namespace)

class NamespaceFromIdentity extends NamespaceProvider {
  override def apply(tokens: Tokens): Namespace = Namespace(tokens.idToken.userId.id)
}

class ConfiguredNamespace @Inject()(configuration: Configuration) extends NamespaceProvider {
  override def apply(tokens: Tokens): Namespace = Namespace(configuration.get[String]("oidc.namespace"))
}