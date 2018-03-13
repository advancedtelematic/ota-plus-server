package com.advancedtelematic.controllers

import java.io.FileOutputStream
import java.nio.file.Files
import java.time.Instant
import java.time.temporal.ChronoUnit

import javax.inject.{Inject, Singleton}
import java.util.UUID
import java.util.zip._

import akka.actor.ActorSystem
import akka.http.scaladsl.model.Uri
import akka.stream.ActorMaterializer
import akka.util.ByteString
import com.advancedtelematic.api._
import com.advancedtelematic.auth.{AccessToken, AccessTokenBuilder, ApiAuthAction}
import com.advancedtelematic.libats.data.DataType.Namespace
import com.advancedtelematic.libtuf.data.TufDataType.TufKeyPair
import play.api.Configuration
import play.api.libs.functional.syntax._
import play.api.libs.json.{Json, JsPath, Writes}
import play.api.libs.ws.WSClient
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}

import scala.async.Async.{async, await}
import scala.concurrent.{ExecutionContext, Future}
import scala.util.control.NoStackTrace

object ClientToolController {

  final case class OAuth2Params(
    server: String,
    clientId: String ,
    clientSecret: String)

  final case class AuthParams(
    oauth2: Option[OAuth2Params] = None,
    noAuth: Option[Boolean] = None)

  final case class OSTreeParams(server: String)

  final case class AllParams(auth: AuthParams, ostree: OSTreeParams)

  implicit val oauth2ParamsWrites: Writes[OAuth2Params] = Writes { p =>
    Json.obj(
      "server" -> p.server,
      "client_id" -> p.clientId,
      "client_secret" -> p.clientSecret)
  }

  implicit val authParamsWrites: Writes[AuthParams] = (
    (JsPath \ "oauth2").writeNullable[OAuth2Params] and
    (JsPath \ "no_auth").writeNullable[Boolean]
  )(unlift(AuthParams.unapply))

  implicit val treehubParamsWrites: Writes[OSTreeParams] = Json.writes[OSTreeParams]

  implicit val allParamsWrites: Writes[AllParams] = (
    JsPath.write[AuthParams] and
    (JsPath \ "ostree").write[OSTreeParams]
  ) (unlift(AllParams.unapply))

  final case class AccountNotActivated(accountName: String)
    extends Throwable(s"Account '$accountName' not activated") with NoStackTrace

  final val RepoIdHeader = "x-ats-tuf-repo-id"
  final case class MissingRepoIdHeader()
    extends Throwable(s"Missing header '$RepoIdHeader'") with NoStackTrace
}

@Singleton
class ClientToolController @Inject()(
    val conf: Configuration,
    val ws: WSClient,
    val authAction: ApiAuthAction,
    val clientExec: ApiClientExec,
    tokenBuilder: AccessTokenBuilder,
    components: ControllerComponents)
    (implicit executionContext: ExecutionContext, actorSystem: ActorSystem)
  extends AbstractController(components) with OtaPlusConfig with ApiClientSupport {

  import ClientToolController._

  implicit val materializer: ActorMaterializer = ActorMaterializer()

  val cryptApi = new CryptApi(conf, clientExec)

  def getOAuth2Params(userId: UserId) : Future[AuthParams] = {
    val accessToken = tokenBuilder.mkToken(userId.id, Instant.now().plus(1, ChronoUnit.MINUTES), Set())
    userProfileApi.getFeature(userId, FeatureName("treehub"))
      .flatMap { feat =>
        feat.client_id match {
          case Some(id) => for {
            secret <- authPlusApi.fetchSecret(id, accessToken)
          } yield AuthParams(oauth2 = Some(OAuth2Params(authPlusApiUri, id.toString, secret)))
          case None => Future.successful(AuthParams(noAuth = Some(true)))
        }
      }
  }

  type CredentialsData = ByteString

  def getCryptCredentials(namespace: Namespace, keyUuid: UUID) : Future[(Uri,CredentialsData)] = for {
    accountInfo <- cryptApi.getAccountInfo(namespace.get)
    gatewayUri = cryptApi.getAccountGatewayUri(accountInfo.getOrElse(throw AccountNotActivated(namespace.get)))
    credentials <- cryptApi.downloadCredentials(namespace.get, keyUuid)
    credentialsData <- credentials.consumeData(materializer)
  } yield (gatewayUri, credentialsData)

  type RootJsonData = ByteString

  def getTufRepoCredentials(namespace: Namespace) : Future[(RootJsonData,Seq[TufKeyPair])] = for {
    result <- repoServerApi.rootJsonResult(namespace)
    body <- result.body.consumeData(materializer)
    repoId = if (result.header.status == play.api.http.Status.OK) {
        result.header.headers.getOrElse(RepoIdHeader, throw MissingRepoIdHeader())
      } else {
        throw RemoteApiError(result, s"GET root.json returns error: ${body.toString}")
      }
    targetKeys <- keyServerApi.targetKeys(repoId)
  } yield (body, targetKeys)

  private def writeZip(namespace: Namespace, accessToken: AccessToken, keyUUID: UUID, zip: ZipOutputStream)
    : Future[Unit] = {

    import io.circe.syntax._
    import com.advancedtelematic.libtuf.data.TufCodecs.{tufKeyEncoder, tufPrivateKeyEncoder}

    def writeZipEntry(name: String, data: Array[Byte]): Unit = {
      zip.putNextEntry(new ZipEntry(name))
      zip.write(data)
      zip.closeEntry()
    }

    async {
      if(conf.getOptional[String]("crypt.host").isDefined) {
        val (gatewayUri, credentialsData) = await(getCryptCredentials(namespace, keyUUID))
        writeZipEntry("autoprov.url", gatewayUri.toString.getBytes)
        writeZipEntry("autoprov_credentials.p12", credentialsData.toArray)
      }
      if(conf.getOptional[String]("repo.pub.host").isDefined) {
        val (rootJson, targetKeys) = await(getTufRepoCredentials(namespace))
        writeZipEntry("tufrepo.url", repoPubApiUri.getBytes)
        writeZipEntry("root.json", rootJson.toArray)

        def numberSuffix(i: Int) = if (i > 0) i.toString else ""
        targetKeys.indices.zip(targetKeys).foreach { case (i, pair) =>
          writeZipEntry(s"targets${numberSuffix(i)}.pub", pair.pubkey.asJson.spaces2.getBytes)
          writeZipEntry(s"targets${numberSuffix(i)}.sec", pair.privkey.asJson.spaces2.getBytes)
        }
      }
      val authParams = if(conf.getOptional[String]("authplus.host").isDefined) {
        await(getOAuth2Params(UserId(namespace.get)))
      } else {
        AuthParams(noAuth = Some(true))
      }
      writeZipEntry("treehub.json", Json.prettyPrint(Json.toJson(
        AllParams(authParams, OSTreeParams(treehubPubApiUri)))).getBytes())
    }
  }

  def downloadClientToolBundle(keyUUID: UUID): Action[AnyContent] = authAction.async { implicit request =>
    val dir = Files.createTempDirectory("ota-plus")
    val file = dir.resolve("credentials.zip").toFile
    val zip = new ZipOutputStream(new FileOutputStream(file))

    writeZip(request.namespace, request.accessToken, keyUUID, zip).map { _ =>
      zip.close()
      Ok.sendFile(file, onClose = () => { file.delete() })
    }.recover {
      case t =>
        file.delete()
        throw t
    }
  }

}
