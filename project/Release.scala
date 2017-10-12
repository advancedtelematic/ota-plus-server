object Release {

  import sbt.Keys._
  import sbt._

  import sbtrelease.ReleaseStateTransformations._
  import sbtrelease.ReleasePlugin.autoImport._
  import sbtrelease._

  lazy val settings = Seq(

    releaseIgnoreUntrackedFiles := true,

    releaseProcess := Seq(
      checkSnapshotDependencies,
      releaseStepCommand("mkVersionProperties"),
      releaseStepCommand("runWebpack"),
      releaseStepCommand("docker:publish"),
      // Use dummy last step command. The last error will not propagate.
      // See: https://github.com/sbt/sbt-release/issues/95
      releaseStepCommand("show version")
    )
  )
}
