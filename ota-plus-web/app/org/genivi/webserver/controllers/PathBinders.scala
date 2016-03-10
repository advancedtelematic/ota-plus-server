/**
 * Copyright: Copyright (C) 2015, Jaguar Land Rover
 * License: MPL-2.0
 */

package org.genivi.webserver.controllers

/**
  * Implicits that allow giving custom param-types in the method signatures in the routes file.
  *
  * Details in http://cjwebb.github.io/blog/2015/06/23/play-framework-path-binders/
  */
object PathBinders {

  import com.advancedtelematic.ota.vehicle.Vehicle

  /**
    * Path binder to convert a String (eg, from a route path)
    * to a Vehicle.Vin wrapped in a Right (if valid, Left otherwise).
    */
  implicit object bindableVin extends play.api.mvc.PathBindable[Vehicle.Vin] {
    def bind(key: String, value: String): Either[String, Vehicle.Vin] = {
      import eu.timepit.refined.refineV
      refineV(value)
    }
    def unbind(key: String, value: Vehicle.Vin): String = value.get
  }

  /**
    * Path binder to convert a String (eg, from a route path)
    * to a PackageType wrapped in a Right (if valid, Left otherwise).
    */
  implicit object bindablePackageType extends play.api.mvc.PathBindable[PackageType] {
    def bind(key: String, value: String): Either[String, PackageType] = {
      value match {
        case Debian.fileExtension => Right(Debian)
        case RPM.fileExtension => Right(RPM)
        case _ => Left(s"Expected ${Debian.fileExtension} or ${RPM.fileExtension}, found " + value)
      }
    }
    def unbind(key: String, value: PackageType): String = value.toString
  }

  /**
    * Path binder to convert a String (eg, from a route path)
    * to a Architecture wrapped in a Right (if valid, Left otherwise).
    */
  implicit object bindableArchitecture extends play.api.mvc.PathBindable[Architecture] {
    def bind(key: String, value: String): Either[String, Architecture] = {
      value match {
        case "32" => Right(Architecture(32))
        case "64" => Right(Architecture(64))
        case _ => Left("Expected 32 or 64, found " + value)
      }
    }
    def unbind(key: String, value: Architecture): String = value.toString
  }

}

trait PackageType {
  val fileExtension: String
  val contentType: String
  override final def toString(): String = fileExtension
}
object Debian extends PackageType {
  val fileExtension: String = "deb"
  val contentType: String = "application/vnd.debian.binary-package"
}
object RPM extends PackageType {
  val fileExtension: String = "rpm"
  val contentType: String = "application/x-redhat-package-manager"
}

case class Architecture(bits: Int) {
  bits match {
    case 32 | 64 => ()
    case _ => throw new IllegalArgumentException
  }
  override def toString(): String = bits.toString
}
