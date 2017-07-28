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
      releaseStepCommand("docker:publish")
    )
  )
}
