package com.advancedtelematic.api

import com.advancedtelematic.auth.AccessToken
import com.advancedtelematic.auth.garage.Auth0Api
import com.advancedtelematic.controllers.{FeatureName, UserId}
import play.api.Configuration
import play.api.libs.ws.WSClient
import play.api.mvc.{Result, Results}

import scala.concurrent.{ExecutionContext, Future}

trait ApiClientSupport {
  val ws: WSClient
  val conf: Configuration
  val clientExec: ApiClientExec

  val authPlusApi = new AuthPlusApi(conf, clientExec)

  val auth0Api = new Auth0Api(conf, clientExec)

  val buildSrvApi = new BuildSrvApi(conf, clientExec)

  val devicesApi = new DevicesApi(conf, clientExec)

  val userProfileApi = new UserProfileApi(conf, clientExec)

  val repoServerApi = new RepoServerApi(conf, clientExec)

  val keyServerApi = new KeyServerApi(conf, clientExec)

  def getFeatureConfig(feature: FeatureName, userId: UserId, token: AccessToken)
                      (implicit ec: ExecutionContext): Future[Result] =
    userProfileApi.getFeature(userId, feature).flatMap { f =>
      f.client_id match {
        case Some(id) =>
          for {
            secret <- authPlusApi.fetchSecret(id.toJava, token)
            result <- buildSrvApi.download(feature.get, id, secret)
          } yield result
        case None => Future.successful(Results.NotFound)
      }
    }

}
