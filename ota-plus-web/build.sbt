import play.sbt.PlaySettings
import play.sbt.routes.RoutesKeys

PlaySettings.defaultScalaSettings

play.sbt.routes.RoutesKeys.routesImport ++= Seq(
  "org.genivi.webserver.controllers.PathBinders._",
  "org.genivi.webserver.controllers.ArtifactType",
  "org.genivi.webserver.controllers.PackageManager",
  "org.genivi.webserver.controllers.Architecture",
  "org.genivi.webserver.controllers.FeatureName",
  "org.genivi.sota.data.Namespace",
  "org.genivi.sota.data.Uuid"
)

RoutesKeys.routesGenerator := InjectedRoutesGenerator

testOptions in UnitTests += Tests.Argument(TestFrameworks.ScalaTest, "-l", "BrowserTests")

testOptions in BrowserTests += Tests.Argument(TestFrameworks.ScalaTest, "-n", "BrowserTests")

//resolvers += "scalaz-bintray"  at "http://dl.bintray.com/scalaz/releases"

dockerExposedPorts := Seq(9000)

maintainer in Docker := "dev@advancedtelematic.com"

packageName in Docker := "ota-plus-web"

dockerRepository in Docker := Some("advancedtelematic")

dockerUpdateLatest in Docker := true

bashScriptExtraDefines ++= Seq("""addJava "-Xmx800m"""")

libraryDependencies ++= Seq (
    Dependencies.AkkaHttp,
    Dependencies.AkkaStream,
    Dependencies.AkkaPersistence,
    Dependencies.CassandraForAkkaPersistence,
    Dependencies.AkkaTestKit,
    "org.scalatestplus.play" %% "scalatestplus-play" % "1.5.0",
    "org.webjars" %% "webjars-play" % "2.4.0-1",
    "org.webjars" % "webjars-locator" % "0.27",
    "com.amazonaws" % "aws-java-sdk-ses" % "1.11.13",
    ws, Dependencies.MockWs,
    play.sbt.Play.autoImport.cache,
    Dependencies.SotaCommonMessaging,
    Dependencies.SotaCommonTest
    ) ++ Dependencies.JsonWebSecurity ++ Dependencies.LogTree

enablePlugins(PlayScala, Versioning.Plugin)

Versioning.settings

Release.settings

lazy val UnitTests = config("ut") extend Test

lazy val BrowserTests = config("bt") extend Test

configs(UnitTests, BrowserTests)

inConfig(UnitTests)(Defaults.testTasks)

inConfig(BrowserTests)(Defaults.testTasks)

val mkVersionProperties = taskKey[Seq[File]]("Makes version.properties file")

mkVersionProperties := {
  val propFile = new File( baseDirectory.value + "/../deploy", "version.properties")
  IO.write(propFile, version.value)
  Seq(propFile)
}

buildInfoPackage := "com.advancedtelematic.ota.web"
