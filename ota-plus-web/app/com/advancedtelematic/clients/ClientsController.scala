package com.advancedtelematic.clients

import akka.actor.ActorSystem
import cats.data.Xor
import javax.inject.{Inject, Singleton}

import com.advancedtelematic.{AuthPlusAuthentication, IdToken}
import com.advancedtelematic.api.{ApiClientExec, ApiClientSupport}
import org.genivi.sota.data.{Namespace, Uuid}

import play.api.{Configuration, Logger}
import play.api.libs.json._
import play.api.libs.ws.WSClient
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success, Try}

@Singleton
class ClientsController @Inject() (
  system: ActorSystem,
  val ws: WSClient,
  val conf: Configuration,
  val authAction: AuthPlusAuthentication,
  val clientExec: ApiClientExec)
  (implicit context: ExecutionContext)
extends Controller with ApiClientSupport {

  val logger = Logger(this.getClass)

  val metadata_key = "client_ids"

  import com.advancedtelematic.ota.device.Devices._

  def getClientIds(ns: Namespace, idToken: IdToken) : Future[Seq[Uuid]] = {
    auth0Api.getUserMetadata(ns.get, idToken, metadata_key) map { value =>
      value.as[Seq[Uuid]]
    } recover {
      case e: java.util.NoSuchElementException => Seq.empty
    }
  }

  def addClientId(ns: Namespace, idToken: IdToken, clientId: Uuid) : Future[Seq[Uuid]] = {
    for {
      ids <- getClientIds(ns, idToken)
      clientIds = ids :+ clientId
      result <- auth0Api.saveUserMetadata(ns.get, idToken, metadata_key, Json.toJson(clientIds))
    } yield clientIds
  }

  implicit class JsResultOps[T](res: JsResult[T]) {
    def toXor: String Xor T =
      res.fold(err => Xor.left[String, T](Json.stringify(JsError.toJson(err))), Xor.Right.apply)
  }

  def createClient() : Action[JsValue] =
      authAction.AuthenticatedApiAction.async(BodyParsers.parse.json) { implicit request =>

    val result = for {
      clientName <- (request.body \ "client_name").validate[String].toXor
    } yield for {
      clientInfo <- authPlusApi.createClientForUser(request.namespace, clientName, request.authPlusAccessToken)
      clientIds <- addClientId(request.namespace, request.idToken, Uuid.fromJava(clientInfo.clientId))
    } yield Created(Json.toJson(clientIds))

    result.fold(err => Future.successful(BadRequest(err)), r => r)
  }

  def getClient(clientId: Uuid) : Action[AnyContent] = authAction.AuthenticatedApiAction.async { implicit request =>
    authPlusApi.getClient(clientId)
  }

  def getClients(clientIds: Seq[Uuid]) : Future[Seq[JsValue]] = {

    def toFutureTry[T](f: Future[T]): Future[Try[T]] = f.map(Success(_)).recover({ case e => Failure(e) })

    val clients = clientIds.map(authPlusApi.getClientJsValue).map(toFutureTry)
    Future.sequence(clients).map(_.filter(_.isSuccess).map(_.get))
  }

  def getClients() : Action[AnyContent] = authAction.AuthenticatedApiAction.async { implicit request =>
    for {
      clientIds <- getClientIds(request.namespace, request.idToken)
      clients <- getClients(clientIds)
    } yield Ok(Json.toJson(clients))
  }

}
