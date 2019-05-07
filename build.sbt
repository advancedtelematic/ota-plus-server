name := "ota-plus"

def otaPlusProject(name: String): Project = Project(name, file(name))
    .settings(organization := "com.advancedtelematic")
    .settings(scalaVersion := "2.12.4")
    .settings(scalacOptions in Compile ++= Seq(
      "-encoding", "UTF-8",
      "-target:jvm-1.8",
      "-deprecation",
      "-feature",
      "-unchecked",
      "-Xlog-reflective-calls",
      "-Xlint",
      "-language:higherKinds"))
    .settings(javacOptions in compile ++= Seq(
      "-encoding", "UTF-8",
      "-source", "1.8",
      "-target", "1.8",
      "-Xlint:unchecked",
      "-Xlint:deprecation"))
    .settings(dependencyOverrides ++= Seq(
      "org.scala-lang" % "scala-reflect" % scalaVersion.value,
      "org.scala-lang" % "scala-library" % scalaVersion.value,
      "org.scala-lang.modules" % "scala-xml_2.12" % "1.1.0",
      "org.scala-lang.modules" %% "scala-parser-combinators" % "1.0.4",
      "com.google.guava" % "guava" % "18.0"
    ))
    .settings(resolvers ++= atsRepos)
    .settings(shellPrompt in ThisBuild := { state => Project.extract(state).currentRef.project + "> " })
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
