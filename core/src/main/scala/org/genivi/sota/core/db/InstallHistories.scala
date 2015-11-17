/**
 * Copyright: Copyright (C) 2015, Jaguar Land Rover
 * License: MPL-2.0
 */
package org.genivi.sota.core.db

import org.genivi.sota.core.data.{Vehicle, Package, InstallHistory}
import org.joda.time.DateTime
import slick.driver.JdbcTypesComponent._
import slick.driver.MySQLDriver.api._

/**
 * Database mapping definition for the InstallHistory table.
 * This provides a history of package installs that have been attempted on a
 * VIN.  It records the identity of the package which was attempted to be
 * installed, the time of the attempt and whether the install was successful
 */
object InstallHistories {

  import Mappings._
  import org.genivi.sota.refined.SlickRefined._

  /**
   * Slick mapping definition for the InstallHistory table
   * @see {@link http://slick.typesafe.com/}
   */
  // scalastyle:off
  class InstallHistoryTable(tag: Tag) extends Table[InstallHistory](tag, "InstallHistory") {

    def id             = column[Long]           ("id", O.PrimaryKey, O.AutoInc)
    def vin            = column[Vehicle.Vin]    ("vin")
    def packageName    = column[Package.Name]   ("packageName")
    def packageVersion = column[Package.Version]("packageVersion")
    def success        = column[Boolean]        ("success")
    def completionTime = column[DateTime]       ("completionTime")

    def * = (id.?, vin, packageName, packageVersion, success, completionTime).shaped <>
      (r => InstallHistory(r._1, r._2, Package.Id(r._3, r._4), r._5, r._6),
        (h: InstallHistory) =>
          Some((h.id, h.vin, h.packageId.name, h.packageId.version, h.success, h.completionTime)))
  }
  // scalastyle:on

  /**
   * Internal helper definition to accesss the SQL table
   */
  private val installHistories = TableQuery[InstallHistoryTable]

  /**
   * List the install attempts that have been made on a specific VIN
   * This information is fetched from the InstallHistory SQL table.
   * @param vin The VIN to fetch data for
   * @return A list of the install history for that VIN
   */
  def list(vin: Vehicle.Vin): DBIO[Seq[InstallHistory]] =
    installHistories.filter(_.vin === vin).result

  /**
   * Record the outcome of a install attempt on a specific VIN. The result of
   * the install is returned from the SOTA client via RVI.
   * @param vin The VIN that the install attempt ran on
   * @param pkgId The name/version of the package that was attempted to be installed
   * @param success Whether the install was successful
   */
  def log(vin: Vehicle.Vin, pkgId: Package.Id, success: Boolean): DBIO[Int] =
    installHistories += InstallHistory(None, vin, pkgId, success, DateTime.now)

}
