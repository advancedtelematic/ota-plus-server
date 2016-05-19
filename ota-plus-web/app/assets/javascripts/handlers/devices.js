define(function(require) {
  var SotaDispatcher = require('sota-dispatcher'),
      _ = require('underscore'),
      db = require('../stores/db'),
      checkExists = require('../mixins/check-exists'),
      sendRequest = require('../mixins/send-request');

  var createVehicle = function(payload) {
    var url = '/api/v1/vehicles/' + payload.vehicle.vin;
    sendRequest.doPut(url, payload.vehicle)
      .success(function(vehicles) {
        SotaDispatcher.dispatch({actionType: 'search-devices-by-regex'});
      });
  }

  var Handler = (function() {
      this.dispatchCallback = function(payload) {
        switch(payload.actionType) {
          case 'get-devices':
            sendRequest.doGet('/api/v1/device_data?status=true')
              .success(function(devices) {
                db.devices.reset(devices);
              });
          break;
          case 'get-device':
            sendRequest.doGet('/api/v1/device_data?status=true')
              .success(function(devices) {
                db.showDevice.reset(_.find(devices, function(device) {
                  return device.vin == payload.vin;
                }));
              });
          break;
          case 'create-vehicle':
            checkExists('/api/v1/vehicles/' + payload.vehicle.vin, "Vehicle", function() {
              createVehicle(payload);
            });
          break;
          case 'search-devices-by-regex':
            var query = payload.regex ? '&regex=' + payload.regex : '';
            sendRequest.doGet('/api/v1/device_data?status=true' + query)
              .success(function(vehicles) {
                db.searchableDevices.reset(vehicles);
              });
          break;
          case 'fetch-affected-vins':
            var affectedVinsUrl = '/api/v1/resolve/' + payload.name + "/" + payload.version;

            sendRequest.doGet(affectedVinsUrl)
              .success(function(vehicles) {
                db.affectedVins.reset(vehicles);
              });
          break;
          case 'get-vehicles-for-package':
            sendRequest.doGet('/api/v1/vehicles?packageName=' + payload.name + '&packageVersion=' + payload.version)
              .success(function(vehicles) {
                var list = _.map(vehicles, function(vehicle) {
                  return vehicle.vin;
                });
                db.vehiclesForPackage.reset(list);
              });
          break;
          case 'get-vehicles-wholedata-for-package':
              sendRequest.doGet('/api/v1/vehicles?packageName=' + payload.name + '&packageVersion=' + payload.version)
              .success(function(vehicles) {
                db.vehiclesWholeDataForPackage.reset(vehicles);
              });
          break;
          case 'get-package-queue-for-vin': 
            sendRequest.doGet('/api/v1/vehicle_updates/' + payload.vin)
              .success(function(packages) {
                db.packageQueueForVin.reset(packages);
              });
          break;
          case 'get-package-history-for-vin':
            sendRequest.doGet('/api/v1/history?vin=' + payload.vin)
              .success(function(packages) {
                db.packageHistoryForVin.reset(packages);
              });
          break;
          case 'list-components-on-vin':
            sendRequest.doGet('/api/v1/vehicles/' + payload.vin + '/component')
              .success(function(components) {
                db.componentsOnVin.reset(components);
              });
          break;
          case 'add-component-to-vin':
            sendRequest.doPut('/api/v1/vehicles/' + payload.vin + '/component/' + payload.partNumber)
              .success(function() {
                SotaDispatcher.dispatch({actionType: 'list-components-on-vin', vin: payload.vin});
              });
          break;
          case 'sync-packages-for-vin':
            sendRequest.doPut('/api/v1/vehicles/' + payload.vin + '/sync');
          break;
          case 'add-packages-to-vin':
            sendRequest.doPut('/api/v1/vehicles/' + payload.vin + '/packages', payload.packages)
              .success(function() {
              });
          break;
          case 'install-package-for-vin':
            sendRequest.doPost('/api/v1/vehicle_updates/' + payload.vin, payload.data)
              .success(function() {
                SotaDispatcher.dispatch({actionType: 'get-package-queue-for-vin', vin: payload.vin});
              });
          break;
          case 'reorder-queue-for-vin':
            sendRequest.doPut('/api/v1/vehicle_updates/' + payload.vin + '/order', payload.order)
              .success(function() {
                SotaDispatcher.dispatch({actionType: 'get-package-queue-for-vin', vin: payload.vin});
              });
          break;
        }
      };
      SotaDispatcher.register(this.dispatchCallback.bind(this));
  });

  return new Handler();

});
