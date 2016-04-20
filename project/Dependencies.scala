object Version {

  val Circe = "0.3.0"
  val Refined = "0.3.1"
  val Akka = "2.4.4"
  val JsonWebSecurity = "0.2.1"
  val MockWs = "2.5.0"
  val GeniviSota = "0.1.7"
  val GeniviResolver = GeniviSota
  // Version 0.11 of akka-persistence-cassandra depends on Akka 2.4.2 and Scala 2.11.6.
  // It is compatible with Cassandra 3.0.0 or higher
  // Details at https://github.com/akka/akka-persistence-cassandra
  val AkkaCassandra = "0.11"
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

  lazy val AkkaHttp = "com.typesafe.akka" %% "akka-http-experimental" % Version.Akka

  val AkkaTestKit = "com.typesafe.akka" %% "akka-testkit" % Version.Akka % "test"

  lazy val CassandraForAkkaPersistence = "com.typesafe.akka" %% "akka-persistence-cassandra" % Version.AkkaCassandra

  lazy val ScalaTest = "org.scalatest" % "scalatest_2.11" % "2.2.4"

  lazy val ScalaCheck = "org.scalacheck" %% "scalacheck" % "1.12.4"

  lazy val TestFrameworks = Seq( ScalaTest, ScalaCheck )

  lazy val NscalaTime = "com.github.nscala-time" %% "nscala-time" % "2.0.0"

  lazy val ParserCombinators = "org.scala-lang.modules" %% "scala-parser-combinators" % "1.0.4"

  lazy val CommonsCodec = "commons-codec" % "commons-codec" % "1.10"

  lazy val MockWs = "de.leanovate.play-mockws" %% "play-mockws" % Version.MockWs % "test"

  val JsonWebSecurity = Seq(
    "com.advancedtelematic" %% "jw-security-core" % Version.JsonWebSecurity,
    "com.advancedtelematic" %% "jw-security-jca" % Version.JsonWebSecurity
  )

  val JsonWebSecurityAkka = "com.advancedtelematic" %% "jw-security-akka-http" % Version.JsonWebSecurity

  val SotaCore = "org.genivi" %% "sota-core" % Version.GeniviSota

  val SotaCommonData = "org.genivi" %% "sota-common-data" % Version.GeniviSota

  val SotaCommonTest = "org.genivi" %% "sota-common-test" % Version.GeniviSota % "test"

  val SotaResolver = "org.genivi" %% "sota-resolver" % Version.GeniviResolver
}
