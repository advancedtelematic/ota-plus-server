package com.advancedtelematic.api.clients

import java.util.UUID

import akka.Done
import brave.play.{TraceData, ZipkinTraceServiceLike}
import cats.syntax.option._
import com.advancedtelematic.api._
import com.advancedtelematic.controllers.PathBinders.segment
import com.advancedtelematic.controllers.UserId
import com.advancedtelematic.libats.data.DataType.Namespace
import play.api.Configuration
import play.api.libs.json._
import play.api.mvc.Result

import scala.concurrent.{ExecutionContext, Future}

class UserProfileApi(val conf: Configuration, val apiExec: ApiClientExec)(implicit tracer: ZipkinTraceServiceLike)
  extends OtaPlusConfig {

  import play.api.libs.functional.syntax._

  private def userProfileRequest(path: String)(implicit traceData: TraceData) =
    ApiRequest.traced("user-profile", userProfileApiUri.uri + "/api/v1/" + path)

  implicit val namespaceR: Reads[Namespace] = Reads.StringReads.map(Namespace(_))

  implicit val userOrganizationR: Reads[UserOrganization] = {
    (
      (__ \ "namespace").read[Namespace] and
      (__ \ "name").read[String]
    )(UserOrganization.apply _)
  }

  def getUser(userId: UserId)(implicit traceData: TraceData): Future[JsValue] =
    userProfileRequest("users/" + segment(userId.id)).execJsonValue(apiExec)

  def createUser(userId: UserId, name: String, email: String, ns: Option[Namespace])
                (implicit traceData: TraceData): Future[JsValue] = {
    val params = Json.obj(
      Seq("name" -> name.some, "email" -> email.some, "namespace" -> ns.map(_.get))
        .collect { case (k, Some(v)) => k -> Json.toJsFieldJsValueWrapper(v) }: _*
    )
    userProfileRequest(s"users/${userId.id}")
      .transform(_.withMethod("POST"))
      .transform(_.withBody(params))
      .execJsonValue(apiExec)
  }

  def updateDisplayName(userId: UserId, newName: String)
                       (implicit executionContext: ExecutionContext, traceData: TraceData): Future[Done] = {
    val request = userProfileRequest(s"users/${segment(userId.id)}/displayname").transform(
      _.withMethod("PUT").withBody(JsString(newName))
    ).build
    apiExec.runSafe(request).map(_ => Done)
  }

  def updateBillingInfo[T](userId: UserId, query: Map[String,Seq[String]], body: JsValue)
                          (implicit traceData: TraceData): Future[Result] =
    userProfileRequest(s"users/${segment(userId.id)}/billing_info")
      .transform(
        _.withMethod("PUT")
          .withQueryStringParameters(query.mapValues(_.head).toSeq :_*)
          .withBody(body))
      .execResult(apiExec)

  def userOrganizations(userId: UserId)(implicit traceData: TraceData): Future[Set[UserOrganization]] =
    userProfileRequest(s"users/${segment(userId.id)}/organizations")
      .transform(_.withMethod("GET"))
      .execJson[Set[UserOrganization]](apiExec)

  def namespaceIsAllowed(userId: UserId, namespace: Namespace)
                        (implicit ec: ExecutionContext, traceData: TraceData): Future[Boolean] =
    userOrganizations(userId).map(_.map(_.namespace)).map(_.contains(namespace))

  def organizationMembershipEvents(namespace: Namespace, userId: UserId, limit: Int)
                                  (implicit traceData: TraceData): Future[JsValue] =
    userProfileRequest(s"organizations/${segment(namespace.get)}/membership_events")
      .transform(_.withMethod("GET"))
      .transform(_.addQueryStringParameters("limit" -> limit.toString))
      .withUser(userId)
      .execJsonValue(apiExec)

  def setNewDefaultOrganization(userId: UserId, newNamespace: Namespace)
                               (implicit traceData: TraceData): Future[Result] =
    userProfileRequest(s"users/${segment(userId.id)}/organizations/default")
      .transform(_.withMethod("PATCH"))
      .transform(_.withBody(Json.obj("namespace" -> newNamespace.get)))
      .execResult(apiExec)

  def userProfileRequest(userId: UserId,
                         method: String,
                         path: String,
                         body: Option[JsValue]
                        )(implicit traceData: TraceData): Future[Result] =
    userProfileRequest(s"users/${segment(userId.id)}/$path")
      .transform(_.withMethod(method))
      .transform(r => body.fold(r)(r.withBody))
      .execResult(apiExec)

  def organizationRequest(namespace: Namespace,
                          userId: UserId,
                          method: String,
                          path: String,
                          queryParams: Map[String, String],
                          body: Option[JsValue]
                         )(implicit traceData: TraceData): Future[Result] =
    userProfileRequest(s"organizations/${segment(namespace.get)}/$path")
      .transform(_.withMethod(method))
      .transform(_.withQueryStringParameters(queryParams.toSeq: _*))
      .transform(r => body.fold(r)(r.withBody))
      .withUser(userId)
      .execResult(apiExec)

  def organizationUserUiFeatures(namespace: Namespace,
                                 userId: UserId,
                                 email: Option[String],
                                 uiFeature: String,
                                 method: String,
                                )(implicit traceData: TraceData): Future[Result] = {
    val pathPrefix = s"organizations/${segment(namespace.get)}/ui_features"
    val path = if (uiFeature == "") pathPrefix else s"$pathPrefix/$uiFeature"
    userProfileRequest(path)
      .transform(_.withMethod(method))
      .transform(r => email.fold(r)(e => r.withQueryStringParameters("email" -> e)))
      .withUser(userId)
      .execResult(apiExec)
  }

  def getCredentialsBundle(namespace: Namespace, keyUuid: UUID)(implicit traceData: TraceData): Future[Result] =
    userProfileRequest(s"${segment(namespace.get)}/credentials/$keyUuid")
      .transform(_.withMethod("GET"))
      .execResult(apiExec)
}

