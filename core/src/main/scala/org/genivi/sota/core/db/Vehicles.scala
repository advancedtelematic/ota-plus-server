/**
 * Copyright: Copyright (C) 2015, Jaguar Land Rover
 * License: MPL-2.0
 */
package org.genivi.sota.core.db

import org.genivi.sota.core.data.Vehicle
import scala.concurrent.ExecutionContext
import slick.driver.MySQLDriver.api._
import org.genivi.sota.db.Operators.regex

/**
 * Database mapping definition for the Vehicles table.
 * The Vehicles table is simple: it only contains the list of the vehicles
 * (VINs) that are known to the SOTA system.  Other tables that refer to
 * VINs should have a foreign key into this table
 */
object Vehicles {
  import org.genivi.sota.refined.SlickRefined._

  /**
   * Slick mapping definition for the Vehicle table
   * @see {@link http://slick.typesafe.com/}
   */
  // scalastyle:off
  class VehicleTable(tag: Tag) extends Table[Vehicle](tag, "Vehicle") {
    def vin = column[Vehicle.Vin]("vin")
    def * = (vin) <> (Vehicle.apply, Vehicle.unapply)
    def pk = primaryKey("vin", vin)  // insertOrUpdate doesn't work if
                                     // we use O.PrimaryKey in the vin
                                     // column, see Slick issue #966.
  }
  // scalastyle:on

  /**
   * Internal helper definition to accesss the SQL table
   */
  val vins = TableQuery[VehicleTable]

  /**
   * List all the VINs that are known to the system
   * @return A list of Vehicles
   */
  def list(): DBIO[Seq[Vehicle]] = vins.result

  /**
   * Check if a VIN exists
   * @param vin The VIN to search for
   * @return Option.Some if the vehicle is present. Option.None if it is absent
   */
  def exists(vin: Vehicle.Vin): DBIO[Option[Vehicle]] =
    vins
      .filter(_.vin === vin)
      .result
      .headOption

  /**
   * Add a new VIN to SOTA.
   * @param vehicle The VIN of the vehicle
   */
  def create(vehicle: Vehicle)(implicit ec: ExecutionContext) : DBIO[Vehicle.Vin] =
    vins.insertOrUpdate(vehicle).map( _ => vehicle.vin )

  /**
   * Delete a VIN from SOTA.
   * Note that this doesn't perform a cascading delete.  You should delete any
   * objects that reference this vehicle first.
   * @param vehicle The VIN to remove
   */
  def deleteById(vehicle : Vehicle) : DBIO[Int] = vins.filter( _.vin === vehicle.vin ).delete

  /**
   * Find VINs that match a regular expression
   * @param reg A regular expression
   * @return A list of matching VINs
   */
  def searchByRegex(reg:String) : DBIO[Seq[Vehicle]] = vins.filter(vins => regex(vins.vin, reg)).result
}
