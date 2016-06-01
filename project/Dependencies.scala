object Version {
  val Akka = "2.4.4"
  val JsonWebSecurity = "0.2.1"
  val MockWs = "2.5.0"
  val GeniviSota = "0.1.71"
  val GeniviResolver = GeniviSota
  // Version 0.11 of akka-persistence-cassandra depends on Akka 2.4.2 and Scala 2.11.6.
  // It is compatible with Cassandra 3.0.0 or higher
  // Details at https://github.com/akka/akka-persistence-cassandra
  val AkkaCassandra = "0.14"
}

object Dependencies {
  import sbt._

  lazy val AkkaPersistence = "com.typesafe.akka" %% "akka-persistence" % Version.Akka

  lazy val AkkaHttp = "com.typesafe.akka" %% "akka-http-experimental" % Version.Akka

  lazy val AkkaStream = "com.typesafe.akka" %% "akka-stream" % Version.Akka

  lazy val AkkaTestKit = "com.typesafe.akka" %% "akka-testkit" % Version.Akka % "test"

  lazy val AkkaHttpTestKit = "com.typesafe.akka" %% "akka-http-testkit" % Version.Akka % "test"

  lazy val CassandraForAkkaPersistence = "com.typesafe.akka" %% "akka-persistence-cassandra" % Version.AkkaCassandra

  lazy val ScalaTest = "org.scalatest" % "scalatest_2.11" % "2.2.4"

  lazy val ScalaCheck = "org.scalacheck" %% "scalacheck" % "1.12.4"

  lazy val TestFrameworks = Seq( ScalaTest, ScalaCheck )

  lazy val MockWs = "de.leanovate.play-mockws" %% "play-mockws" % Version.MockWs % "test"

  val JsonWebSecurity = Seq(
    "com.advancedtelematic" %% "jw-security-core" % Version.JsonWebSecurity,
    "com.advancedtelematic" %% "jw-security-jca" % Version.JsonWebSecurity
  )

  val JsonWebSecurityAkka = "com.advancedtelematic" %% "jw-security-akka-http" % Version.JsonWebSecurity

  val SotaCore = "org.genivi" %% "sota-core" % Version.GeniviSota

  val SotaCommon = "org.genivi" %% "sota-common" % Version.GeniviSota

  val SotaCommonData = "org.genivi" %% "sota-common-data" % Version.GeniviSota

  val SotaCommonTest = "org.genivi" %% "sota-common-test" % Version.GeniviSota % "test"

  val SotaResolver = "org.genivi" %% "sota-resolver" % Version.GeniviResolver

  val SotaDeviceRegistry = "org.genivi" %% "sota-device_registry" % Version.GeniviSota
}
