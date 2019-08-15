object Release {

  import sbtrelease.ReleasePlugin.autoImport._
  import sbtrelease.ReleaseStateTransformations._

  lazy val settings = Seq(

    releaseIgnoreUntrackedFiles := true,

    releaseProcess := Seq(
      checkSnapshotDependencies,
      releaseStepCommand("mkVersionProperties"),
      releaseStepCommand("runWebpack"),
      releaseStepCommand("docker:publish")
    )
  )
}
