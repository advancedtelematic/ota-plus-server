import com.typesafe.sbt.packager.docker.Cmd
import play.sbt.PlaySettings
import play.sbt.routes.RoutesKeys

PlaySettings.defaultScalaSettings

scalacOptions += "-Ypartial-unification"

RoutesKeys.routesImport ++= Seq(
  "com.advancedtelematic.api.ApiVersion._",
  "com.advancedtelematic.controllers.PathBinders._",

  "com.advancedtelematic.controllers.FeatureName",
  "java.util.UUID",
  "com.advancedtelematic.libtuf.data.TufDataType.KeyType",
  "com.advancedtelematic.libtuf.data.TufDataType.RsaKeyType"
)

RoutesKeys.routesGenerator := InjectedRoutesGenerator

testOptions in UnitTests += Tests.Argument(TestFrameworks.ScalaTest, "-l", "BrowserTests")

testOptions in BrowserTests += Tests.Argument(TestFrameworks.ScalaTest, "-n", "BrowserTests")

dockerExposedPorts := Seq(9000)

maintainer in Docker := "dev@advancedtelematic.com"

packageName in Docker := "ota-plus-web"

dockerRepository := Some("advancedtelematic")

dockerUpdateLatest := true

dockerBaseImage := "openjdk:8u151-jre-alpine"

dockerCommands ++= Seq(
  Cmd("USER", "root"),
  Cmd("RUN", "apk upgrade --update && apk add --update bash coreutils"),
  Cmd("USER", (daemonUser in Docker).value)
)

bashScriptExtraDefines ++= Seq("""addJava "-Xmx800m"""")

dependencyOverrides ++= Dependencies.Netty

libraryDependencies ++= Seq(
  ws,
  guice,
  cacheApi,
  Dependencies.LibTuf,
  Dependencies.LibTufServer,
  Dependencies.jose4j
) ++
Dependencies.TestFrameworks ++
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
  val propFile = new File(baseDirectory.value + "/../deploy", "version.properties")
  IO.write(propFile, version.value)
  Seq(propFile)
}

val runWebpack = taskKey[Seq[Int]]("Run webpack")

runWebpack := {
  Seq(
    Process(
      "docker" :: "run" ::
        "--rm" ::
        "--volume" :: s"${baseDirectory.value.toString}/app:/app" ::
        "advancedtelematic/webpack" ::
        "bash" :: "-c" :: "cd reactapp && npm install && webpack -p" ::
        Nil
    ) !
  )
}

buildInfoPackage := "com.advancedtelematic.ota.web"
