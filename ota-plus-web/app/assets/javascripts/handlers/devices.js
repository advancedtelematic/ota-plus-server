define(function(require) {
  var SotaDispatcher = require('sota-dispatcher'),
      _ = require('underscore'),
      db = require('../stores/db'),
      checkExists = require('../mixins/check-exists'),
      sendRequest = require('../mixins/send-request');

  var createDevice = function(payload) {
    let url = '/api/v1/devices';
    let device = {
      deviceName: payload.device.deviceName,
      deviceId: payload.device.deviceId === '' ? null : payload.device.deviceId,
      deviceType: payload.device.deviceType
    }
    sendRequest.doPost(url, device)
      .success(function(id) {
        location.hash = "#/devicedetails/" + id;
      });
  };

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
            sendRequest.doGet('/api/v1/device_data?status=true') // TODO: more efficient querying
              .success(function(devices) {
                  const device = _.find(devices, i => i.id == payload.device);
                  db.showDevice.reset(device);
              });
            break;
          case 'create-device':
            $('.loading').fadeIn();
            checkExists('/api/v1/devices?deviceId=' + payload.device.deviceId, "Device", function() {
              createDevice(payload);
            }, payload.actionType);
            break;
          case 'search-devices-by-regex':
            var query = payload.regex ? 'regex=' + payload.regex : '';
            sendRequest.doGet('/api/v1/device_data?status=true' + query)
              .success(function(devices) {
                db.searchableDevices.reset(devices);
              });
            break;
          case 'fetch-affected-devices':
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
          case 'get-package-queue-for-device':
            if (!_.isUndefined(payload.device)) {
              sendRequest.doGet('/api/v1/vehicle_updates/' + payload.device + '/queued')
                .success(function(packages) {
                  db.packageQueueForDevice.reset(packages);
                });
            }
            break;
          case 'get-package-history-for-device':
            sendRequest.doGet('/api/v1/history?uuid=' + payload.device)
              .success(function(packages) {
                db.packageHistoryForDevice.reset(packages);
              });
            break;
          case 'list-components-on-device':
            sendRequest.doGet('/api/v1/vehicles/' + payload.deviceId + '/component')
              .success(function(components) {
                db.componentsOnVin.reset(components);
              });
            break;
          case 'add-component-to-device':
            sendRequest.doPut('/api/v1/vehicles/' + payload.device + '/component/' + payload.partNumber)
              .success(function() {
                SotaDispatcher.dispatch({actionType: 'list-components-on-device', device: payload.device});
              });
            break;
          case 'sync-packages-for-device':
            sendRequest.doPut('/api/v1/vehicle_updates/' + payload.device + '/sync');
            break;
          case 'add-packages-to-device':
            sendRequest.doPut('/api/v1/vehicles/' + payload.deviceId + '/packages', payload.packages)
              .success(function() {
              });
            break;
          case 'install-package-for-device':
            sendRequest.doPost('/api/v1/vehicle_updates/' + payload.device, payload.data)
              .success(function() {
                SotaDispatcher.dispatch({actionType: 'get-package-queue-for-device', device: payload.device});
              });
            break;
          case 'reorder-queue-for-device':
            sendRequest.doPut('/api/v1/vehicle_updates/' + payload.device + '/order', payload.order)
              .success(function() {
                SotaDispatcher.dispatch({actionType: 'get-package-queue-for-device', device: payload.device});
              });
          break;
          case 'cancel-update':
            sendRequest.doPut('/api/v1/vehicle_updates/' + payload.device + '/' + payload.updateid + '/cancelupdate')
              .success(function() {
                SotaDispatcher.dispatch({actionType: 'get-package-queue-for-device', device: payload.device});
              });
          break;
          case 'search-production-devices':
            var devices = [];

            if(payload.regex.length >= 17) {
              sendRequest.doGet('/api/v1/device_data?status=true')
              .success(function(data) {
                devices = _.filter(data, function(device) {
                  return device.device == localStorage.getItem('firstProductionTestDevice');
                });
                
                devices[0].deviceId = payload.regex.substr(0, 17);
                db.searchableProductionDevices.reset(devices);
              });
            } else {
              db.searchableProductionDevices.reset([]);
            }
          break;
          case 'get-production-device':
            sendRequest.doGet('/api/v1/device_data?status=true')
              .success(function(devices) {
                db.showDevice.reset(_.find(devices, function(device) {
                  return device.device == localStorage.getItem('firstProductionTestDevice');
                }));
              });
          break;
          case 'get-installation-log-for-device':
            sendRequest.doGet('api/v1/vehicle_updates/' + payload.device + '/results')
              .success(function(log) {
                db.installationLogForDevice.reset(log);
              });
          break;
          case 'get-installation-log-for-updateid':
            sendRequest.doGet('api/v1/vehicle_updates/' + payload.device + '/'  + payload.updateId + '/results')
              .success(function(log) {
                db.installationLogForUpdateId.reset(log);
              });
          break;
          case 'unblock-queue':
            sendRequest.doPut('api/v1/vehicle_updates/' + payload.device + '/unblock')
              .success(function(result) {
              });
          break;
        }
      };
      SotaDispatcher.register(this.dispatchCallback.bind(this));
  });

  return new Handler();

});
