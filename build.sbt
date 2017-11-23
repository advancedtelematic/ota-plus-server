name := "ota-plus"

scalafmtConfig in ThisBuild := Some(file(".scalafmt"))

def otaPlusProject(name: String): Project = Project(name, file(name))
    .settings(organization := "com.advancedtelematic")
    .settings(scalaVersion := "2.11.11")
    .settings(scalacOptions in Compile ++= Seq(
      "-encoding", "UTF-8",
      "-target:jvm-1.7",
      "-deprecation",
      "-feature",
      "-unchecked",
      "-Xlog-reflective-calls",
      "-Xlint",
      "-language:higherKinds"))
    .settings(javacOptions in compile ++= Seq(
      "-encoding", "UTF-8",
      "-source", "1.7",
      "-target", "1.7",
      "-Xlint:unchecked",
      "-Xlint:deprecation"))
    .settings(dependencyOverrides ++= Set(
      "org.scala-lang" % "scala-reflect" % scalaVersion.value,
      "org.scala-lang" % "scala-library" % scalaVersion.value,
      "org.scala-lang.modules" %% "scala-xml" % "1.0.4",
      "org.scala-lang.modules" %% "scala-parser-combinators" % "1.0.4",
      "com.google.guava" % "guava" % "18.0"
    ))
    .settings(resolvers ++= atsRepos)
    .settings(shellPrompt in ThisBuild := { state => Project.extract(state).currentRef.project + "> " })
    .settings(fullResolvers := Seq(
      Resolver.defaultLocal,
      "ATS Public" at "http://nexus.advancedtelematic.com:8081/content/groups/public/",
      DefaultMavenRepository,
      projectResolver.value,
      "version99 Empty loggers" at "http://version99.qos.ch"
    ))
    .settings(libraryDependencies += filters)
    .settings(libraryDependencies ++= Dependencies.TestFrameworks)
    .settings(
      testOptions in Test ++= Seq(
        Tests.Argument(TestFrameworks.ScalaTest, "-u", "target/test-reports"),
        Tests.Argument(TestFrameworks.ScalaTest, "-oDF"))
    )
    .settings(testFrameworks := Seq(sbt.TestFrameworks.ScalaTest))
    .settings(fork in Test := false) // PRO-157
    .settings(publish := ())
    .enablePlugins(BuildInfoPlugin)
    .settings(buildInfoOptions ++= Seq(BuildInfoOption.ToJson, BuildInfoOption.ToMap))

lazy val atsRepos = Seq(
  "ATS Releases" at "http://nexus.advancedtelematic.com:8081/content/repositories/releases",
  "ATS Snapshots" at "http://nexus.advancedtelematic.com:8081/content/repositories/snapshots"
)

lazy val otaPlusWeb = otaPlusProject("ota-plus-web")

lazy val rootProject = (project in file(".")).
  aggregate(otaPlusWeb)
  .settings(Release.settings)
  .settings(publish := ())

publishArtifact := false
