libraryDependencies ++= Seq(
  Dependencies.SotaResolver,
  Dependencies.JsonWebSecurityAkka
) ++ Dependencies.JsonWebSecurity

dockerExposedPorts := Seq(8081)

dockerBaseImage := "java:openjdk-8-jre"

enablePlugins(SbtWeb, Versioning.Plugin)

Versioning.settings

Release.settings

enablePlugins(DockerPlugin, JavaAppPackaging)
