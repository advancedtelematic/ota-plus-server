libraryDependencies ++= Seq(
  Dependencies.SotaDeviceRegistry,
  Dependencies.JsonWebSecurityAkka
) ++ Dependencies.JsonWebSecurity

dockerExposedPorts := Seq(8083)

dockerBaseImage := "java:openjdk-8-jre"

maintainer in Docker := "dev@advancedtelematic.com"

packageName in Docker := "ota-plus-device-registry"

dockerRepository in Docker := Some("advancedtelematic")

dockerUpdateLatest in Docker := true

enablePlugins(SbtWeb, Versioning.Plugin)

buildInfoPackage := "com.advancedtelematic.ota.device_registry"

bashScriptExtraDefines ++= Seq("""addJava "-Xmx512m"""")

Versioning.settings

Release.settings

enablePlugins(DockerPlugin, JavaAppPackaging)
