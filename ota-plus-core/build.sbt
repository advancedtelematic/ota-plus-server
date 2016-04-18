libraryDependencies ++= Seq(
  Dependencies.SotaCore,
  Dependencies.JsonWebSecurityAkka
) ++ Dependencies.JsonWebSecurity

dockerExposedPorts := Seq(8080)

dockerBaseImage := "java:openjdk-8-jre"

enablePlugins(SbtWeb, Versioning.Plugin)

Versioning.settings

Release.settings

enablePlugins(DockerPlugin, JavaAppPackaging)

