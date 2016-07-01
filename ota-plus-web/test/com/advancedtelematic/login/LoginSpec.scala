package com.advancedtelematic.login

import mockws.MockWS
import org.asynchttpclient.AsyncHttpClientConfig
import org.openqa.selenium.WebDriver
import org.scalatest.BeforeAndAfterAll
import org.scalatest.selenium.{Page, WebBrowser}
import org.scalatestplus.play._
import play.api.Application
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.libs.ws.ahc.{AhcConfigBuilder, AhcWSClient, AhcWSClientConfig}
import play.api.libs.ws.{WSClient, WSResponse}
import play.api.mvc.Action
import play.api.test.FakeRequest
import play.api.test.Helpers._

case class LoginPage(port: Int, browser: WebBrowser)
                     (implicit wd: WebDriver) extends Page {
  val url = s"http://localhost:$port/login"

  def username(): browser.TextField = browser.textField("username")
  def password(): browser.PasswordField = browser.pwdField("password")

  def setUsernameAndPassword(name: String, pwd: String): Unit = {
    username().value = name
    password().value = pwd
  }

  def submit(): Unit = {
    // browser.clickOn("login-form")
    // $('#loginForm').submit();
    //browser.submit()
    browser.submit()
  }
}

class LoginSpec extends PlaySpec
    with OneServerPerSuite
    with OneBrowserPerSuite
    with HtmlUnitFactory
    with BeforeAndAfterAll {

  private[this] def correctUser = "correct user"
  private[this] def correctPassword = "correct password"
  private[this] def token = "tokenvalue"

  import play.api.inject.bind
  import play.api.mvc.Results._

  val mockClient = MockWS {
    case ("POST", "http://localhost:9001/token") =>
      Action { implicit request =>
        val username = request.body.asFormUrlEncoded.get("username").head
        val password = request.body.asFormUrlEncoded.get("password").head
        if (username == correctUser && password == correctPassword) {
          Ok(s"""{ \"access_token\" : \"$token\" }""")
        }
        else {
          BadRequest("{ \"error\": \"invalid_request\" }")
        }
      }
    case _ =>
      Action {
        Ok(EmptyContent())
      }
  }

  val wsClient = {
    import com.typesafe.config.ConfigFactory
    import play.api._
    import play.api.libs.ws._

    val configuration = Configuration.reference ++ Configuration(ConfigFactory.parseString(
      """
        |play.ws.followRedirects = false
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
      // the following 2 entries should come from the environment in production
      .configure("authplus.client_id" -> "")
      .configure("authplus.secret" -> "")
      .build()

  "Login" should {
    "Fail if username or password are incorrect" in {
      val loginPage = LoginPage(port, this)
      go to loginPage
      pageTitle must be ("SOTA Admin UI - Log in")
      loginPage.setUsernameAndPassword("wrongname", "wrongpassword")
      loginPage.submit()

      pageTitle must be ("SOTA Admin UI - Log in")
    }

    def post(username: String, password: String): WSResponse = {
      await(
        wsCall(routes.LoginController.authenticate())
            .post(Map("username" -> Seq(username), "password" -> Seq(password)))
      )
    }

    "reject if username or password are not set" in {
      post("", "123").status must be (play.api.http.Status.BAD_REQUEST)
      post("123", "").status must be (play.api.http.Status.BAD_REQUEST)
      post("", "").status must be (play.api.http.Status.BAD_REQUEST)
    }

    val controller = app.injector.instanceOf[LoginController]

    "set session token" in {
      val req = FakeRequest().withFormUrlEncodedBody(("username", correctUser), ("password", correctPassword))
      val result = controller.authenticate()(req)
      status(result) mustBe SEE_OTHER
      // redirects to login page on correct user data:
      redirectLocation(result) mustBe Some("/")
      val sess = session(result)
      sess("access_token") mustBe token
      sess("username") mustBe correctUser
    }
  }

  override protected def afterAll(): Unit = wsClient.close()
}
