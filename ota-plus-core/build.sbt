libraryDependencies ++= Seq(
  Dependencies.AkkaHttpTestKit,
  Dependencies.SotaCore,
  Dependencies.JsonWebSecurityAkka
) ++ Dependencies.JsonWebSecurity

dockerExposedPorts := Seq(8080)

dockerBaseImage := "java:openjdk-8-jre"

maintainer in Docker := "dev@advancedtelematic.com"

packageName in Docker := "ota-plus-core"

dockerRepository in Docker := Some("advancedtelematic")

dockerUpdateLatest in Docker := true

buildInfoPackage := "com.advancedtelematic.ota.core"

enablePlugins(SbtWeb, Versioning.Plugin)

Versioning.settings

Release.settings

enablePlugins(DockerPlugin, JavaAppPackaging)
