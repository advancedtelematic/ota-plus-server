import play.sbt.PlaySettings

name := "ota-plus-server"

lazy val Library = new {
  object Version {
    val Akka            = "2.5.9"
    val MockWs          = "2.6.2"
    val LibAts          = "0.3.0-109-ge12f057"
    val LibTuf          = "0.7.1-6-gd36661d"
    val Netty           = "4.1.19.Final"
    val ScalaCheck      = "1.13.4"
    val ScalaTestPlay   = "3.1.2"
    val Jose4j          = "0.6.3"
  }

  lazy val AkkaTestKit    = "com.typesafe.akka" %% "akka-testkit" % Version.Akka
  lazy val ScalaCheck     = "org.scalacheck" %% "scalacheck" % Version.ScalaCheck
  lazy val ScalaTestPlay  = "org.scalatestplus.play" %% "scalatestplus-play" % Version.ScalaTestPlay
  lazy val MockWs         = "de.leanovate.play-mockws" %% "play-mockws" % Version.MockWs
  lazy val TestFrameworks = Seq(ScalaCheck, ScalaTestPlay, MockWs, AkkaTestKit).map(_ % "test")
  lazy val jose4j         = "org.bitbucket.b_c" % "jose4j" % Version.Jose4j
  val LibAts = Set(
    "com.advancedtelematic" %% "libats",
    "com.advancedtelematic" %% "libats-logging",
    "com.advancedtelematic" %% "libats-metrics",
  ).map(_ % Version.LibAts)

  lazy val LibTuf       = "com.advancedtelematic" %% "libtuf"        % Version.LibTuf
  lazy val LibTufServer = "com.advancedtelematic" %% "libtuf-server" % Version.LibTuf

  val Netty = Seq("io.netty" % "netty-handler", "io.netty" % "netty-codec").map(_ % Version.Netty)
}



lazy val releaseSettings = {

  import sbt.Keys._
  import sbt._

  import sbtrelease.ReleaseStateTransformations._
  import sbtrelease.ReleasePlugin.autoImport._
  import sbtrelease._

  Seq(
    releaseIgnoreUntrackedFiles := true,
    releaseProcess := Seq(
      checkSnapshotDependencies,
      releaseStepCommand("mkVersionProperties"),
      releaseStepCommand("runWebpack"),
      releaseStepCommand("docker:publish")
    )
  )
}

lazy val compilerSettings = Seq(
  scalacOptions in Compile ++= Seq("-encoding",
                                   "UTF-8",
                                   "-target:jvm-1.8",
                                   "-deprecation",
                                   "-feature",
                                   "-unchecked",
                                   "-Xlog-reflective-calls",
                                   "-Xlint",
                                   "-language:higherKinds"),
  javacOptions in compile ++= Seq("-encoding",
                                  "UTF-8",
                                  "-source",
                                  "1.8",
                                  "-target",
                                  "1.8",
                                  "-Xlint:unchecked",
                                  "-Xlint:deprecation")
)

lazy val dockerSettings = {
  Seq(
    dockerExposedPorts := Seq(9000),
    maintainer in Docker := "OTA_Dev@here.com",
    packageName in Docker := "ota-plus-web",
    daemonUserUid in Docker := None,
    daemonUser in Docker := "daemon",
    dockerRepository := Some("advancedtelematic"),
    dockerUpdateLatest := true,
    dockerBaseImage := "advancedtelematic/alpine-jre:adoptopenjdk-jre8u262-b10",
    dockerAliases += dockerAlias.value.withTag(git.gitHeadCommit.value)
  )
}

lazy val routesSettings = {
  import play.sbt.routes.RoutesKeys
  Seq(
    RoutesKeys.routesImport ++= Seq(
      "com.advancedtelematic.api.ApiVersion._",
      "com.advancedtelematic.controllers.PathBinders._",
      "com.advancedtelematic.controllers.FeatureName",
      "java.util.UUID",
      "com.advancedtelematic.libats.data.DataType.Namespace",
      "com.advancedtelematic.libtuf.data.TufDataType.KeyType",
      "com.advancedtelematic.libtuf.data.TufDataType.RsaKeyType"
    ),
    RoutesKeys.routesGenerator := InjectedRoutesGenerator
  )
}

lazy val buildinfoSettings = Seq(
  buildInfoPackage := "com.advancedtelematic.ota.web",
  buildInfoOptions ++= Seq(BuildInfoOption.ToJson, BuildInfoOption.ToMap)
)

lazy val sonarSettings = Seq(
  sonarProperties ++= Map(
  "sonar.projectName" -> "OTA Connect Web App",
  "sonar.projectKey" -> "ota-connect-web-app",
  "sonar.sources" -> "ota-plus-web/app",
  "sonar.tests" -> "ota-plus-web/test",
  "sonar.scala.scoverage.reportPath" -> "ota-plus-web/target/scala-2.12/scoverage-report/scoverage.xml",
  "sonar.host.url" -> "http://sonar.in.here.com",
  "sonar.links.issue" -> "https://saeljira.it.here.com/projects/OTA/issues",
  "sonar.links.scm" -> "https://main.gitlab.in.here.com/olp/edge/ota/connect/web-app/ota-plus-server",
  "sonar.links.ci" -> "https://main.gitlab.in.here.com/olp/edge/ota/connect/web-app/ota-plus-server/pipelines",
  "sonar.projectVersion" -> version.value,
  "sonar.language" -> "scala"))

lazy val `ota-plus-web` = project.in(file("ota-plus-web"))
    .settings(organization := "com.advancedtelematic")
    .settings(scalaVersion := "2.12.4")
    .settings(compilerSettings)
    .settings(
      dependencyOverrides ++= Seq(
        "org.scala-lang"         % "scala-reflect"             % scalaVersion.value,
        "org.scala-lang"         % "scala-library"             % scalaVersion.value,
        "org.scala-lang.modules" % "scala-xml_2.12"            % "1.1.0",
        "org.scala-lang.modules" %% "scala-parser-combinators" % "1.0.4",
        "com.google.guava"       % "guava"                     % "18.0"
      )
    )
    .settings(resolvers ++= atsRepos)
    .settings(shellPrompt in ThisBuild := { state =>
      Project.extract(state).currentRef.project + "> "
    })
    .settings(libraryDependencies += filters)
    .settings(libraryDependencies ++= Library.TestFrameworks)
    .settings(
      libraryDependencies ++= Seq(
        ws,
        guice,
        cacheApi,
        Library.LibTuf,
        Library.LibTufServer,
        Library.jose4j,
        "io.zipkin.brave.play" %% "play-zipkin-tracing-play" % "3.0.2-ATS",
      ) ++
        Library.LibAts
    )
    .settings(
      testOptions in Test ++= Seq(Tests.Argument(TestFrameworks.ScalaTest, "-u", "target/test-reports"),
                                  Tests.Argument(TestFrameworks.ScalaTest, "-oDF"))
    )
    .settings(testFrameworks := Seq(sbt.TestFrameworks.ScalaTest))
    .settings(fork in Test := false) // PRO-157
    .settings(publish := (()))
    .settings(releaseSettings)
    .settings(dockerSettings)
    .settings(PlaySettings.defaultScalaSettings)
    .settings(routesSettings)
    .enablePlugins(BuildInfoPlugin, PlayScala, PlayNettyServer, GitVersioning)
    .disablePlugins(PlayAkkaHttpServer)
    .settings(buildinfoSettings)
    .settings(sonarSettings)

lazy val atsRepos = Seq(
  "ATS Releases" at "https://nexus.ota.here.com/content/repositories/releases",
  "ATS Snapshots" at "https://nexus.ota.here.com/content/repositories/snapshots"
)
