import play.sbt.PlaySettings
import play.sbt.routes.RoutesKeys

PlaySettings.defaultScalaSettings

play.sbt.routes.RoutesKeys.routesImport ++= Seq(
  "com.advancedtelematic.api.ApiVersion._",
  "com.advancedtelematic.controllers.PathBinders._",
  "com.advancedtelematic.controllers.ArtifactType",
  "com.advancedtelematic.controllers.PackageManager",
  "com.advancedtelematic.controllers.Architecture",
  "com.advancedtelematic.controllers.FeatureName",
  "org.genivi.sota.data.Namespace",
  "org.genivi.sota.data.Uuid"
)

RoutesKeys.routesGenerator := InjectedRoutesGenerator

testOptions in UnitTests += Tests.Argument(TestFrameworks.ScalaTest, "-l", "BrowserTests")

testOptions in BrowserTests += Tests.Argument(TestFrameworks.ScalaTest, "-n", "BrowserTests")

dockerExposedPorts := Seq(9000)

maintainer in Docker := "dev@advancedtelematic.com"

packageName in Docker := "ota-plus-web"

dockerRepository := Some("advancedtelematic")

dockerUpdateLatest := true

bashScriptExtraDefines ++= Seq("""addJava "-Xmx800m"""")

dependencyOverrides ++= Dependencies.Netty

libraryDependencies ++= Seq (
    Dependencies.CassandraForAkkaPersistence,
    ws,
    guice,
    Dependencies.PlayJson
    ) ++
  Dependencies.TestFrameworks ++
  Dependencies.JsonWebSecurity ++
  Dependencies.LogTree ++
  Dependencies.SotaCommon ++
  Dependencies.LibAts

enablePlugins(PlayScala, PlayNettyServer, Versioning.Plugin)

disablePlugins(PlayAkkaHttpServer)

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

val runWebpack = taskKey[Seq[Int]]("Run webpack")

runWebpack := {
  Seq(Process(
    "docker" :: "run" ::
    "--rm" ::
    "--volume" :: s"${baseDirectory.value.toString}/app:/app" ::
    "advancedtelematic/webpack" ::
    "bash" :: "-c" :: "cd reactapp && npm install && webpack" ::
    Nil)!
  )
}

buildInfoPackage := "com.advancedtelematic.ota.web"
