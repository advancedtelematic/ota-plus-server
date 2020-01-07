package com.advancedtelematic.api.clients

import java.util.UUID

import akka.Done
import brave.play.{TraceData, ZipkinTraceServiceLike}
import com.advancedtelematic.api.{ApiClientExec, ApiRequest, Feature, OtaPlusConfig, UserOrganization}
import com.advancedtelematic.controllers.PathBinders.segment
import com.advancedtelematic.controllers.{FeatureName, UserId}
import com.advancedtelematic.libats.data.DataType.Namespace
import play.api.Configuration
import play.api.libs.json.{JsString, JsValue, Json, Reads, Writes, __}
import play.api.mvc.Result

import scala.concurrent.{ExecutionContext, Future}

class UserProfileApi(val conf: Configuration, val apiExec: ApiClientExec)(implicit tracer: ZipkinTraceServiceLike)
  extends OtaPlusConfig {

  import play.api.libs.functional.syntax._

  private def userProfileRequest(path: String)(implicit traceData: TraceData) =
    ApiRequest.traced("user-profile", userProfileApiUri.uri + "/api/v1/" + path)

  implicit val featureNameR: Reads[FeatureName] = Reads.StringReads.map(FeatureName)
  implicit val featureNameW: Writes[FeatureName] = Writes.StringWrites.contramap(_.get)
  implicit val namespaceR: Reads[Namespace] = Reads.StringReads.map(Namespace(_))

  implicit val featureR: Reads[Feature] = {(
    (__ \ "feature").read[FeatureName] and
      (__ \ "client_id").readNullable[UUID] and
      (__ \ "enabled").read[Boolean]
    )(Feature.apply _)}

  implicit val userOrganizationR: Reads[UserOrganization] = {
    (
      (__ \ "namespace").read[Namespace] and
      (__ \ "name").read[String]
    )(UserOrganization.apply _)
  }

  def getUser(userId: UserId)(implicit traceData: TraceData): Future[JsValue] =
    userProfileRequest("users/" + segment(userId.id)).execJsonValue(apiExec)

  def createUser(userId: UserId, name: String, email: String)(implicit traceData: TraceData): Future[JsValue] =
    userProfileRequest(s"users/${userId.id}")
      .transform(_.withMethod("POST"))
      .transform(_.withBody(Json.obj("name" -> name, "email"-> email)))
      .execJsonValue(apiExec)

  def getFeature(namespace: Namespace, feature: FeatureName)(implicit traceData: TraceData): Future[Feature] =
    userProfileRequest("organizations/" + segment(namespace.get) + "/features/" + feature.get)
      .execJson[Feature](apiExec)

  def getFeatures(namespace: Namespace)(implicit traceData: TraceData): Future[Seq[FeatureName]] =
    userProfileRequest("organizations/" + segment(namespace.get) + "/features").execJson[Seq[FeatureName]](apiExec)

  def activateFeature(namespace: Namespace, feature: FeatureName, clientId: UUID)
                     (implicit traceData: TraceData): Future[Result] = {
    val requestBody = Json.obj("feature" -> feature.get, "client_id" -> clientId)

    userProfileRequest(s"organizations/${segment(namespace.get)}/features")
      .transform(_.withMethod("POST").withBody(requestBody))
      .execResult(apiExec)
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

  def userProfileRequest(userId: UserId, method: String, path: String)(implicit traceData: TraceData): Future[Result] =
    userProfileRequest(s"users/${segment(userId.id)}/$path")
      .transform(_.withMethod(method))
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

  def organizationRequest(namespace: Namespace, userId: UserId, method: String, path: String, body: Option[JsValue])
                         (implicit traceData: TraceData): Future[Result] =
    userProfileRequest(s"organizations/${segment(namespace.get)}/$path")
      .transform(_.withMethod(method))
      .transform(r => body.map(json => r.withBody(json)).getOrElse(r))
      .withUser(userId)
      .execResult(apiExec)

  def getCredentialsBundle(namespace: Namespace, keyUuid: UUID)(implicit traceData: TraceData): Future[Result] =
    userProfileRequest(s"${segment(namespace.get)}/credentials/$keyUuid")
      .transform(_.withMethod("GET"))
      .execResult(apiExec)
}

