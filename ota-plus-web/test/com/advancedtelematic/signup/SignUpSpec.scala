package com.advancedtelematic.signup

import mockws.MockWS
import org.asynchttpclient.AsyncHttpClientConfig
import org.openqa.selenium.WebDriver
import org.scalatest.BeforeAndAfterAll
import org.scalatest.prop.GeneratorDrivenPropertyChecks
import org.scalatest.selenium.{Page, WebBrowser}
import org.scalatestplus.play._
import play.api.Application
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.libs.json.Json
import play.api.libs.ws.{WSClient, WSResponse}
import play.api.libs.ws.ahc.{AhcConfigBuilder, AhcWSClient, AhcWSClientConfig}
import play.api.mvc.Action
import play.api.test.Helpers._

case class SignUpPage(port: Int, token: String, browser: WebBrowser)
                     (implicit wd: WebDriver) extends Page {
  val url = s"http://localhost:$port/signup/$token"

  def password(): browser.PasswordField = browser.pwdField(browser.id("password"))

  def passwordConfirmation(): browser.PasswordField = browser.pwdField(browser.id("repeatpassword"))

  def setAndConfirmPassword(pwd: String): Unit = {
    password().value = pwd
    passwordConfirmation().value = pwd
  }

  def submit(): Unit = {
    browser.clickOn(browser.id("submit-form"))
  }
}

class SignUpSpec extends PlaySpec
    with OneServerPerSuite
//    with GeneratorDrivenPropertyChecks
    with OneBrowserPerSuite
    with HtmlUnitFactory
    with BeforeAndAfterAll {

  import play.api.inject.bind
  import play.api.mvc.Results._

  val mockClient = MockWS {
    case ("POST", "http://localhost:9001/users") =>
      Action { implicit request =>
        request.body.asJson.map { json =>
          import play.api.libs.json._
          if( (json \ "name").as[String] != "Vladimir Koshelev" ) {
            UnprocessableEntity( EmptyContent() )
          } else {
            Created(EmptyContent())
          }
        }.getOrElse( BadRequest )

      }
  }

  val wsClient = {
    import com.typesafe.config.ConfigFactory
    import play.api._
    import play.api.libs.ws._

    val configuration = Configuration.reference ++ Configuration(ConfigFactory.parseString(
      """
        |ws.followRedirects = false
      """.stripMargin))

    val parser = new WSConfigParser(configuration, Environment.simple())
    val config = new AhcWSClientConfig(wsClientConfig = parser.parse())
    val builder = new AhcConfigBuilder(config)
    val logging = new AsyncHttpClientConfig.AdditionalChannelInitializer() {
      override def initChannel(channel: io.netty.channel.Channel): Unit = {
        channel.pipeline.addFirst("log", new io.netty.handler.logging.LoggingHandler("debug"))
      }
    }
    val ahcBuilder = builder.configure()
    ahcBuilder.setHttpAdditionalChannelInitializer(logging)
    val ahcConfig = ahcBuilder.build()
    new AhcWSClient(ahcConfig)(app.materializer)
  }

  implicit override lazy val app: Application = new GuiceApplicationBuilder()
      .overrides(bind[WSClient].toInstance(mockClient))
      .build()

  // scalastyle:off
  val invitation = "eyJhbGciOiJIUzI1NiJ9" +
      ".eyJuYW1lIjoiVmxhZGltaXIgS29zaGVsZXYiLCJlbWFpbCI6InZsYWRpbWlyQGFkdmFuY2VkdGVsZW1hdGljLmNvbSIsInBob25lX251bWJlciI6Iis0OTMwOTU5OTk3NTQwIn0" +
      ".7J6-syD9xZB-JQmA4lT3rejA5rVUupBU2ZKBKLXhMJk"

  val invitationWithInvalidSign = "eyJhbGciOiJIUzI1NiJ9" +
      ".eyJuYW1lIjoiVmxhZGltaXIgS29zaGVsZXYiLCJlbWFpbCI6InZsYWRpbWlyQGFkdmFuY2VkdGVsZW1hdGljLmNvbSIsInBob25lX251bWJlciI6Iis0OTMwOTU5OTk3NTQwIn0" +
      ".Fmv0Ew7sbLwUYWbxJnOClIqZYtttw9wQuXD1l-eHN7g"


  "Signup with invitation" should {
    "reject users with invalid invitation" in {
      go to SignUpPage(port, "Fmv0Ew7sbLwUYWbxJnOClIqZYtttw9wQuXD1l-eHN7g", this)
      pageTitle must be ("Sign Up Error")
      find(id("signup.closedBeta")).isDefined
    }

    "reject users if invitation signature verification failed" in {
      go to SignUpPage(port, invitationWithInvalidSign, this)
      pageTitle must be ("Sign Up Error")
      find(id("signup.closedBeta")).isDefined
    }

    "Ask to set password if invitation is verified" in {
      val signUpPage = SignUpPage(port, invitation, this)
      go to signUpPage
      pageTitle must be ("SOTA Admin UI - Sign up")
      signUpPage.password().isDisplayed must be (true)
      signUpPage.passwordConfirmation().isDisplayed must be (true)
    }

    "Registers user if password is set and confirmed" in {
      val signUpPage = SignUpPage(port, invitation, this)
      go to signUpPage
      pageTitle must be ("SOTA Admin UI - Sign up")
      signUpPage.setAndConfirmPassword("12345")
      signUpPage.submit()

      pageTitle must be ("SOTA Admin UI")
    }

    val duplicateInvitation = "eyJhbGciOiJIUzI1NiJ9." +
        "eyJuYW1lIjoiQ2hyaXN0aWFuIEh1Z2dlciIsImVtYWlsIjoiY2hyaXN0aWFuQGFkdmFuY2VkdGVsZW1hdGljLmNvbSIsInBob25lX251bW" +
        "JlciI6Iis0OTMwOTU5OTk3NTQwIn0.Fmv0Ew7sbLwUYWbxJnOClIqZYtttw9wQuXD1l-eHN7g"

    "Notifies user in case email is already registered" in {
      val signUpPage = SignUpPage(port, duplicateInvitation, this)
      go to signUpPage
      pageTitle must be ("SOTA Admin UI - Sign up")
      signUpPage.setAndConfirmPassword("12345")
      signUpPage.submit()

      pageTitle must be ("Sign Up Error")
      find(id("signup.duplicateEmail")).isDefined
    }

    def submit(password: String, confirmation: String): WSResponse = {
      await(
        wsCall(routes.SignupController.setPassword(invitation))
            .post( Map("password" -> Seq(password), "repeatpassword" -> Seq(confirmation)))
      )
    }

    "reject if password or password confirmation are not set" in {
      submit("", "123").status  must be (play.api.http.Status.BAD_REQUEST)
      submit("123", "").status  must be (play.api.http.Status.BAD_REQUEST)
      submit("", "").status  must be (play.api.http.Status.BAD_REQUEST)
    }

    "reject if password and confirmation do not match" in {
      submit("321", "123").status  must be (play.api.http.Status.BAD_REQUEST)
    }
  }

  override protected def afterAll(): Unit = wsClient.close()
}
