object Version {
  val Akka = "2.5.8"
  val JsonWebSecurity = "0.4.5"
  val MockWs = "2.6.2"
  val GeniviSota = "0.3.20"
  val LibAts = "0.1.0-5-g6b585f0"
  val LibTuf = "0.2.0-44-gda9b1e2"
  val Netty = "4.1.19.Final"
  val ScalaCheck = "1.12.4"
  val ScalaTestPlay = "3.1.2"
  val Jose4j = "0.6.3"
  val HereOauthClient = "0.4.11"
}

object Dependencies {
  import sbt._

  lazy val AkkaTestKit = "com.typesafe.akka" %% "akka-testkit" % Version.Akka

  lazy val ScalaCheck = "org.scalacheck" %% "scalacheck" % Version.ScalaCheck

  lazy val ScalaTestPlay = "org.scalatestplus.play" %% "scalatestplus-play" % Version.ScalaTestPlay

  lazy val MockWs = "de.leanovate.play-mockws" %% "play-mockws" % Version.MockWs

  val SotaCommonTest = "org.genivi" %% "sota-common-test" % Version.GeniviSota

  lazy val TestFrameworks = Seq( ScalaCheck, ScalaTestPlay, MockWs, SotaCommonTest, AkkaTestKit ).map(_ % "test")

  lazy val jose4j = "org.bitbucket.b_c" % "jose4j" % Version.Jose4j
  val LibAts = Set(
    "com.advancedtelematic" %% "libats-messaging",
    "com.advancedtelematic" %% "libats-auth"
  ).map(_ % Version.LibAts)

  lazy val LibTuf = "com.advancedtelematic" %% "libtuf" % Version.LibTuf

  val SotaCommon = Set(
    "org.genivi" %% "sota-common-data" % Version.GeniviSota
  )

  val HereOauthClient = "com.here.account" % "here-oauth-client" % Version.HereOauthClient

  val Netty = Set("io.netty" % "netty-handler", "io.netty" % "netty-codec").map(_ % Version.Netty)
}
