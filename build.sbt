name := "ota-plus"

def otaPlusProject(name: String): Project = Project(name, file(name))
    .settings(organization := "com.advancedtelematic")
    .settings(scalaVersion := "2.11.8")
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
    .settings(shellPrompt in ThisBuild := { state => Project.extract(state).currentRef.project + "> " })
    .settings(libraryDependencies ++= Dependencies.TestFrameworks)
    .settings(
      testOptions in Test ++= Seq(
        Tests.Argument(TestFrameworks.ScalaTest, "-u", "target/test-reports"),
        Tests.Argument(TestFrameworks.ScalaTest, "-oDF"))
    )
    .settings(testFrameworks := Seq(sbt.TestFrameworks.ScalaTest))

lazy val sotaCommon = otaPlusProject("common")
    .settings(libraryDependencies ++= Seq(
      Dependencies.Refined,
      Dependencies.NscalaTime,
      "com.typesafe.akka" %% "akka-http-experimental" % "2.4.2",
      "de.heikoseeberger" %% "akka-http-circe" % "1.5.2"
    ) ++ Dependencies.Circe)

lazy val otaPlusWeb = otaPlusProject("ota-plus-web").dependsOn(sotaCommon)

publishArtifact := false
