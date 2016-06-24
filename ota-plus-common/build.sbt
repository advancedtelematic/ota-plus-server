libraryDependencies ++= Seq(
  Dependencies.JsonWebSecurityAkka,
  Dependencies.SotaCommonData,
  Dependencies.AkkaHttpTestKit
) ++ Dependencies.JsonWebSecurity

enablePlugins(Versioning.Plugin)

Versioning.settings

Release.settings
