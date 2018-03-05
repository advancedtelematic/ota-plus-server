/**
 * Copyright: Copyright (C) 2015, Jaguar Land Rover
 * License: MPL-2.0
 */

package com.advancedtelematic.controllers

import cats.syntax.show._
import com.advancedtelematic.api.ApiVersion
import eu.timepit.refined.refineV
import eu.timepit.refined.string._
import org.genivi.sota.data.Device._
import org.genivi.sota.data.{Device, Namespace, Uuid}
import play.api.mvc.{QueryStringBindable, PathBindable}

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

  implicit object bindableFeature extends PathBindable[FeatureName] {
    def bind(key: String, value: String): Either[String, FeatureName] = {
      Right(FeatureName(value))
    }
    def unbind(key: String, value: FeatureName): String = value.get
  }

  implicit object bindableQueryInteger extends QueryStringBindable.Parsing[Integer](
    _.toInt,
    _.toString,
    (k: String, e: Exception) => "Cannot parse %s as Integer: %s".format(k, e.getMessage())
  )

  import ApiVersion.ApiVersion

  implicit object bindableApiVersion extends PathBindable[ApiVersion] {
    def bind(key: String, value: String): Either[String, ApiVersion] = try {
      Right(ApiVersion.withName(value))
    } catch {
      case _: NoSuchElementException => Left("version is not supported")
    }
    def unbind(key: String, value: ApiVersion): String = value.toString
  }

}

final case class FeatureName(get: String)
