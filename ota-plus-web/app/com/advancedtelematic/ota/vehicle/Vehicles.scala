package com.advancedtelematic.ota.vehicle

import scala.concurrent.Future

trait Vehicles {

  def registerVehicle(vehicle: Vehicle): Future[Unit]

  def getVehicle(vin: Vehicle.Vin): Future[Vehicle]

}
