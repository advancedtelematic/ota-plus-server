package org.genivi.webserver.controllers

/**
  * Implicits that allow giving custom param-types in the method signatures in the routes file.
  *
  * Details in http://cjwebb.github.io/blog/2015/06/23/play-framework-path-binders/
  */
object PathBinders {

  import org.genivi.sota.core.data.Vehicle

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
        case "debian" => Right(Debian)
        case "rpm" => Right(RPM)
        case _ => Left("Expected debian or rpm, found " + value)
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

trait PackageType
object Debian extends PackageType { override def toString(): String = "debian" }
object RPM extends PackageType { override def toString(): String = "rpm" }

case class Architecture(bits: Int) {
  bits match {
    case 32 | 64 => ()
    case _ => throw new IllegalArgumentException
  }
  override def toString(): String = bits.toString
}