package com.advancedtelematic.controllers

import java.io.FileOutputStream
import java.nio.file.Files
import javax.inject.{Inject, Singleton}
import java.time.{LocalDate, ZoneOffset, ZonedDateTime}
import java.time.temporal.ChronoUnit
import java.util.UUID
import java.util.zip._

import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import com.advancedtelematic.api._
import com.advancedtelematic.auth.{ApiAuthAction, AuthenticatedRequest}
import com.advancedtelematic.libtuf.data.TufDataType.{EdKeyType, EdTufKeyPair, RSATufKeyPair, RsaKeyType, TufKeyPair}
import org.genivi.sota.data.Uuid
import play.api.Configuration
import play.api.http.{HeaderNames, HttpEntity}
import play.api.libs.json.{JsValue, Json}
import play.api.libs.ws.WSClient
import play.api.mvc._

import scala.async.Async.{async, await}
import scala.concurrent.ExecutionContext

@Singleton
class ProvisioningController @Inject()(val conf: Configuration, val ws: WSClient, val authAction: ApiAuthAction,
                                       val clientExec: ApiClientExec,
                                       components: ControllerComponents)(
    implicit executionContext: ExecutionContext, actorSystem: ActorSystem)
    extends AbstractController(components) with OtaPlusConfig with ApiClientSupport {

  val gatewayPort = conf.get[Option[Int]]("crypt.gateway.port").getOrElse(8000)

  val cryptApi = new CryptApi(conf, clientExec)

  def accountName(request: AuthenticatedRequest[_]): String = request.idToken.claims.userId.id

  val provisioningStatus: Action[AnyContent] = authAction.async { implicit request =>
    cryptApi.getAccountInfo(accountName(request)).map(x => Ok(Json.obj("active" -> x.isDefined)))
  }

  val activateAutoProvisioning: Action[AnyContent] = authAction.async { implicit request =>
    cryptApi.registerAccount(accountName(request)).map(x => Ok(Json.toJson(x)))
  }

  val provisioningInfo: Action[AnyContent] = authAction.async { implicit request =>
    cryptApi.getAccountInfo(accountName(request)).map {
      case Some(x) => Ok(Json.obj(
        "hostName" -> x.hostName.toString,
        "uri" -> s"https://${x.hostName}:$gatewayPort",
        "subject" -> x.name))
      case None    => NotFound
    }
  }

  val getCredentials: Action[AnyContent] = authAction.async { implicit request =>
    cryptApi.getCredentials(accountName(request)).map {
      case Some(x) => Ok(Json.toJson(x))
      case None    => NotFound
    }
  }

  val credentialsRegistration: Action[JsValue] =
    authAction.async(parse.json) { implicit request =>
      val description = (request.body \ "description").as[String]
      val until = (request.body \ "until").as[LocalDate]
      val now = ZonedDateTime.now(ZoneOffset.UTC)

      // until is is inclusive so we plus 1 day
      val untilDate = until.plusDays(1).atStartOfDay(ZoneOffset.UTC)
      val ttl = ChronoUnit.HOURS.between(now, untilDate) + 1 // between gives us how many whole hours fit
                                                             // we add one more to guarantee to reach untilDate

      cryptApi.credentialsRegistration(accountName(request), description, ttl).map(x =>
        Ok(Json.toJson(x))
      )
    }

  def downloadCredentials(uuid: Uuid): Action[AnyContent] = authAction.async { implicit request =>
    cryptApi.downloadCredentials(accountName(request), uuid.toJava).map { source =>
        Ok.sendEntity(HttpEntity.Streamed(source, None, Some("application/x-pkcs12")))
          .withHeaders(HeaderNames.CONTENT_DISPOSITION -> "attachment; filename=credentials.p12")
    }
  }

  private def numberSuffix(i: Int) =
    if (i > 0) i.toString else ""


  def downloadCredentialArchive(keyUUID: UUID): Action[AnyContent] = authAction.async { implicit request =>
    implicit val materializer: ActorMaterializer = ActorMaterializer()
    async {
      val d = Files.createTempDirectory("ota-plus")
      val f = d.resolve("credentials.zip").toFile
      val zip = new ZipOutputStream(new FileOutputStream(f))

      def writeZipEntry(name: String, data: Array[Byte]): Unit = {
        zip.putNextEntry(new ZipEntry(name))
        zip.write(data)
        zip.closeEntry()
      }

      writeZipEntry("tufrepo.url", repoApiUri.getBytes)

      val accountInfoO = await(cryptApi.getAccountInfo(accountName(request)))
      accountInfoO.foreach { accountInfo =>
        writeZipEntry("autoprov.url", s"https://${accountInfo.hostName}:$gatewayPort".getBytes)
      }

      val credentials = await(cryptApi.downloadCredentialsEntity(accountName(request), keyUUID))
      val data = await(credentials.consumeData(materializer))
      writeZipEntry("autoprov_credentials.p12", data.toArray)

      val rootJsonResult = await(repoServerApi.rootJsonResult)
      val repoId = rootJsonResult.header.headers.get("x-ats-tuf-repo-id")
      val rootJsonData = await(rootJsonResult.body.consumeData(materializer))
      writeZipEntry("root.json", rootJsonData.toArray)

      // can't use a foreach here because of await
      if (repoId.isDefined) {
        import io.circe.syntax._
        import com.advancedtelematic.libtuf.data.TufCodecs.{tufKeyEncoder, tufPrivateKeyEncoder}

        val keyPairs = await(keyServerApi.targetKeys(repoId.get))
        keyPairs.indices.zip(keyPairs).foreach { case (i, pair) =>
          writeZipEntry(s"targets${numberSuffix(i)}.pub", pair.pubkey.asJson.spaces2.getBytes)
          writeZipEntry(s"targets${numberSuffix(i)}.sec", pair.privkey.asJson.spaces2.getBytes)
        }
      }

      val treehubResult = await(getFeatureConfig(FeatureName("treehub"), request.idToken.claims.userId,
                                                                         request.accessToken))
      val treehubData = await(treehubResult.body.consumeData(materializer))
      writeZipEntry("treehub.json", treehubData.toArray)
      zip.close()

      Ok.sendFile(f, onClose = () => { f.delete() })
    }
  }

}
