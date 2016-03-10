object Version {

  val Circe = "0.2.0"

  val Refined = "0.3.1"
}

object Dependencies {
  import sbt._

  lazy val Circe = Seq(
    "io.circe" %% "circe-core"    % Version.Circe,
    "io.circe" %% "circe-generic" % Version.Circe,
    "io.circe" %% "circe-parse"   % Version.Circe
  )

  lazy val Refined = "eu.timepit" %% "refined" % Version.Refined

//  lazy val Scalaz = "org.scalaz" %% "scalaz-core" % "7.1.3"

  lazy val ScalaTest = "org.scalatest" % "scalatest_2.11" % "2.2.4"

  lazy val ScalaCheck = "org.scalacheck" %% "scalacheck" % "1.12.4"

  lazy val TestFrameworks = Seq( ScalaTest, ScalaCheck )

  lazy val NscalaTime = "com.github.nscala-time" %% "nscala-time" % "2.0.0"

  lazy val ParserCombinators = "org.scala-lang.modules" %% "scala-parser-combinators" % "1.0.4"

  lazy val CommonsCodec = "commons-codec" % "commons-codec" % "1.10"

}
