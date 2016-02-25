/**
 * Copyright: Copyright (C) 2015, Jaguar Land Rover
 * License: MPL-2.0
 */

import org.genivi.webserver.controllers.{RPM, Debian, PackageType, Architecture}
import org.scalacheck.Gen

object Generators {

  val genPackageType: Gen[PackageType] = Gen.oneOf(Debian, RPM)

  val genArchitecture: Gen[Architecture] = Gen.oneOf(Architecture(32), Architecture(64))

}
