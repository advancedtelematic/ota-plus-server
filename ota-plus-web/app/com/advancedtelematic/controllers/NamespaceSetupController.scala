package com.advancedtelematic.controllers

import java.util.concurrent.TimeUnit

import javax.inject.{Inject, Singleton}
import akka.actor.ActorSystem
import akka.http.scaladsl.util.FastFuture
import com.advancedtelematic.api._
import com.advancedtelematic.auth.ApiAuthAction
import play.api.{Configuration, Logger}
import play.api.libs.json.{JsValue, Json, Writes}
import play.api.libs.ws.WSClient
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}

import scala.concurrent.duration.FiniteDuration
import scala.concurrent.{ExecutionContext, Future}
import akka.pattern.after
import com.advancedtelematic.libats.data.DataType.Namespace
import com.advancedtelematic.libtuf.data.TufDataType.KeyType

object NamespaceSetupController {
  sealed trait CreateResult {
    val name: String
  }
  case class ResourceCreated(name: String) extends CreateResult
  case class AlreadyExists(name: String) extends CreateResult
  case class Failed(name: String, cause: Throwable) extends CreateResult
  case class TooManyTries(name: String) extends CreateResult

  implicit val createResultWrites: Writes[CreateResult] = Writes {
    case ResourceCreated(_) =>
      Json.toJson("Created")
    case AlreadyExists(name) =>
      Json.toJson(s"Resource $name already exists")
    case Failed(_, cause) =>
      Json.toJson(s"Failed: ${cause.getLocalizedMessage}")
    case TooManyTries(_) =>
      Json.toJson(s"Failed to wait for resource creation")
  }

  trait ResourceCreation {
    protected def exists(): Future[Boolean]

    protected def create(keyType: KeyType): Future[Unit]

    private lazy val log = Logger(this.getClass)

    val name: String

    def checkResource(implicit ec: ExecutionContext): Future[(String, Boolean)] = {
      val safeCheck = exists().recover { case ex =>
        log.error(s"Could not check status for $name", ex)
        false
      }

      FastFuture.successful(name).zip(safeCheck)
    }

    def setupResource(checkSeconds: Int, keyType: KeyType)
                     (implicit system: ActorSystem, ec: ExecutionContext): Future[CreateResult] = {
      exists().flatMap {
        case true =>
          log.info(s"Not creating $name, already exists")
          FastFuture.successful(AlreadyExists(name))
        case false =>
          create(keyType).flatMap { _ =>
            waitFor(checkSeconds, FiniteDuration(1, TimeUnit.SECONDS))
          }
      }.recover {
        case ex => Failed(name, ex)
      }
    }

    private def waitFor(times: Int, interval: FiniteDuration)
                       (implicit system: ActorSystem, ec: ExecutionContext): Future[CreateResult] = {
      if (times > 0) {
        val checkResult = after(interval, system.scheduler)(exists())

        checkResult.flatMap {
          case true =>
            FastFuture.successful(ResourceCreated(name))
          case false =>
            log.info(s"still not ready, ${times - 1} more tries")
            waitFor(times - 1, interval)
        }.recoverWith {
          case ex => FastFuture.successful(Failed(name, ex))
        }
      } else {
        log.info("Resourced creation requested, but failed to verify creation after multiple tries")
        FastFuture.successful(TooManyTries(name))
      }
    }
  }

  class TufRepoCreation(namespace: Namespace, repoServerApi: RepoServerApi)
                       (implicit ec: ExecutionContext) extends ResourceCreation {
    override val name: String = "tuf"

    override def exists(): Future[Boolean] = repoServerApi.repoExists(namespace)

    override def create(keyType: KeyType): Future[Unit] = repoServerApi.createRepo(namespace, keyType)
  }

  class DirectorRepoCreation(namespace: Namespace, directorApi: DirectorApi)
                            (implicit ec: ExecutionContext) extends ResourceCreation {
    override val name: String = "director"

    override def exists(): Future[Boolean] = directorApi.repoExists(namespace)

    override def create(keyType: KeyType): Future[Unit] = directorApi.createRepo(namespace, keyType)
  }

  class CryptAccountCreation(namespace: Namespace, cryptApi: CryptApi)
                            (implicit ec: ExecutionContext) extends ResourceCreation {
    override val name: String = "crypt"

    override protected def exists(): Future[Boolean] =
      cryptApi.getAccount(namespace.get, _.validate[JsValue]).map(_.isDefined)

    override protected def create(keyType: KeyType): Future[Unit] =
      cryptApi.registerAccount(namespace.get).map(_ => ())
  }
}

@Singleton
class NamespaceSetupController @Inject() (val ws: WSClient,
                                          val conf: Configuration,
                                          val apiAuth: ApiAuthAction,
                                          val clientExec: ApiClientExec,
                                          components: ControllerComponents)
                                         (implicit system: ActorSystem, ec: ExecutionContext)
  extends AbstractController(components)
    with ApiClientSupport
    with OtaPlusConfig {

  import NamespaceSetupController._

  private val cryptApi = new CryptApi(conf, clientExec)

  private lazy val enabledResources: Namespace => List[ResourceCreation] = { ns =>
    val crypt =
      if(conf.getOptional[String]("crypt.host").isDefined)
        List(new CryptAccountCreation(ns, cryptApi))
      else
        List.empty

    List(
      new TufRepoCreation(ns, repoServerApi),
      new DirectorRepoCreation(ns, directorApi)
    ) ++ crypt
  }

  def status(): Action[AnyContent] = apiAuth.async { request =>
    Future.sequence {
      enabledResources(request.namespace).map(_.checkResource)
    }.map { results => Ok(Json.toJson(results.toMap)) }
  }

  def setup(keyType: KeyType): Action[AnyContent] = apiAuth.async { request =>
    Future.sequence {
      enabledResources(request.namespace).map(_.setupResource(conf.get[Int]("namespace_setup.check_retries"), keyType))
    }.map { results =>
      val result = Json.toJson(results.map { r => r.name -> r }.toMap)

      val success = results.forall {
        case ResourceCreated(_) | AlreadyExists(_) => true
        case _ => false
      }

      if (success)
        Ok(result)
      else
        BadGateway(result)
    }
  }
}
