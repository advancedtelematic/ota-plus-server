object Version {
  val Akka = "2.5.9"
  val JsonWebSecurity = "0.4.5"
  val MockWs = "2.6.2"
  val LibAts = "0.2.1-15-g7cd2082"
  val LibTuf = "0.4.0-10-ge535619"
  val Netty = "4.1.19.Final"
  val ScalaCheck = "1.13.4"
  val ScalaTestPlay = "3.1.2"
  val Jose4j = "0.6.3"
}

object Dependencies {
  import sbt._

  lazy val AkkaTestKit = "com.typesafe.akka" %% "akka-testkit" % Version.Akka

  lazy val ScalaCheck = "org.scalacheck" %% "scalacheck" % Version.ScalaCheck

  lazy val ScalaTestPlay = "org.scalatestplus.play" %% "scalatestplus-play" % Version.ScalaTestPlay

  lazy val MockWs = "de.leanovate.play-mockws" %% "play-mockws" % Version.MockWs

  lazy val TestFrameworks = Seq( ScalaCheck, ScalaTestPlay, MockWs, AkkaTestKit ).map(_ % "test")

  lazy val jose4j = "org.bitbucket.b_c" % "jose4j" % Version.Jose4j
  val LibAts = Set(
    "com.advancedtelematic" %% "libats-messaging"
  ).map(_ % Version.LibAts)

  lazy val LibTuf = "com.advancedtelematic" %% "libtuf" % Version.LibTuf
  lazy val LibTufServer = "com.advancedtelematic" %% "libtuf-server" % Version.LibTuf

  val Netty = Seq("io.netty" % "netty-handler", "io.netty" % "netty-codec").map(_ % Version.Netty)
}
