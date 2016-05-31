libraryDependencies ++= Seq(
  Dependencies.JsonWebSecurityAkka,
  Dependencies.SotaCommonData,
  Dependencies.SotaCommon
) ++ Dependencies.JsonWebSecurity ++ Dependencies.Kinesis

enablePlugins(Versioning.Plugin)

Versioning.settings

Release.settings
