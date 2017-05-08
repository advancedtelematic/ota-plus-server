package com.advancedtelematic.ota

/**
 * Copyright: Copyright (C) 2015, Jaguar Land Rover
 * License: MPL-2.0
 */

import com.advancedtelematic.controllers.{Architecture, ArtifactType, Debian, RPM, Toml}
import org.scalacheck.{Arbitrary, Gen}

object Generators {

  implicit val genArtifactType: Gen[ArtifactType] = Gen.oneOf(Debian, RPM, Toml)
  implicit val arbArtifactType: Arbitrary[ArtifactType] = Arbitrary(genArtifactType)

  implicit val genArchitecture: Gen[Architecture] = Gen.oneOf(Architecture(32), Architecture(64))
  implicit val arbArchitecture: Arbitrary[Architecture] = Arbitrary(genArchitecture)

}
