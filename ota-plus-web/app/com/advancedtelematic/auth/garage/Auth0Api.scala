package com.advancedtelematic.auth.garage

import akka.Done
import com.advancedtelematic.api.{ApiClientExec, ApiRequest, OtaPlusConfig, UnexpectedResponse}
import com.advancedtelematic.auth.OAuthConfig
import play.api.Configuration
import play.api.libs.json.Json
import play.shaded.ahc.org.asynchttpclient.util.HttpConstants.ResponseStatusCodes

import scala.concurrent.{ExecutionContext, Future}

class Auth0Api(val conf: Configuration, val apiExec: ApiClientExec) extends OtaPlusConfig {

  private[this] val oauthConfig    = OAuthConfig(conf)
  private[this] val auth0Config    = Auth0Config(conf)
  private val domain: String       = oauthConfig.domain
  private val auth0Request         = ApiRequest.base(s"https://$domain/")
  private val auth0RequestUserData = ApiRequest.base(s"https://$domain/api/v2/users/")

  def changePassword(email: String)(implicit executionContext: ExecutionContext): Future[Done] = {
    val requestBody =
      Json.obj("client_id" -> oauthConfig.clientId, "email" -> email, "connection" -> auth0Config.dbConnection)
    auth0Request("dbconnections/change_password")
      .transform(_.withMethod("POST").withBody(requestBody))
      .execResponse(apiExec)
      .flatMap { response =>
        if (response.status == ResponseStatusCodes.OK_200) {
          Future.successful(Done)
        } else {
          Future.failed(UnexpectedResponse(response))
        }
      }
  }
}


