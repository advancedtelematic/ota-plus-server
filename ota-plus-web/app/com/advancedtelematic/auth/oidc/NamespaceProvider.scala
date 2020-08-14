package com.advancedtelematic.auth.oidc

import akka.http.scaladsl.util.FastFuture
import brave.play.{TraceData, ZipkinTraceServiceLike}
import com.advancedtelematic.PlayMessageBusPublisher
import com.advancedtelematic.api.Errors.{OtaUserDoesNotExists, RemoteApiError}
import com.advancedtelematic.api.{ApiClientExec, ApiClientSupport}
import com.advancedtelematic.auth.{AccessToken, Tokens}
import com.advancedtelematic.controllers.RejectedNewUserLogin
import com.advancedtelematic.controllers.UserLogin.rejectedNewUserLoginMsgLike
import com.advancedtelematic.libats.data.DataType.Namespace
import javax.inject.Inject
import play.api.Configuration
import play.api.libs.json.JsValue
import play.api.libs.ws.WSClient

import scala.concurrent.{ExecutionContext, Future}

trait NamespaceProvider extends (Tokens => Future[Namespace])

abstract class AbstractNamespaceProvider @Inject()(val conf: Configuration,
                                                   val ws: WSClient,
                                                   val clientExec: ApiClientExec,
                                                   val oidcGateway: OidcGateway,
                                                   val tracer: ZipkinTraceServiceLike,
                                                  )(implicit ec: ExecutionContext)
  extends NamespaceProvider with ApiClientSupport {

  implicit protected val traceData = TraceData(tracer.tracing.tracer().newTrace())

  private val namespaceFromJson: JsValue => Namespace = json => Namespace((json \ "defaultNamespace").as[String])

  def handleNewUser(accessToken: AccessToken): Future[JsValue]

  override def apply(tokens: Tokens): Future[Namespace] = {
    val userId = tokens.idToken.userId
    userProfileApi
      .getUser(userId)
      .recoverWith {
        case RemoteApiError(result, _) if result.header.status == 404 =>
          handleNewUser(tokens.accessToken)
      }
      .map(namespaceFromJson)
  }
}

class NamespaceFromUserProfile @Inject()(conf: Configuration,
                                         ws: WSClient,
                                         clientExec: ApiClientExec,
                                         oidcGateway: OidcGateway,
                                         tracer: ZipkinTraceServiceLike,
                                        )(implicit ec: ExecutionContext)
  extends AbstractNamespaceProvider(conf, ws, clientExec, oidcGateway, tracer) {

  override def handleNewUser(accessToken: AccessToken): Future[JsValue] =
    oidcGateway
      .getUserInfo(accessToken)
      .flatMap { ic =>
        userProfileApi.createUser(ic.userId, ic.name, ic.email, None)
      }
}

class RejectingNewUsers @Inject()(conf: Configuration,
                                  ws: WSClient,
                                  clientExec: ApiClientExec,
                                  oidcGateway: OidcGateway,
                                  tracer: ZipkinTraceServiceLike,
                                  messageBus: PlayMessageBusPublisher,
                                 )(implicit ec: ExecutionContext)
  extends AbstractNamespaceProvider(conf, ws, clientExec, oidcGateway, tracer) {

  override def handleNewUser(accessToken: AccessToken): Future[JsValue] = {
    oidcGateway
      .getUserInfo(accessToken)
      .map(ic => RejectedNewUserLogin(ic.userId, ic.name, ic.email))
      .foreach(messageBus.publishSafe(_))
    Future.failed(OtaUserDoesNotExists)
  }
}

class ConfiguredNamespace @Inject()(configuration: Configuration) extends NamespaceProvider {
  override def apply(tokens: Tokens): Future[Namespace] = FastFuture.successful {
    Namespace(configuration.get[String]("oidc.namespace"))
  }
}
