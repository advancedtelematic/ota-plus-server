package com.advancedtelematic.login

import akka.NotUsed
import org.genivi.sota.data.Namespace
import com.advancedtelematic.AuthenticatedAction
import com.advancedtelematic.api.{UnexpectedResponse, MalformedResponse}
import com.advancedtelematic.{AuthPlusAccessToken, Auth0AccessToken, JwtAssertion, IdToken}
import com.advancedtelematic.api.AuthPlusApi
import javax.inject.{Inject, Singleton}

import com.advancedtelematic.api.ApiClientExec
import org.asynchttpclient.uri.Uri
import org.asynchttpclient.util.HttpConstants.ResponseStatusCodes
import play.api.Logger
import play.api.http.{HeaderNames, MimeTypes}
import play.api.libs.json.{JsValue, Json}
import play.api.Configuration
import play.api.i18n.{I18nSupport, MessagesApi}
import play.api.libs.ws.{WSAuthScheme, WSClient, WSResponse}
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{ Failure, Success, Try }

final case class LoginData(username: String, password: String)

final case class UnexpectedToken(token: IdToken, msg: String) extends Throwable {
  override def getMessage: String =
    s"Cannot parse namespace from token: '${token.value}', '${msg}'"
}

/**
  * Handles just login/authentication
  */
@Singleton
class LoginController @Inject()(conf: Configuration, val messagesApi: MessagesApi, wsClient: WSClient)(
    implicit context: ExecutionContext)
    extends Controller
    with I18nSupport {

  import com.advancedtelematic.logging.OtaLogTreeSyntax._
  import scalaz.syntax.id._
  import scalaz.syntax.either._
  import scalaz.syntax.show._
  import scalaz.\/

  private val token_key = "access_token"

  private[this] val authPlusConfig = AuthPlusConfig(conf).get

  private[this] val auth0Config = Auth0Config(conf).get

  private[this] val log = Logger(this.getClass)

  val login: Action[AnyContent] = Action { implicit req =>
    Ok(views.html.login(auth0Config))
  }

  def logout: Action[AnyContent] = AuthenticatedAction { implicit req =>
    wsClient.url(s"${authPlusConfig.uri}/revoke")
      .withAuth(authPlusConfig.clientId, authPlusConfig.clientSecret, WSAuthScheme.BASIC)
      .post(Map("token" -> Seq(req.authPlusAccessToken.value)))
      .onComplete {
        case Success(response) if response.status == ResponseStatusCodes.OK_200 => 
          log.debug(s"Access token '${req.authPlusAccessToken.value}' revoked.")

        case Success(response) =>
          log.error(s"Revocation request for token '${req.authPlusAccessToken.value}' failed with response ${response}")

      case Failure(t) =>
        log.error(s"Revocation request for token '${req.authPlusAccessToken.value}' failed.", t)
      }
    Redirect(org.genivi.webserver.controllers.routes.Application.index()).withNewSession
  }

  val authorizationError: Action[AnyContent] = Action { implicit request =>
    Unauthorized(views.html.authorizationError())
  }

  val accountActivated: Action[AnyContent] = Action {
    Ok(views.html.activated())
  }

  def authorizationFailed(error: String, errorDescription: String): Result = {
    Redirect(routes.LoginController.authorizationError()).flashing("authzError" -> errorDescription)
  }

  private[this] def exchangeIdTokenForAssertion(idToken: IdToken): AsyncDescribedComputation[JwtAssertion] = {
    def processResponse(response: WSResponse): DescribedComputation[JwtAssertion] =
      for {
        _    <- checkStatusOk(response)
        json <- \/.fromTryCatchNonFatal { response.json } ~>? "Parse response to json"
        token <- (json \ "id_token")
                  .asOpt[String]
                  .map(JwtAssertion.apply) ~>? "Read assertion (id_token) from response"
      } yield token

    val computation = for {
      endpoint <- s"https://${auth0Config.domain}/delegation" ~> ("Endpoint: " + _) |> AsyncDescribedComputation.lift
      response <- wsClient
                   .url(endpoint)
                   .post(
                       Json.obj("client_id"  -> auth0Config.clientId,
                                "grant_type" -> "urn:ietf:params:oauth:grant-type:jwt-bearer",
                                "id_token"   -> idToken.value,
                                "target"     -> auth0Config.authPlusClientId,
                                "scope"      -> "openid",
                                "api_type"   -> "app"))
                   .describe("Send request.")
      token <- processResponse(response) |> AsyncDescribedComputation.lift
    } yield token
    computation.run.map("Exchenge id_token for jwt assertion" ~< _) |> AsyncDescribedComputation.apply
  }

  val callback: Action[AnyContent] = Action.async { request =>
    request
      .getQueryString("error")
      .map[Future[Result]] { errorCode =>
        request
          .getQueryString("error_description")
          .map(authorizationFailed(errorCode, _))
          .getOrElse(Redirect(routes.LoginController.login())) |> Future.successful
      }
      .getOrElse {
        val tokens: AsyncDescribedComputation[(IdToken, Auth0AccessToken, AuthPlusAccessToken, Namespace)] = for {
          code <- AsyncDescribedComputation.lift(
                     request
                       .getQueryString("code")
                       .~>?("No authorization code in request", "Authorization code: " + _))
          tokens <- getAuth0Tokens(code)
          (idToken, accessToken) = tokens
          assertion           <- exchangeIdTokenForAssertion(idToken)
          authPlusAccessToken <- requestAuthPlusAccessToken(assertion)
          ns <- extractNsFromToken(idToken) |> AsyncDescribedComputation.lift
        } yield (idToken, accessToken, authPlusAccessToken, ns)

        tokens.run
          .map("Processing authorization callback" ~< _)
          .foreach(computation => log.info(computation.run.written.shows))


        tokens.run.map(_.fold[Result](_ => Redirect(routes.LoginController.login()), {
          case (idToken, auth0AccessToken, authPlusAccessToken, ns) =>
            Redirect(org.genivi.webserver.controllers.routes.Application.index()).withSession(
                "namespace"              -> ns.get,
                "id_token"               -> idToken.value,
                "access_token"           -> auth0AccessToken.value,
                "auth_plus_access_token" -> authPlusAccessToken.value
            )
        }).value)
      }
  }

  def getAuth0Tokens(code: String): AsyncDescribedComputation[(IdToken, Auth0AccessToken)] = {
    import scalaz.syntax.either._
    def extractTokens(response: WSResponse): DescribedComputation[(IdToken, Auth0AccessToken)] =
      for {
        status  <- checkStatusOk(response)
        json    <- \/.fromTryCatchNonFatal { response.json } ~>? "Parse response to json"
        idToken <- (json \ "id_token").asOpt[String].map(IdToken.apply) ~>? "Read id_token from response"
        accessToken <- (response.json \ "access_token")
                        .asOpt[String]
                        .map(Auth0AccessToken.apply) ~>? "Read access token from response"
      } yield (idToken, accessToken)

    val tokensCalculation = for {
      tokenEndpoint <- AsyncDescribedComputation.lift(
                          s"https://${auth0Config.domain}/oauth/token" ~> ("Token endpoint " + _))
      response <- wsClient
                   .url(tokenEndpoint)
                   .withHeaders(HeaderNames.ACCEPT -> MimeTypes.JSON)
                   .post(
                       Json.obj(
                           "client_id"     -> auth0Config.clientId,
                           "client_secret" -> auth0Config.secret,
                           "redirect_uri"  -> auth0Config.callbackURL,
                           "code"          -> code,
                           "grant_type"    -> "authorization_code"
                       ))
                   .describe("Request token")
      tokens <- extractTokens(response) |> AsyncDescribedComputation.lift
    } yield tokens
    tokensCalculation.run.map("Request tokens from Auth0" ~< _) |> AsyncDescribedComputation.apply
  }

  private[this] def checkStatusOk(response: WSResponse): DescribedComputation[Int] =
    response.status.right
      .ensure(s"Unexpected response status: ${response.status}")(_ == ResponseStatusCodes.OK_200)
      .fold(failure(_) ~~ UnexpectedResponse(response), success(_, "Response status is OK"))

  import com.advancedtelematic.logging.OtaLogTreeSyntax._
  def requestAuthPlusAccessToken(assertion: JwtAssertion): AsyncDescribedComputation[AuthPlusAccessToken] = {
    import play.api.libs.json._
    import play.api.libs.functional.syntax._
    import scalaz.syntax.id._
    val payload =
      Map("grant_type" -> Seq("urn:ietf:params:oauth:grant-type:jwt-bearer"), "assertion" -> Seq(assertion.value))

    def extractToken(response: WSResponse): DescribedComputation[AuthPlusAccessToken] =
      for {
        status <- checkStatusOk(response)
        accessToken <- (response.json \ "access_token")
                        .asOpt[String]
                        .map(AuthPlusAccessToken.apply) ~>? "Read access token from response"
      } yield accessToken

    val tokensEndpoint = s"${authPlusConfig.uri}/token"
    (for {
      response <- wsClient
                   .url(tokensEndpoint)
                   .withHeaders(HeaderNames.ACCEPT -> MimeTypes.JSON)
                   .withAuth(authPlusConfig.clientId, authPlusConfig.clientSecret, WSAuthScheme.BASIC)
                   .post(payload)
                   .describe(s"Send request to $tokensEndpoint")
      accessToken <- extractToken(response) |> AsyncDescribedComputation.lift
    } yield accessToken).run.map("Request access token from Auth+" ~< _) |> AsyncDescribedComputation.apply
  }

  import org.genivi.sota.http.{IdToken => IdTokenSub, NsFromToken}
  private[this] def extractNsFromToken(token: IdToken)
    (implicit nsFromToken: NsFromToken[IdTokenSub]) : DescribedComputation[Namespace] = {

    import cats.data.Xor
    NsFromToken.parseToken(token.value) match {
      case Xor.Right(t) => success(Namespace(nsFromToken.namespace(t)), "Extracted namspace")
      case Xor.Left(msg) => failure(msg) ~~ UnexpectedToken(token, msg)
    }
  }

}

final case class Auth0Config(secret: String,
                             clientId: String,
                             callbackURL: String,
                             domain: String,
                             authPlusClientId: String,
                             dbConnection: String)
object Auth0Config {
  def apply(configuration: Configuration): Option[Auth0Config] = {
    for {
      clientSecret     <- configuration.getString("auth0.clientSecret")
      clientId         <- configuration.getString("auth0.clientId")
      callbackUrl      <- configuration.getString("auth0.callbackURL")
      domain           <- configuration.getString("auth0.domain")
      authPlusClientId <- configuration.getString("auth0.authPlusClientId")
      dbConnection     <- configuration.getString("auth0.dbConnection")
    } yield Auth0Config(clientSecret, clientId, callbackUrl, domain, authPlusClientId, dbConnection)
  }
}

final case class AuthPlusConfig(uri: Uri, clientId: String, clientSecret: String)
object AuthPlusConfig {
  def apply(conf: Configuration): Option[AuthPlusConfig] = {
    for {
      _conf        <- conf.getConfig("authplus")
      clientId     <- _conf.getString("client_id")
      clientSecret <- _conf.getString("secret")
      authPlusHost <- _conf.getString("host").map(Uri.create)
    } yield AuthPlusConfig(authPlusHost, clientId, clientSecret)
  }
}
