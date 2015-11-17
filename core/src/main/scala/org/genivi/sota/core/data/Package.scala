/**
 * Copyright: Copyright (C) 2015, Jaguar Land Rover
 * License: MPL-2.0
 */
package org.genivi.sota.core.data

import akka.http.scaladsl.model.Uri
import org.genivi.sota.datatype.PackageCommon

/**
 * Domain object for a software package.
 * Packages are the atomic unit of software installation in SOTA.
 * @param id The name and version number of the package. This pair uniquely
 *           identifies a package in SOTA
 * @param uri The location of the binary data for this package
 * @param size The size of the package in bytes
 * @param checkSum The SHA1 checksum of the package's contents
 * @param description A free-form description of the package
 * @param vendor A free-form description of the vendor who provided the package
 */
case class Package(
  id: Package.Id,
  uri: Uri,
  size: Long,
  checkSum: String,
  description: Option[String],
  vendor: Option[String]
)

object Package extends PackageCommon
