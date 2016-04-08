import play.sbt.PlaySettings
import play.sbt.routes.RoutesKeys
import sbtbuildinfo.BuildInfoKeys._
import sbtbuildinfo._

PlaySettings.defaultScalaSettings

play.sbt.routes.RoutesKeys.routesImport ++= Seq(
  "org.genivi.webserver.controllers.PathBinders._",
  "org.genivi.webserver.controllers.PackageType",
  "org.genivi.webserver.controllers.Architecture",
  "com.advancedtelematic.ota.vehicle.Vehicle"
)

RoutesKeys.routesGenerator := InjectedRoutesGenerator

testOptions in UnitTests += Tests.Argument(TestFrameworks.ScalaTest, "-l", "APITests BrowserTests")

testOptions in IntegrationTests += Tests.Argument(TestFrameworks.ScalaTest, "-n", "APITests")

testOptions in BrowserTests += Tests.Argument(TestFrameworks.ScalaTest, "-n", "BrowserTests")

//resolvers += "scalaz-bintray"  at "http://dl.bintray.com/scalaz/releases"

dockerExposedPorts := Seq(9000)

libraryDependencies ++= Seq (
    Dependencies.AkkaPersistence,
    Dependencies.AkkaTestKit,
    "org.scalatestplus.play" %% "scalatestplus-play" % "1.5.0",
    "org.webjars" %% "webjars-play" % "2.4.0-1",
    "org.webjars" % "webjars-locator" % "0.27",
    "org.webjars.bower" % "react" % "0.13.3",
    "org.webjars.bower" % "react-router" % "0.13.3",
    "org.webjars.bower" % "flux" % "2.0.2",
    "org.webjars.bower" % "backbone" % "1.2.1",
    "org.webjars" % "bootstrap" % "3.3.4",
    ws, Dependencies.MockWs,
    play.sbt.Play.autoImport.cache
  ) ++ Dependencies.JsonWebSecurity

enablePlugins(PlayScala, SbtWeb, Versioning.Plugin)

Versioning.settings

Release.settings

lazy val UnitTests = config("ut") extend Test

lazy val IntegrationTests = config("it") extend Test

lazy val BrowserTests = config("bt") extend Test

configs(UnitTests, IntegrationTests, BrowserTests)

inConfig(UnitTests)(Defaults.testTasks)

inConfig(IntegrationTests)(Defaults.testTasks)

inConfig(BrowserTests)(Defaults.testTasks)

