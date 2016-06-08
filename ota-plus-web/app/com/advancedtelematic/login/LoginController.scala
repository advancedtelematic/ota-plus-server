package com.advancedtelematic.login

import javax.inject.{Inject, Singleton}

import org.asynchttpclient.uri.Uri
import play.api.{Configuration, Logger}
import play.api.data.Form
import play.api.data.Forms._
import play.api.i18n.{I18nSupport, MessagesApi}
import play.api.libs.ws.WSAuthScheme.BASIC
import play.api.libs.ws.WSClient
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}

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
        wSClient.url(authPlusHost.toUrl + "/token")
          .withAuth(conf.getString("authplus.client_id").get,
                    conf.getString("authplus.secret").get,
                    BASIC)
          .post( buildPasswordRequest(loginData.username, loginData.password) )
          .map { response =>
          response.status match {
            case OK =>
              val token = (response.json \ "access_token").as[String]
              Redirect(org.genivi.webserver.controllers.routes.Application.index())
                .withSession("username" -> loginData.username, token_key -> token)

            case BAD_REQUEST =>
              val error = (response.json \ "error").as[String]
              logger.debug(s"Bad request: $error")
              Redirect(com.advancedtelematic.login.routes.LoginController.login().withFragment("error").toString())

            case code =>
              logger.debug(s"Unexpected response from Auth+: $code")
              ServiceUnavailable(views.html.serviceUnavailable())
          }
        }
      }
    )
  }
}
