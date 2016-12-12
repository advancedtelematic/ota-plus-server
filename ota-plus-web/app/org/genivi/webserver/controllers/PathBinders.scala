/**
 * Copyright: Copyright (C) 2015, Jaguar Land Rover
 * License: MPL-2.0
 */

package org.genivi.webserver.controllers

import cats.syntax.show._
import eu.timepit.refined.refineV
import eu.timepit.refined.string._
import org.genivi.sota.data.Device._
import org.genivi.sota.data.{Device, Namespace, Uuid}
import play.api.mvc.PathBindable

/**
  * Implicits that allow giving custom param-types in the method signatures in the routes file.
  *
  * Details in http://cjwebb.github.io/blog/2015/06/23/play-framework-path-binders/
  */
object PathBinders {

  /**
    * Path binder to convert a String (eg, from a route path)
    * to a Uuid wrapped in a Right (if valid, Left otherwise).
    */
  implicit object bindableDeviceUuid extends PathBindable[Uuid] {
    def bind(key: String, value: String): Either[String, Uuid] = {
      refineV[Uuid.Valid](value).right.map(Uuid(_))
    }
    def unbind(key: String, value: Uuid): String = value.show
  }

  implicit object bindableNamespace extends PathBindable[Namespace] {
    def bind(key: String, value: String): Either[String, Namespace] = {
      Right(Namespace(value))
    }
    def unbind(key: String, value: Namespace): String = value.get
  }

  /**
    * Path binder to convert a String (eg, from a route path)
    * to a ArtifactType wrapped in a Right (if valid, Left otherwise).
    */
  implicit object bindableArtifactType extends PathBindable[ArtifactType] {
    def bind(key: String, value: String): Either[String, ArtifactType] = {
      value match {
        case Debian.fileExtension => Right(Debian)
        case RPM.fileExtension => Right(RPM)
        case Toml.fileExtension => Right(Toml)
        case _ =>
          Left(s"Expected ${Debian.fileExtension} or ${RPM.fileExtension} or ${Toml.fileExtension}, found " + value)
      }
    }
    def unbind(key: String, value: ArtifactType): String = value.toString()
  }

  /**
    * Path binder to convert a String (eg, from a route path)
    * to a Architecture wrapped in a Right (if valid, Left otherwise).
    */
  implicit object bindableArchitecture extends PathBindable[Architecture] {
    def bind(key: String, value: String): Either[String, Architecture] = {
      value match {
        case "32" => Right(Architecture(32))
        case "64" => Right(Architecture(64))
        case _ => Left("Expected 32 or 64, found " + value)
      }
    }
    def unbind(key: String, value: Architecture): String = value.toString()
  }

  implicit object bindableFeature extends PathBindable[FeatureName] {
    def bind(key: String, value: String): Either[String, FeatureName] = {
      Right(FeatureName(value))
    }
    def unbind(key: String, value: FeatureName): String = value.get
  }

}

trait ArtifactType {
  val fileExtension: String
  val contentType: String
  override final def toString: String = fileExtension
}

object Debian extends ArtifactType {
  val fileExtension: String = "deb"
  val contentType: String = "application/vnd.debian.binary-package"
}

object RPM extends ArtifactType {
  val fileExtension: String = "rpm"
  val contentType: String = "application/x-redhat-package-manager"
}

object Toml extends ArtifactType {
  val fileExtension: String = "toml"
  val contentType: String = "text/plain"
}

case class Architecture(bits: Int) {
  bits match {
    case 32 | 64 => ()
    case _ => throw new IllegalArgumentException
  }
  override def toString: String = bits.toString
}

final case class FeatureName(get: String)
