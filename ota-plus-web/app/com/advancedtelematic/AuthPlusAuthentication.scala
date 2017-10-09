package com.advancedtelematic

import play.api.Configuration
import play.api.libs.ws.{WSAuthScheme, WSClient, WSResponse}
import play.api.mvc.{ActionBuilder, ActionBuilderImpl, AnyContent, BodyParsers, Request, Result, Results}
import play.shaded.ahc.org.asynchttpclient.uri.Uri
import play.shaded.ahc.org.asynchttpclient.util.HttpConstants.ResponseStatusCodes

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}
import javax.inject.Inject



final case class AuthPlusConfig(uri: Uri, clientId: String, clientSecret: String, tokenVerify: Boolean)
object AuthPlusConfig {
  def apply(conf: Configuration): Option[AuthPlusConfig] = {
    for {
      _conf        <- conf.get[Option[Configuration]]("authplus")
      clientId     <- _conf.get[Option[String]]("client_id")
      clientSecret <- _conf.get[Option[String]]("secret")
      authPlusUri <- _conf.get[Option[String]]("uri").map(Uri.create)
      tokenVerify  <- _conf.get[Option[Boolean]]("token_verify")
    } yield AuthPlusConfig(authPlusUri, clientId, clientSecret, tokenVerify)
  }
}


object AuthPlusAuthentication {

  class AuthenticatedApiAction @Inject()(conf: Configuration, wsClient: WSClient, val parser: BodyParsers.Default)
                                        (implicit val executionContext: ExecutionContext)
    extends ActionBuilder[AuthenticatedRequest, AnyContent] {

    private[this] val authPlusConfig = AuthPlusConfig(conf).get

    def isTokenActive(token: AuthPlusAccessToken) : Future[Boolean] = {
      // Token is inactive iff auth-plus succesfully says so
      wsClient.url(s"${authPlusConfig.uri}/introspect")
        .withAuth(authPlusConfig.clientId, authPlusConfig.clientSecret, WSAuthScheme.BASIC)
        .post(Map("token" -> Seq(token.value)))
        .map { resp => resp.status match {
          case ResponseStatusCodes.OK_200 => (resp.json \ "active").asOpt[Boolean].getOrElse(true)
          case _ => true
        }
        }.recover {
        case _ => true
      }
    }
    def invokeBlockIfActive[A](req: AuthenticatedRequest[A], block: (AuthenticatedRequest[A]) => Future[Result])
    : Future[Result] = {
      isTokenActive(req.authPlusAccessToken) flatMap { active =>
        if (active) {
          block(req)
        } else {
          Future.successful(Results.Forbidden("Token has been revoked"))
        }
      }
    }

    import cats.syntax.either._
    def invokeBlock[A](request: Request[A], block: (AuthenticatedRequest[A]) => Future[Result]): Future[Result] = {
      AuthenticatedRequest.fromRequest(request)
        .map(req =>
            if (authPlusConfig.tokenVerify) {
              invokeBlockIfActive(req, block)
            } else {
              block(req)
            }
          )
        .getOrElse(Future.successful(Results.Forbidden("Not authenticated")))
    }
  }
}
