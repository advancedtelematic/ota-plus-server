package com.advancedtelematic

import javax.inject.{Inject, Singleton}

import com.advancedtelematic.ResetPasswordController.ResetPasswordData
import com.advancedtelematic.api.{ApiClientExec, ApiClientSupport}
import play.api.data.Form
import play.api.data.Forms._
import play.api.{Configuration, Logger}
import play.api.mvc.{Action, AnyContent}
import play.api.i18n.{I18nSupport, MessagesApi}
import play.api.libs.ws.WSClient
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}

import org.genivi.webserver.controllers.ConfigurationException

object ResetPasswordController {

  final case class ResetPasswordData(newPassword: String,
                                     passwordConfirmation: String)

}

@Singleton
class ResetPasswordController @Inject()(val conf: Configuration,
                                        val ws: WSClient,
                                        val messagesApi: MessagesApi,
                                        val clientExec: ApiClientExec)
                                       (implicit context: ExecutionContext)
  extends Controller with I18nSupport with ApiClientSupport {
  val logger = Logger(this.getClass)

  val emailForm = Form(single("email" -> email))

  // endpoint showing the form to enter the email of the account of which to reset the password
  def forgotPassword: Action[AnyContent] = Action {
    Ok(views.html.forgotpass(emailForm))
  }

  def sendEmail(email: String, message: String): Unit = {

    def sendEmailSES(from: String, to: String, subject: String, message: String) = {
      import com.amazonaws.services.simpleemail._
      import com.amazonaws.services.simpleemail.model._

      if (!sys.env.contains("AWS_ACCESS_KEY_ID") || !sys.env.contains("AWS_SECRET_KEY"))
      {
        throw new ConfigurationException("AWS credentials")
      }

      // Construct an object to contain the recipient address.
      val destination = new Destination().withToAddresses(to)

      // Create the subject and body of the message.
      val subjectContent = new Content().withData(subject)
      val textBody = new Content().withData(message)
      val body = new Body().withText(textBody)

      val emailMessage = new Message(subjectContent, body)

      // Assemble the email.
      val request = new SendEmailRequest(from, destination, emailMessage)

      // Instantiate an Amazon SES client, which will make the service call. The service call requires your AWS
      // credentials.
      // Because we're not providing an argument when instantiating the client, the SDK will attempt to find your AWS
      // credentials using the default credential provider chain. The first place the chain looks for the credentials is
      // in environment variables AWS_ACCESS_KEY_ID and AWS_SECRET_KEY.
      var client = new AmazonSimpleEmailServiceClient()

      if (conf.getString("email.endpoint").isDefined) {
        client.setEndpoint(conf.getString("email.endpoint").get)
      }

      client.sendEmail(request)
    }

    val sender_email = conf.getString("email.reset_password.sender.email").get
    val subject = conf.getString("email.reset_password.subject").get

    sendEmailSES(sender_email, email, subject = subject, message = message)
  }

  private[this] def sendToken(host: String, email: String): Future[Unit] =
    authPlusApi.passwordResetToken(conf.getString("authplus.client_id").get,
      conf.getString("authplus.secret").get,
      email)
      .transform(
        // request itself succeeded
        {
          case Some(token) =>
            val message = conf.getString("email.reset_password.message_body").get.format(host, token)
            logger.debug(message)
            sendEmail(email, message)
          case None =>
            val error = s"Email $email not found by Auth+"
            logger.error(error)
            throw new Exception(error)
        },
        s => {
          logger.error(s"Token request failed ($s)")
          throw new Exception(s)
        })

  // POST endpoint to which a form in which the email has been entered uploads the email
  def forgotPasswordEmail: Action[AnyContent] = Action.async { implicit request =>
    emailForm.bindFromRequest.fold(
      formWithErrors => Future(BadRequest(views.html.forgotpass(formWithErrors))),
      email => {
        logger.debug(s"got email $email")
        val protocol = if (request.secure) "https" else "http"
        sendToken(protocol + "://" + request.host, email)
          .map { _ => Ok(views.html.forgotpass_confirmation()) }
          .recover { case e: Exception => logger.error(e.getMessage)
            InternalServerError
          }
      }
    )
  }

  val passwordForm = Form(
    mapping(
      "newPassword" -> nonEmptyText,
      "passwordConfirmation" -> nonEmptyText
    )(ResetPasswordData.apply)(ResetPasswordData.unapply)
      .verifying("The new passwords do not match", pd => pd.newPassword == pd.passwordConfirmation)
  )

  // show reset password form
  def resetPasswordForm(token: String): Action[AnyContent] = Action {
    Ok(views.html.resetpass(passwordForm, token))
  }

  def handleResetPassword(fr: Future[Result]): Future[Result] =
    fr.map { _ => Redirect(com.advancedtelematic.login.routes.LoginController.login()) }
      .recover { case e: Exception => InternalServerError(e.getMessage) }

  // POST endpoint
  def resetPassword(passwordResetToken: String): Action[AnyContent] = Action.async { implicit request =>
    passwordForm.bindFromRequest.fold(
      formWithErrors => Future(BadRequest(views.html.resetpass(formWithErrors, passwordResetToken))),
      password => {
        handleResetPassword(authPlusApi.resetPassword(passwordResetToken, password.newPassword))
      })
  }

}
