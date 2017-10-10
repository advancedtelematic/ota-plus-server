object Version {
  val Akka = "2.5.4"
  val JsonWebSecurity = "0.4.5"
  val MockWs = "2.6.2"
  val GeniviSota = "0.3.19"
  val LogTree = "1.3.0"
  val Scalaz = "7.2.0"
  val PlayJson = "2.6.0"
  val LibAts = "0.0.1-105-g8ae2ff0"
  val Netty = "4.1.15.Final"
  val ScalaCheck = "1.12.4"
  val ScalaTestPlay = "3.1.2"
}

object Dependencies {
  import sbt._

  lazy val PlayJson = "com.typesafe.play" %% "play-json" % Version.PlayJson

  lazy val AkkaTestKit = "com.typesafe.akka" %% "akka-testkit" % Version.Akka

  lazy val ScalaCheck = "org.scalacheck" %% "scalacheck" % Version.ScalaCheck

  lazy val ScalaTestPlay = "org.scalatestplus.play" %% "scalatestplus-play" % Version.ScalaTestPlay

  lazy val MockWs = "de.leanovate.play-mockws" %% "play-mockws" % Version.MockWs

  val SotaCommonTest = "org.genivi" %% "sota-common-test" % Version.GeniviSota

  lazy val TestFrameworks = Seq( ScalaCheck, ScalaTestPlay, MockWs, SotaCommonTest, AkkaTestKit ).map(_ % "test")

  val LibAts = Set(
    "com.advancedtelematic" %% "libats-messaging",
    "com.advancedtelematic" %% "libats-auth"
  ).map(_ % Version.LibAts)
  val JsonWebSecurity = Seq(
    "com.advancedtelematic" %% "jw-security-core" % Version.JsonWebSecurity,
    "com.advancedtelematic" %% "jw-security-jca" % Version.JsonWebSecurity
  )

  val LogTree = Seq(
    "com.casualmiracles" %% "treelog" % Version.LogTree,
    "org.scalaz" %% "scalaz-core" % Version.Scalaz
  )

  val JsonWebSecurityAkka = "com.advancedtelematic" %% "jw-security-akka-http" % Version.JsonWebSecurity

  val SotaCommon = Set(
    "org.genivi" %% "sota-common-data" % Version.GeniviSota
  )


  val Netty = Set("io.netty" % "netty-handler", "io.netty" % "netty-codec").map(_ % Version.Netty)
}
