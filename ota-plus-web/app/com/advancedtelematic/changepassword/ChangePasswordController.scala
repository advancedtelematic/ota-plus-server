package com.advancedtelematic.changepassword

import com.advancedtelematic.api.{ApiClientExec, ApiClientSupport}
import play.api.data.Forms._
import play.api.data._
import play.api.i18n.{I18nSupport, MessagesApi}
import play.api.libs.ws.WSClient
import play.api.mvc._
import play.api.{Configuration, Logger}
import scala.concurrent.{ExecutionContext, Future}
import javax.inject.Inject

final case class ChangePasswordData(oldPassword: String, newPassword: String,
                                    passwordConfirmation: String)

class ChangePasswordController @Inject() (val ws: WSClient,
                                          val conf: Configuration,
                                          val messagesApi: MessagesApi,
                                          val clientExec: ApiClientExec)
                                         (implicit context: ExecutionContext) extends Controller
    with I18nSupport with ApiClientSupport {

  val logger = Logger(this.getClass)

  val passwordForm = Form(
    mapping(
      "oldPassword" -> nonEmptyText,
      "newPassword" -> nonEmptyText,
      "passwordConfirmation" -> nonEmptyText
    )(ChangePasswordData.apply)(ChangePasswordData.unapply)
      .verifying("The new passwords do not match", pd => pd.newPassword == pd.passwordConfirmation)
  )

  def changePasswordForm : Action[AnyContent] = Action { implicit req =>
    if (validSession(req)) {
      Ok(views.html.changepass(passwordForm))
    } else {
      logger.debug("No valid session found, redirecting")
      Redirect(com.advancedtelematic.login.routes.LoginController.login()).withNewSession
    }
  }

  def validSession(req: Request[AnyContent]): Boolean = {
    req.session.get("username").isDefined && req.session.get("access_token").isDefined
  }

  // handler for password change POST
  def changePassword: Action[AnyContent] = Action.async { implicit req =>

    passwordForm.bindFromRequest.fold(
      formWithErrors => {
        Future.successful(BadRequest(views.html.changepass(formWithErrors)))
      },
      changePasswordData => {
        authPlusApi.changePassword(
          req.session("access_token"),
          req.session("username"),
          changePasswordData.oldPassword,
          changePasswordData.newPassword).map {
            res => res.header.status match {
              case OK =>
                Redirect(org.genivi.webserver.controllers.routes.Application.index())

              case code =>
                logger.debug(s"Unexpected response from Auth+: $code")
                ServiceUnavailable(views.html.serviceUnavailable())
            }
        }
      }
    )
  }

}
