libraryDependencies ++= Seq(
  Dependencies.SotaResolver,
  Dependencies.JsonWebSecurityAkka
) ++ Dependencies.JsonWebSecurity

dockerExposedPorts := Seq(8081)

dockerBaseImage := "java:openjdk-8-jre"

maintainer in Docker := "dev@advancedtelematic.com"

packageName in Docker := "ota-plus-resolver"

dockerRepository in Docker := Some("advancedtelematic")

dockerUpdateLatest in Docker := true

enablePlugins(SbtWeb, Versioning.Plugin)

buildInfoPackage := "com.advancedtelematic.ota.resolver"

Versioning.settings

Release.settings

enablePlugins(DockerPlugin, JavaAppPackaging)
