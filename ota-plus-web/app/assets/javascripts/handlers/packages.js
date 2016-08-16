define(function(require) {
  var SotaDispatcher = require('sota-dispatcher'),
      _ = require('underscore'),
      db = require('../stores/db'),
      checkExists = require('../mixins/check-exists'),
      sendRequest = require('../mixins/send-request');

  var createPackage = function(payload) {
    var url = '/api/v1/packages/' + payload.package.name + '/' + payload.package.version +
      '?description=' + encodeURIComponent(payload.package.description) +
      '&vendor=' + encodeURIComponent(payload.package.vendor);
    sendRequest.doPut(url, payload.data, {form: true, action: payload.actionType})
      .success(function() {
        checkExists('/api/v1/packages/' + payload.package.name + '/' + payload.package.version,
          "Package", function() {
            SotaDispatcher.dispatch({actionType: 'get-packages'});
            SotaDispatcher.dispatch({actionType: 'search-packages-by-regex'});
        }, 'create-package', true);
      });
  };

  var Handler = (function() {
      this.dispatchCallback = function(payload) {
        switch(payload.actionType) {
          case 'get-packages':
            sendRequest.doGet('/api/v1/packages', {action: payload.actionType})
              .success(function(packages) {
                db.packages.reset(packages);
              });
          break;
          case 'get-package':
            sendRequest.doGet('/api/v1/packages', {action: payload.actionType})
              .success(function(packages) {
                db.showPackage.reset(_.find(packages, function(package) {
                  return package.id.name == payload.name && package.id.version == payload.version;
                }));
              });
          break;
          case 'create-package':
            checkExists('/api/v1/packages/' + payload.package.name + '/' + payload.package.version,
              "Package", function() {
                createPackage(payload);
              }, 'create-package');
          break;
          case 'search-packages-by-regex':
            var query = payload.regex ? '?regex=' + payload.regex : '';

            sendRequest.doGet('/api/v1/packages' + query, {action: payload.actionType})
              .success(function(packages) {
                db.searchablePackages.reset(packages);
              });
          break;
          case 'get-packages-for-device':
            sendRequest.doGet('/api/v1/device_data', {action: payload.actionType})
              .success(function(devices) {        
                var device = _.find(devices, function(device) {
                  return device.id == payload.device;
                });
                if (!_.isUndefined(device)) {
                  sendRequest.doGet('/api/v1/resolver/devices/' + device.id + '/package', {action: payload.actionType})
                    .success(function(packages) {
                      var list = _.map(packages, function(package) {
                        return {id: package}
                      });
                      db.packagesForDevice.reset(list);
                    });
                }
              });
          break;
          case 'search-packages-for-device-by-regex':
            var query = payload.regex ? '?regex=' + payload.regex : '';
            sendRequest.doGet('/api/v1/device_data', {action: payload.actionType})
              .success(function(devices) {
                var device = _.find(devices, function(device) {
                  return device.id == payload.device;
                });
                if (!_.isUndefined(device)) {
                  sendRequest.doGet('/api/v1/resolver/devices/' + device.id + '/package' + query, {action: payload.actionType})
                    .success(function(packages) {
                      var list = _.map(packages, function(package) {
                        return {id: package}
                      });
                      db.searchablePackagesForDevice.reset(list);
                    });
                }
              });
          break;
          case 'get-devices-queued-for-package':
            sendRequest.doGet('/api/v1/packages/' + payload.name + "/" + payload.version + "/queued_devices", {action: payload.actionType})
              .success(function(vehicles) {
                db.vehiclesQueuedForPackage.reset(vehicles);
              });
          break;
          case 'update-package-details':
            sendRequest.doPut('/api/v1/packages/' + payload.name + '/' + payload.version + '/info', payload.data)
              .success(function() {
              });
          break;
        }
      };
      SotaDispatcher.register(this.dispatchCallback.bind(this));
  });

  return new Handler();

});
