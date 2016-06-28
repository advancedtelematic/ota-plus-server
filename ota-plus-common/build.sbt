libraryDependencies ++= Seq(
  Dependencies.JsonWebSecurityAkka,
  Dependencies.SotaCommon,
  Dependencies.AkkaHttpTestKit
) ++ Dependencies.JsonWebSecurity

enablePlugins(Versioning.Plugin)

Versioning.settings

Release.settings
