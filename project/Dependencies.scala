object Version {

  val Circe = "0.3.0"
  val Refined = "0.3.1"
  val Akka = "2.4.2"
  val JsonWebSecurity = "0.1.2"
  val MockWs = "2.5.0"
}

object Dependencies {
  import sbt._

  lazy val Circe = Seq(
    "io.circe" %% "circe-core"    % Version.Circe,
    "io.circe" %% "circe-generic" % Version.Circe,
    "io.circe" %% "circe-parser"   % Version.Circe
  )

  lazy val Refined = "eu.timepit" %% "refined" % Version.Refined

  lazy val AkkaPersistence = "com.typesafe.akka" %% "akka-persistence" % Version.Akka

  val AkkaTestKit = "com.typesafe.akka" %% "akka-testkit" % Version.Akka % "test"

//  lazy val Scalaz = "org.scalaz" %% "scalaz-core" % "7.1.3"

  lazy val ScalaTest = "org.scalatest" % "scalatest_2.11" % "2.2.4"

  lazy val ScalaCheck = "org.scalacheck" %% "scalacheck" % "1.12.4"

  lazy val TestFrameworks = Seq( ScalaTest, ScalaCheck )

  lazy val NscalaTime = "com.github.nscala-time" %% "nscala-time" % "2.0.0"

  lazy val ParserCombinators = "org.scala-lang.modules" %% "scala-parser-combinators" % "1.0.4"

  lazy val CommonsCodec = "commons-codec" % "commons-codec" % "1.10"

  lazy val MockWs = "de.leanovate.play-mockws" %% "play-mockws" % Version.MockWs % "test"

  val JsonWebSecurity = Seq(
    "com.advancedtelematic" %% "jw-security-circe" % Version.JsonWebSecurity,
    "com.advancedtelematic" %% "jw-security-jca" % Version.JsonWebSecurity
  )

}
