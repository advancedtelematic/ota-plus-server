package com.advancedtelematic

import akka.actor.{ActorRef, ActorSystem}
import akka.stream.Materializer
import akka.testkit.TestProbe
import com.advancedtelematic.LoggingFilterSpec.{ActionHandler, MyRouter}
import com.advancedtelematic.libats.http.logging.RequestLoggingActor.LogMsg
import com.google.inject.AbstractModule
import com.google.inject.name.Names
import javax.inject.Inject
import org.scalatest.prop.GeneratorDrivenPropertyChecks
import org.scalatest.{Assertion, FunSuite, Matchers}
import play.api.Application
import play.api.http.HttpFilters
import play.api.inject.bind
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.libs.json._
import play.api.mvc.Results._
import play.api.mvc._
import play.api.routing.{Router, SimpleRouterImpl}
import play.api.test.FakeRequest
import play.api.test.Helpers._

import scala.concurrent.Future

class FakeLoggingActorModule(implicit as: ActorSystem) extends AbstractModule {

  val probe = TestProbe()

  override def configure(): Unit = {
    bind(classOf[ActorRef])
      .annotatedWith(Names.named("logging-actor"))
      .toInstance(probe.ref)
  }
}


object LoggingFilterSpec {

  class Filters @Inject()(loggingFilter: LoggingFilter)(implicit val materializer: Materializer)
    extends HttpFilters {
    def filters: Seq[EssentialFilter] = Seq(loggingFilter)
  }


  case class ActionHandler(result: RequestHeader => Result) extends (RequestHeader => Result) {
    def apply(rh: RequestHeader): Result = result(rh)
  }

  class MyRouter @Inject()(action: DefaultActionBuilder, result: ActionHandler)
      extends SimpleRouterImpl(
        { case request => action(result(request)) }
      )

}

class LoggingFilterSpec extends FunSuite with Matchers with GeneratorDrivenPropertyChecks {

  implicit val actorSystem: ActorSystem = ActorSystem("test")

  lazy val module: FakeLoggingActorModule = new FakeLoggingActorModule()

  def newApplication(result: RequestHeader => Result): Application = {
    val builder = GuiceApplicationBuilder()
      .configure("play.modules.disabled" -> List("com.advancedtelematic.LoggingActorModule"))
      .overrides(
        bind[ActionHandler].to(ActionHandler(result)),
        bind[Router].to[MyRouter],
        bind[ActorSystem].toInstance(actorSystem))
      .bindings(module)
    builder.build
  }

  def withApplication[T](result: RequestHeader => Result)(block: Application => T): T = {
    val app = newApplication(result)
    running(app)(block(app))
  }

  def request(app: Application): Future[Result] = {
    val req = FakeRequest(method = GET, path = "/test?key1=value1&key2=value2")
    route(app, req).get
  }

  def jsonChecker(result: Result, jsonPath: String, expectedValue: String): Assertion =
    withApplication(_ => result) { app =>
      request(app)
      val msg = Json.parse(module.probe.expectMsgType[LogMsg].formattedMsg)
      (msg \ jsonPath).as[String] shouldEqual expectedValue
    }

  test("LoggingFilter has proper type") {
    withApplication(_ => Ok("")) { app =>
      request(app)
      module.probe.expectMsgType[LogMsg]
    }
  }

  test("LoggingFilter logs https_status") {
    jsonChecker(Ok(""), "http_status", OK.toString)
  }

  test("LoggingFilter logs http_query") {
    jsonChecker(InternalServerError(""), "http_query", "'key1=value1&key2=value2'")
  }

  test("LoggingFilter logs http_path") {
    jsonChecker(Ok(""), "http_path", "/test")
  }

  test("LoggingFilter logs http_service_name") {
    jsonChecker(Ok(""), "http_service_name", LoggingFilter.serviceName)
  }

}
