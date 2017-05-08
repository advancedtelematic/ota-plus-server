package com.advancedtelematic.controllers

import akka.actor.ActorSystem
import cats.data.Xor
import javax.inject.{Inject, Singleton}

import com.advancedtelematic.{AuthPlusAuthentication, AuthPlusAccessToken, IdToken}
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

  implicit class JsResultOps[T](res: JsResult[T]) {
    def toXor: String Xor T =
      res.fold(err => Xor.left[String, T](Json.stringify(JsError.toJson(err))), Xor.Right.apply)
  }

  import scala.collection.JavaConversions._
  private val validScopes: Set[String] = conf.getStringList("api.scopes").get.toSet

  def toScope(str: String) : String Xor String = {
    if (str.split(" ").forall { s => validScopes.contains(s) }) Xor.right(str)
    else Xor.left(s"Invalid scope: $str")
  }

  def createClient() : Action[JsValue] =
      authAction.AuthenticatedApiAction.async(BodyParsers.parse.json) { implicit request =>

    val result = for {
      clientName <- (request.body \ "client_name").validate[String].toXor
      scopeStr <- (request.body \ "scope").validate[String].toXor
      scope <- toScope(scopeStr)
    } yield for {
      clientInfo <- authPlusApi.createClientForUser(
        clientName, s"namespace.${request.namespace.get} $scope", request.authPlusAccessToken)
      clientIds <- userProfileApi.addApplicationId(request.idToken.userId, Uuid.fromJava(clientInfo.clientId))
    } yield Created

    result.fold(err => Future.successful(BadRequest(err)), r => r)
  }

  def getClient(clientId: Uuid) : Action[AnyContent] = authAction.AuthenticatedApiAction.async { implicit request =>
    authPlusApi.getClient(clientId, request.authPlusAccessToken)
  }

  def getClients(clientIds: Seq[Uuid], token: AuthPlusAccessToken) : Future[Seq[JsValue]] = {

    def toFutureTry[T](f: Future[T]): Future[Try[T]] = f.map(Success(_)).recover({ case e => Failure(e) })

    val clients = clientIds.map(id => authPlusApi.getClientJsValue(id, token)).map(toFutureTry)
    Future.sequence(clients).map(_.filter(_.isSuccess).map(_.get))
  }

  def getClients() : Action[AnyContent] = authAction.AuthenticatedApiAction.async { implicit request =>
    for {
      clientIds <- userProfileApi.getApplicationIds(request.idToken.userId)
      clients <- getClients(clientIds, request.authPlusAccessToken)
    } yield Ok(Json.toJson(clients))
  }

}
