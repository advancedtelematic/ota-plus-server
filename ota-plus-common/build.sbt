libraryDependencies ++= Seq(
  Dependencies.JsonWebSecurityAkka,
  Dependencies.SotaCommonData
) ++ Dependencies.JsonWebSecurity

enablePlugins(Versioning.Plugin)

Versioning.settings

Release.settings
