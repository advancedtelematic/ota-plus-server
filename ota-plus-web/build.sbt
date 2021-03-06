import scala.sys.process.Process

scalacOptions += "-Ypartial-unification"


testOptions in UnitTests += Tests.Argument(TestFrameworks.ScalaTest, "-l", "BrowserTests")

testOptions in BrowserTests += Tests.Argument(TestFrameworks.ScalaTest, "-n", "BrowserTests")

lazy val UnitTests = config("ut") extend Test

lazy val BrowserTests = config("bt") extend Test

configs(UnitTests, BrowserTests)

inConfig(UnitTests)(Defaults.testTasks)

inConfig(BrowserTests)(Defaults.testTasks)

val mkVersionProperties = taskKey[Seq[File]]("Makes version.properties file")

mkVersionProperties := {
  val propFile = new File(baseDirectory.value + "/../deploy", "version.properties")
  IO.write(propFile, version.value)
  Seq(propFile)
}

val runWebpack = taskKey[Seq[Int]]("Run webpack:10")

runWebpack := {
  Seq(
    Process(
    "sh" :: "-c" :: s"cd ${baseDirectory.value.toString}/app/reactapp && npm ci && webpack -p" ::
        Nil
    ) !
  )
}

