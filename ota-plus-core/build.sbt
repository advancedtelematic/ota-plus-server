import sbtbuildinfo.BuildInfoKeys._
import sbtbuildinfo._
import com.typesafe.sbt.packager.docker._

dockerExposedPorts := Seq(8080)

dockerBaseImage := "java:openjdk-8-jre"

enablePlugins(SbtWeb, Versioning.Plugin)

Versioning.settings

Release.settings

enablePlugins(DockerPlugin, JavaAppPackaging)

