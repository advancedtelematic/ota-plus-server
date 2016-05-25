libraryDependencies ++= Seq(
  Dependencies.SotaDevices
)

dockerExposedPorts := Seq(8083)

dockerBaseImage := "java:openjdk-8-jre"

maintainer in Docker := "dev@advancedtelematic.com"

packageName in Docker := "ota-plus-devices"

dockerRepository in Docker := Some("advancedtelematic")

dockerUpdateLatest in Docker := true

enablePlugins(SbtWeb, Versioning.Plugin)

Versioning.settings

Release.settings

enablePlugins(DockerPlugin, JavaAppPackaging)
