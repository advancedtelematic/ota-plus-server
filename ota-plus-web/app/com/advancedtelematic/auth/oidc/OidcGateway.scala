package com.advancedtelematic.auth.oidc

import java.security.PublicKey
import java.util.function.Consumer

import akka.http.scaladsl.model.Uri
import com.advancedtelematic.api.{MalformedResponse, UnexpectedResponse}
import com.advancedtelematic.auth.oidc.OidcConfiguration.Url
import com.advancedtelematic.auth._
import javax.crypto.SecretKey
import javax.inject.{Inject, Singleton}
import org.jose4j.jwa.AlgorithmConstraints
import org.jose4j.jwa.AlgorithmConstraints.ConstraintType
import org.jose4j.jwk.{JsonWebKey, JsonWebKeySet, VerificationJwkSelector}
import org.jose4j.jws.{AlgorithmIdentifiers, JsonWebSignature}
import play.api.cache.AsyncCacheApi
import play.api.http.{HeaderNames, MimeTypes, Status}
import play.api.libs.json._
import play.api.libs.ws.{WSAuthScheme, WSClient, WSResponse}
import play.api.mvc.{Result, Results}
import play.api.{Configuration, Logger}
import play.shaded.ahc.org.asynchttpclient.util.HttpConstants.ResponseStatusCodes

import scala.concurrent.duration.FiniteDuration
import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Try}

final case class ProviderMetadata(issuer: Url,
                                  authzEndpoint: Url,
                                  tokenEndpoint: Url,
                                  jwksUri: Url,
                                  userInfoEndpoint: Url)

object ProviderMetadata {
  def fromConfig(config: Configuration): ProviderMetadata = {
    ProviderMetadata(
      issuer = config.get[String]("issuer"),
      authzEndpoint = config.get[String]("authzEndpoint"),
      tokenEndpoint = config.get[String]("tokenEndpoint"),
      jwksUri = config.get[String]("jwksUri"),
      userInfoEndpoint = config.get[String]("userInfoEndpoint")
    )
  }
}

private[oidc] sealed trait ClientAuthentication
final case object PasswordBasicAuth extends ClientAuthentication
final case object PasswordRequestBody extends ClientAuthentication

object ClientAuthentication {
  def fromString(s: String): ClientAuthentication = s match {
    case "PasswordBasicAuth" => PasswordBasicAuth
    case _                   => PasswordRequestBody
  }
}

private[oidc] case class HereKeyPair(publicKey: PublicKey, secretKey: SecretKey)

object OidcGateway {
  sealed trait GatewayCommand
  final case class Authorize() extends GatewayCommand

  private[OidcGateway] val ProviderMetaKey = "oidc.proivider.configuration"
  private[OidcGateway] val JwksKey         = "oidc.keys"
}

@Singleton
class OidcGateway @Inject()(wsClient: WSClient, config: Configuration, cache: AsyncCacheApi) {
  private[this] val log                   = Logger(this.getClass)
  private[this] val oauthConfig           = OAuthConfig(config)
  private[this] val configurationEndpoint = config.get[String]("oidc.configUrl")
  private[this] val issuerIdentifier      = config.get[String]("oidc.issuer")
  private[this] val staticProviderMeta    = ProviderMetadata.fromConfig(config.get[Configuration]("oidc.fallback"))
  private[this] val metadataTtl           = config.get[FiniteDuration]("oidc.configurationTtl")
  private[this] val jwksTtl               = config.get[FiniteDuration]("oidc.keysTtl")
  private[this] val clientAuthentication  = ClientAuthentication.fromString(
    config.get[String]("oidc.clientAuthentication"))

  def redirectToAuthorize()(implicit executionContext: ExecutionContext): Future[Result] = providerMeta().map { meta =>
    Results.Redirect(
      meta.authzEndpoint,
      Map(
        "response_type" -> Seq("code"),
        "client_id"     -> Seq(oauthConfig.clientId),
        "redirect_uri"  -> Seq(oauthConfig.callbackURL),
        "scope"         -> Seq("openid profile email"),
        "prompt"        -> Seq("login")
      ) ++ oauthConfig.parameters.mapValues(Seq(_)),
      Status.SEE_OTHER
    )
  }

  def providerMeta()(implicit executionContext: ExecutionContext): Future[ProviderMetadata] = {
    cache
      .getOrElseUpdate[ProviderMetadata](OidcGateway.ProviderMetaKey, metadataTtl) {
        OidcConfiguration.load(wsClient, configurationEndpoint, issuerIdentifier, log)
      }
      .recover {
        case t =>
          log.error(
            s"Unable to load configuration of OIDC provider '${configurationEndpoint}', falling back to static one.",
            t
          )
          staticProviderMeta
      }
  }

  private[this] def keysFromConfig(): Option[JsonWebKeySet] = {
    config.get[Option[String]]("oidc.keyset").map(x => new JsonWebKeySet(x))
  }

  private[this] def loadKeys()(implicit executionContext: ExecutionContext): Future[JsonWebKeySet] = {
    def extractKeys(response: WSResponse): Future[JsonWebKeySet] = {
      if (response.status != ResponseStatusCodes.OK_200) {
        Future.failed(UnexpectedResponse(response))
      } else {
        Future.successful(new JsonWebKeySet(response.body))
      }
    }
    for {
      meta     <- providerMeta()
      response <- wsClient.url(meta.jwksUri).get()
      keys     <- extractKeys(response)
    } yield {
      keysFromConfig().foreach { xs =>
        xs.getJsonWebKeys.forEach(new Consumer[JsonWebKey] {
          override def accept(t: JsonWebKey): Unit = keys.addJsonWebKey(t)
        })
      }
      keys
    }
  }

  private[this] def getKeys()(implicit executionContext: ExecutionContext): Future[JsonWebKeySet] = {
    cache.getOrElseUpdate(OidcGateway.JwksKey, jwksTtl) {
      log.info(s"Loading json web keys")
      loadKeys()
    }
  }

  private[this] def verifySignature(
      token: String
  )(implicit executionContext: ExecutionContext): Future[String] = {
    getKeys().flatMap { keys =>
      val verifier = new JsonWebSignature()
      verifier.setAlgorithmConstraints(
        new AlgorithmConstraints(ConstraintType.WHITELIST,
                                 AlgorithmIdentifiers.RSA_USING_SHA512,
                                 AlgorithmIdentifiers.RSA_USING_SHA256)
      )
      verifier.setCompactSerialization(token)
      val keySelector = new VerificationJwkSelector()
      val webKey      = keySelector.select(verifier, keys.getJsonWebKeys)
      verifier.setKey(webKey.getKey)
      if (verifier.verifySignature()) Future.successful(token)
      else Future.failed(new IllegalArgumentException("Signature verification failed"))
    }
  }

  def exchangeCodeForTokens(code: String)(implicit executionContext: ExecutionContext): Future[Tokens] = {
    def verifyToken(lookup: JsLookupResult): Future[String] = {
      lookup.validate[String] match {
        case JsSuccess(x, _) =>
          verifySignature(x)

        case t: JsError =>
          Future.failed(JsResult.Exception(t))
      }
    }
    def extractTokens(response: WSResponse): Future[Tokens] = {
      for {
        json              <- Future.fromTry(extractPayload(response))
        idTokenSerialized <- verifyToken(json \ "id_token")
        idToken           <- Future.fromTry(IdToken.fromCompactSerialization(idTokenSerialized))
        _                 <- verifyToken(json \ "access_token")
        accessToken <- Future.fromTry(
          JsResult.toTry(json.validate[AccessToken](AccessToken.FromTokenResponseReads))
        )
      } yield Tokens(accessToken, idToken)
    }

    val requestBody: Map[String, Seq[String]] = Map(
      "redirect_uri" -> Seq(oauthConfig.callbackURL),
      "code"         -> Seq(code),
      "grant_type"   -> Seq("authorization_code"))

    for {
      provMeta <- providerMeta()
      response <- clientAuthentication match {
        case PasswordBasicAuth => wsClient
          .url(provMeta.tokenEndpoint)
          .withHttpHeaders(HeaderNames.ACCEPT -> MimeTypes.JSON)
          .withHttpHeaders(HeaderNames.CONTENT_TYPE -> MimeTypes.FORM)
          .withAuth(oauthConfig.clientId, oauthConfig.secret, WSAuthScheme.BASIC)
          .post(requestBody)

        case PasswordRequestBody => wsClient
          .url(provMeta.tokenEndpoint)
          .withHttpHeaders(HeaderNames.ACCEPT -> MimeTypes.JSON)
          .withHttpHeaders(HeaderNames.CONTENT_TYPE -> MimeTypes.FORM)
          .post(requestBody ++ Map("client_id"     -> Seq(oauthConfig.clientId),
                                   "client_secret" -> Seq(oauthConfig.secret)))
      }
      tokens <- extractTokens(response)
    } yield tokens
  }

  // format: off
  private[this] implicit val identityClaimsFormat: Format[IdentityClaims] = {
    import play.api.libs.functional.syntax._
    (
      Tokens.subjClaimFormat and
      (JsPath \ "name").format[String] and
      (JsPath \ "picture").formatNullable[String] and
      (JsPath \ "email").format[String]
    )(IdentityClaims.apply, unlift(IdentityClaims.unapply))
  }
  // format: on

  private[this] def extractIdentity(response: WSResponse): Future[IdentityClaims] = {
    Future.fromTry(
      extractPayload(response).flatMap(json => JsResult.toTry(json.validate[IdentityClaims]))
    )
  }

  def getUserInfo(accessToken: AccessToken)(implicit executionContext: ExecutionContext): Future[IdentityClaims] =
    for {
      meta <- providerMeta()
      response <- wsClient
        .url(meta.userInfoEndpoint)
        .withFollowRedirects(false)
        .addHttpHeaders("Authorization" -> s"Bearer ${accessToken.value}")
        .get()
      identity <- extractIdentity(response)
    } yield identity

  private[this] def extractPayload(response: WSResponse): Try[JsValue] =
    if (response.status != ResponseStatusCodes.OK_200) {
      Failure(UnexpectedResponse(response))
    } else {
      Try(response.json)
    }
}

object OidcConfiguration {
  import play.api.libs.json._
  type Url = String

  final case class IssuerMismatchException(expected: Url, received: Url)
      extends Throwable(s"Issuer ${received} in provider metadata does not match expected value ${expected}")

  private[this] implicit val providerMetaReads: Reads[ProviderMetadata] = {
    import play.api.libs.functional.syntax._
    (
      (__ \ "issuer").read[Url] and
        (__ \ "authorization_endpoint").read[Url] and
        (__ \ "token_endpoint").read[Url] and
        (__ \ "jwks_uri").read[Url] and
        (__ \ "userinfo_endpoint").read[Url]
    )(ProviderMetadata.apply _)
  }

  val OidcConfigurationPath = Uri.Path(".well-known/openid-configuration")

  def load(wSClient: WSClient, configUrl: Url, issuerUrl: Url, log: Logger)(
      implicit ec: ExecutionContext
  ): Future[ProviderMetadata] = {
    val root = Uri(configUrl)
    val path = if (root.path.endsWithSlash) root.path else root.path ++ Uri.Path("/")
    val uri  = root.withPath(path ++ OidcConfigurationPath)
    log.info(s"Loading OIDC provider configuration from ${uri}")
    wSClient.url(uri.toString()).withFollowRedirects(true).get().flatMap { response =>
      response.status match {
        case ResponseStatusCodes.OK_200 =>
          response.json.validate[ProviderMetadata] match {
            case JsSuccess(x, _) if x.issuer == issuerUrl =>
              log.info(s"Configuration of '${issuerUrl}' from ${uri}: ${x}")
              Future.successful(x)

            case JsSuccess(x, _) =>
              Future.failed(IssuerMismatchException(issuerUrl, x.issuer))

            case JsError(errors) =>
              Future.failed(MalformedResponse(errors.toString(), response))
          }

        case _ =>
          Future.failed(UnexpectedResponse(response))
      }
    }
  }

}
