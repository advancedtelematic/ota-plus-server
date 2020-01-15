package com.advancedtelematic.auth.oidc

import akka.http.scaladsl.util.FastFuture
import brave.play.{TraceData, ZipkinTraceServiceLike}
import com.advancedtelematic.api.Errors.RemoteApiError
import com.advancedtelematic.api.{ApiClientExec, ApiClientSupport}
import com.advancedtelematic.auth.{AccessToken, Tokens}
import com.advancedtelematic.controllers.UserId
import com.advancedtelematic.libats.data.DataType.Namespace
import javax.inject.Inject
import play.api.Configuration
import play.api.libs.json.JsValue
import play.api.libs.ws.WSClient

import scala.concurrent.{ExecutionContext, Future}

trait NamespaceProvider extends (Tokens => Future[Namespace])

class NamespaceFromIdentity extends NamespaceProvider {
  override def apply(tokens: Tokens): Future[Namespace] = FastFuture.successful{
    Namespace(tokens.idToken.userId.id)
  }
}

class NamespaceFromUserProfile @Inject()(val conf: Configuration,
                                         val ws: WSClient,
                                         val clientExec: ApiClientExec,
                                         val oidcGateway: OidcGateway,
                                         val tracer: ZipkinTraceServiceLike)
                                        (implicit ec: ExecutionContext)
  extends NamespaceProvider with ApiClientSupport {

  implicit private val traceData = TraceData(tracer.tracing.tracer().newTrace())

  private val namespaceFromJson: JsValue => Namespace = json => Namespace((json \ "defaultNamespace").as[String])

  private def createUser(accessToken: AccessToken, userId: UserId) =
    oidcGateway
      .getUserInfo(accessToken)
      .flatMap { ic =>
        userProfileApi.createUser(userId, ic.name, ic.email, None)
      }

  override def apply(tokens: Tokens): Future[Namespace] = {
    val userId = tokens.idToken.userId
    userProfileApi
      .getUser(userId)
      .recoverWith {
        case RemoteApiError(result, _) if result.header.status == 404 =>
          createUser(tokens.accessToken, userId)
      }
      .map(namespaceFromJson)
  }
}


class ConfiguredNamespace @Inject()(configuration: Configuration) extends NamespaceProvider {
  override def apply(tokens: Tokens): Future[Namespace] = FastFuture.successful {
    Namespace(configuration.get[String]("oidc.namespace"))
  }
}
