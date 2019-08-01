/**
 * Copyright: Copyright (C) 2015, Jaguar Land Rover
 * License: MPL-2.0
 */

package com.advancedtelematic.controllers

import com.advancedtelematic.api.ApiVersion
import com.advancedtelematic.libats.data.DataType.Namespace
import com.advancedtelematic.libtuf.data.TufDataType.{EcPrime256KeyType, Ed25519KeyType, RsaKeyType}
import play.api.mvc.{PathBindable, QueryStringBindable}
import play.utils.UriEncoding

/**
  * Implicits that allow giving custom param-types in the method signatures in the routes file.
  *
  * Details in http://cjwebb.github.io/blog/2015/06/23/play-framework-path-binders/
  */
object PathBinders {
  def segment(s: String): String = UriEncoding.encodePathSegment(s, "UTF-8")

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

  import com.advancedtelematic.libtuf.data.TufDataType.KeyType

  implicit object bindableKeyType extends QueryStringBindable[KeyType] {

    def bind(key: String, params: Map[String, Seq[String]]): Option[Either[String, KeyType]] =
      params.get(key).flatMap(_.headOption).map { p =>
        p.toLowerCase match {
          case "rsa" => Right(RsaKeyType)
          case "ed25519" => Right(Ed25519KeyType)
          case "ecprime256v1" => Right(EcPrime256KeyType)
          case _ => Left("unknown key type")
        }
      }

    def unbind(key: String, value: KeyType): String = {
      val kt = value match {
        case RsaKeyType => "rsa"
        case Ed25519KeyType => "ed25519"
        case EcPrime256KeyType => "ecprime256v1"
      }

      key + "=" + kt
    }
  }
}

final case class FeatureName(get: String)
