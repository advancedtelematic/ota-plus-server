package com.advancedtelematic.login

import javax.inject.{Inject, Singleton}

import cats.data.Validated
import cats.std.all._
import cats.syntax.apply._
import org.asynchttpclient.uri.Uri
import org.genivi.webserver.controllers.ConfigurationException
import org.scalatest.Failed
import play.api.{Configuration, Logger}
import play.api.data.Form
import play.api.data.Forms._
import play.api.i18n.{I18nSupport, MessagesApi}
import play.api.libs.ws.WSAuthScheme.BASIC
import play.api.libs.ws.WSClient
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Try}

case class LoginData(username: String, password: String)

/**
  * Handles just login/authentication
  */
@Singleton
class LoginController @Inject()(conf: Configuration,
                                val messagesApi: MessagesApi,
                                wSClient: WSClient)
                               (implicit context: ExecutionContext) extends Controller with I18nSupport {

  private val token_key = "access_token"

  private[this] val authPlusHost: Uri = conf.getString("authplus.host").map(Uri.create).get

  private lazy val authPlusCredentials: (String, String) = {
    val clientIdV = Validated.fromOption(conf.getString("authplus.client_id"), "No client_id for auth plus\n")
    val secret = Validated.fromOption(conf.getString("authplus.secret"), "No secret for auth plus\n")
    val validated: Validated[String, (String, String)] = clientIdV.map2(secret)(Tuple2.apply)

    validated.fold(e => throw ConfigurationException(e), identity)
  }

  val logger = Logger(this.getClass)
  val loginForm = Form(
    mapping(
      "username" -> nonEmptyText,
      "password" -> nonEmptyText
    )(LoginData.apply)(LoginData.unapply)
  )

  def login : Action[AnyContent] = Action { implicit req =>
    Ok(views.html.login(loginForm))
  }

  def logout : Action[AnyContent] = Action { implicit req =>
    Redirect(org.genivi.webserver.controllers.routes.Application.index())
      .withNewSession
  }

  private[this] def buildPasswordRequest(username: String, password: String) =
    Map("grant_type" -> Seq("password"),
        "username" -> Seq(username),
        "password" -> Seq(password))

  /*
     POST
     set token in session
     */
  def authenticate: Action[AnyContent] = Action.async { implicit req =>
    loginForm.bindFromRequest.fold(
      formWithErrors => {
        Future.successful(BadRequest(views.html.login(formWithErrors)))
      },
      loginData => {
        val (clientId, clientSecret) = authPlusCredentials

        wSClient.url(authPlusHost.toUrl + "/token")
          .withAuth(clientId, clientSecret, BASIC)
          .post( buildPasswordRequest(loginData.username, loginData.password) )
          .map { response =>
          response.status match {
            case OK =>
              val token = (response.json \ "access_token").as[String]
              Redirect(org.genivi.webserver.controllers.routes.Application.index())
                .withSession("username" -> loginData.username, token_key -> token)

            case BAD_REQUEST =>
              val error = (response.json \ "error").asOpt[String].getOrElse("(unknown error)")
              logger.debug(s"Bad request: $error")
              BadRequest(views.html.login(loginForm.withGlobalError(s"Bad request: $error")))

            case code =>
              logger.debug(s"Unexpected response from Auth+: $code")
              ServiceUnavailable(views.html.serviceUnavailable())
          }
        }
      }
    )
  }
}
