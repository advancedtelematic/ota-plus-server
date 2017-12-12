package com.advancedtelematic.controllers

import java.io.FileOutputStream
import java.nio.file.Files
import javax.inject.{Inject, Singleton}
import java.util.UUID
import java.util.zip._

import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import com.advancedtelematic.api._
import com.advancedtelematic.auth.{AccessToken, ApiAuthAction, AuthenticatedRequest}
import com.advancedtelematic.libtuf.data.TufDataType.{EdKeyType, EdTufKeyPair, RSATufKeyPair, RsaKeyType, TufKeyPair}
import play.api.Configuration
import play.api.http.{HeaderNames, HttpEntity}
import play.api.libs.json.{JsValue, Json, Writes}
import play.api.libs.ws.WSClient
import play.api.mvc._

import scala.async.Async.{async, await}
import scala.concurrent.{ExecutionContext, Future}
import scala.util.Success

object ClientToolController {

  final case class OAuth2Params(
    server: String,
    clientId: Option[String] = None,
    clientSecret: Option[String] = None)
  final case class OSTreeParams(server: String)
  final case class AllParams(oauth2: OAuth2Params, treehub: OSTreeParams)

  implicit val oauth2ParamsWrites: Writes[OAuth2Params] = Writes { p =>
    Json.obj(
      "server" -> p.server,
      // Note: The Garage-Push tool will not authenticate when `client_id` is empty,
      // but it requires the field for parsing.
      "client_id" -> p.clientId.getOrElse[String](""),
      "client_secret" -> p.clientSecret.getOrElse[String](""))
  }
  implicit val treehubParamsWrites: Writes[OSTreeParams] = Writes { p =>
    Json.obj("server" -> p.server)
  }
  implicit val allParamsWrites: Writes[AllParams] = Writes { p =>
    Json.obj("oauth2" -> p.oauth2, "ostree" -> p.treehub)
  }
}

@Singleton
class ClientToolController @Inject()(
    val conf: Configuration,
    val ws: WSClient,
    val authAction: ApiAuthAction,
    val clientExec: ApiClientExec,
    components: ControllerComponents)
    (implicit executionContext: ExecutionContext, actorSystem: ActorSystem)
  extends AbstractController(components) with OtaPlusConfig with ApiClientSupport {

  import ClientToolController._

  val cryptApi = new CryptApi(conf, clientExec)

  def accountName(request: AuthenticatedRequest[_]): String = request.namespace.get

  def getAuthParams(userId: UserId, token: AccessToken) : Future[OAuth2Params] =
    userProfileApi.getFeature(userId, FeatureName("treehub"))
      .map { _.client_id }
      .recover { case RemoteApiError(r, _) if (r.header.status == 404) => None }
      .flatMap { client_id =>
        client_id match {
          case Some(id) => for {
            secret <- authPlusApi.fetchSecret(id.toJava, token)
          } yield OAuth2Params(authPlusApiUri, Some(id.underlying.value), Some(secret))
          case None => Future.successful(OAuth2Params(authPlusApiUri))
        }
      }

  private def numberSuffix(i: Int) =
    if (i > 0) i.toString else ""


  private def writeZip(request: AuthenticatedRequest[AnyContent], keyUUID: UUID, zip: ZipOutputStream): Future[Unit] = {
    import io.circe.syntax._
    import com.advancedtelematic.libtuf.data.TufCodecs.{tufKeyEncoder, tufPrivateKeyEncoder}

    implicit val materializer: ActorMaterializer = ActorMaterializer()

    def writeZipEntry(name: String, data: Array[Byte]): Unit = {
      zip.putNextEntry(new ZipEntry(name))
      zip.write(data)
      zip.closeEntry()
    }

    writeZipEntry("tufrepo.url", repoPubApiUri.getBytes)

    async {
      val accountInfo = await(cryptApi.getAccountInfo(accountName(request))).getOrElse(
        throw new Exception("Couldn't get account info"))

      writeZipEntry("autoprov.url", cryptApi.getAccountGatewayUri(accountInfo).toString.getBytes)

      val credentials = await(cryptApi.downloadCredentials(accountName(request), keyUUID))
      val data = await(credentials.consumeData(materializer))
      writeZipEntry("autoprov_credentials.p12", data.toArray)

      val rootJsonResult = await(repoServerApi.rootJsonResult(request.namespace))
      val repoId = rootJsonResult.header.headers.getOrElse("x-ats-tuf-repo-id",
        throw RemoteApiError(rootJsonResult, "error downloading root.json: missing repo id header"))

      val rootJsonBody = await(rootJsonResult.body.consumeData(materializer))

      if (rootJsonResult.header.status >= 400) {
        throw RemoteApiError(rootJsonResult, s"error downloading root.json: ${rootJsonBody.toString}")
      }

      writeZipEntry("root.json", rootJsonBody.toArray)

      val keyPairs = await(keyServerApi.targetKeys(repoId))
      keyPairs.indices.zip(keyPairs).foreach { case (i, pair) =>
        writeZipEntry(s"targets${numberSuffix(i)}.pub", pair.pubkey.asJson.spaces2.getBytes)
        writeZipEntry(s"targets${numberSuffix(i)}.sec", pair.privkey.asJson.spaces2.getBytes)
      }

      val authParams = await(getAuthParams(request.idToken.claims.userId, request.accessToken))
      writeZipEntry("treehub.json", Json.prettyPrint(Json.toJson(
        AllParams(authParams, OSTreeParams(treehubPubApiUri)))).getBytes())
    }
  }

  def downloadClientToolBundle(keyUUID: UUID): Action[AnyContent] = authAction.async { implicit request =>
    val d = Files.createTempDirectory("ota-plus")
    val f = d.resolve("credentials.zip").toFile

    val zip = new ZipOutputStream(new FileOutputStream(f))
    writeZip(request, keyUUID, zip).map { _ =>
      zip.close()
      Ok.sendFile(f, onClose = () => { f.delete() })
    }.recover {
      case t =>
        f.delete()
        throw t
    }
  }

}
