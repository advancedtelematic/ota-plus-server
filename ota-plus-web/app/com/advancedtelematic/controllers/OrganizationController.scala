package com.advancedtelematic.controllers

import brave.play.ZipkinTraceServiceLike
import brave.play.implicits.ZipkinTraceImplicits
import com.advancedtelematic.api.{ApiClientExec, ApiClientSupport}
import com.advancedtelematic.auth.{AuthorizedSessionRequest, PlainAction, SessionCodecs}
import com.advancedtelematic.libats.data.DataType.Namespace
import javax.inject.{Inject, Singleton}
import play.api.libs.json._
import play.api.libs.ws.WSClient
import play.api.mvc._
import play.api.{Configuration, Logger}

import scala.concurrent.{ExecutionContext, Future}

@Singleton
class OrganizationController @Inject()(val conf: Configuration,
                                       val ws: WSClient,
                                       val clientExec: ApiClientExec,
                                       implicit val tracer: ZipkinTraceServiceLike,
                                       authAction: PlainAction,
                                       components: ControllerComponents)(implicit exec: ExecutionContext)
  extends AbstractController(components) with ApiClientSupport with ZipkinTraceImplicits {

  private val log = Logger(this.getClass)
  private val redirectToIndex = Redirect(com.advancedtelematic.controllers.routes.Application.index())

  implicit def namespaceBinder: PathBindable[Namespace] =
    new PathBindable[Namespace] {
      override def bind(key: String, ns: String): Either[String, Namespace] = Right(Namespace(key))
      override def unbind(key: String, ns: Namespace): String = ns.get
  }

  def switchOrganization(namespace: Namespace): Action[AnyContent] = authAction.async { implicit request =>
    val userId = request.idToken.userId
      userProfileApi.namespaceIsAllowed(userId, namespace).map {
        case false =>
          log.info(s"User ${userId.id} tries to switch to the namespace ${namespace.get}," +
            " but it doesn't exist or the user is not allowed to access it.")
          redirectToIndex
        case true =>
          log.info(s"User ${userId.id} switches to the namespace ${namespace.get}")
          userProfileApi.setNewDefaultOrganization(userId, namespace)
          redirectToIndex.withSession(
            "namespace" -> namespace.get,
            "id_token" -> request.idToken.value,
            "access_token" -> Json.stringify(Json.toJson(request.accessToken)(SessionCodecs.AccessTokenFormat))
          )
      }
    }

  def deviceTagsInOrganization: Action[AnyContent] =
    authAction.async { implicit request =>
      deviceRegistryApi.availableDeviceTags(request.namespace).map(Ok(_))
    }

  private def buildOrganizationRequest(path: String, namespace: Namespace)
                                      (implicit request: AuthorizedSessionRequest[AnyContent]): Future[Result] =
    userProfileApi.organizationRequest(
      namespace,
      request.idToken.userId,
      request.method,
      path,
      request.queryString.mapValues(_.mkString(",")),
      request.body.asJson
    )

  def proxyRequest(path: String): Action[AnyContent] =
    authAction.async(implicit request => buildOrganizationRequest(path, request.namespace))

  def proxyRequestForNs(path: String, namespace: Namespace): Action[AnyContent] =
    authAction.async(implicit request => buildOrganizationRequest(path, namespace))
}
