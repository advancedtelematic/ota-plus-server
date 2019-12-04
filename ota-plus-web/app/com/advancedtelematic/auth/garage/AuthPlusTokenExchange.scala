package com.advancedtelematic.auth.garage

import com.advancedtelematic.api.Errors.UnexpectedResponse
import javax.inject.Inject
import com.advancedtelematic.auth.{AccessToken, AuthPlusConfig, TokenExchange, Tokens}
import play.api.Configuration
import play.api.http.{HeaderNames, MimeTypes}
import play.api.libs.json.JsValue
import play.api.libs.ws.{WSAuthScheme, WSClient, WSResponse}
import play.shaded.ahc.org.asynchttpclient.util.HttpConstants.ResponseStatusCodes

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Try}

class AuthPlusTokenExchange @Inject()(conf: Configuration, ws: WSClient)(implicit ec: ExecutionContext)
    extends TokenExchange {
  private[this] val authPlusConfig = AuthPlusConfig(conf).get

  private[this] def extractPayload(response: WSResponse): Try[JsValue] =
    if (response.status != ResponseStatusCodes.OK_200) {
      Failure(UnexpectedResponse(response))
    } else {
      Try(response.json)
    }

  override def run(tokens: Tokens): Future[Tokens] = {

    import play.api.libs.json._
    val payload =
      Map("grant_type" -> Seq("urn:ietf:params:oauth:grant-type:jwt-bearer"),
          "assertion"  -> Seq(tokens.accessToken.value))

    def extractToken(response: WSResponse): Future[AccessToken] = {
      val tokenOrError = extractPayload(response).flatMap { json =>
        val parseResult = json.validate[AccessToken](AccessToken.FromTokenResponseReads)
        JsResult.toTry(parseResult)
      }
      Future.fromTry(tokenOrError)
    }

    val tokensEndpoint = s"${authPlusConfig.uri}/token"
    ws.url(tokensEndpoint)
      .withHttpHeaders(HeaderNames.ACCEPT -> MimeTypes.JSON)
      .withAuth(authPlusConfig.clientId, authPlusConfig.clientSecret, WSAuthScheme.BASIC)
      .post(payload)
      .flatMap(extractToken)
      .map(Tokens(_, tokens.idToken))
  }
}
