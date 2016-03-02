/**
 * Copyright: Copyright (C) 2015, Jaguar Land Rover
 * License: MPL-2.0
 */

import org.genivi.webserver.controllers.{RPM, Debian, PackageType, Architecture}
import org.scalacheck.{Arbitrary, Gen}

object Generators {

  implicit val genPackageType: Gen[PackageType] = Gen.oneOf(Debian, RPM)
  implicit val arbPackageType: Arbitrary[PackageType] = Arbitrary(genPackageType)

  implicit val genArchitecture: Gen[Architecture] = Gen.oneOf(Architecture(32), Architecture(64))
  implicit val arbArchitecture: Arbitrary[Architecture] = Arbitrary(genArchitecture)

}
