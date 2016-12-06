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
    sendRequest.doPut(url, payload.data, {form: true, action: payload.actionType, multiple: true, multipleData: {name: payload.package.name, version: payload.package.version}})
      .success(function() {
       
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
              }, 'create-package', false, {name: payload.package.name, version: payload.package.version}, true);
          break;
          case 'search-packages-by-regex':
            var query = payload.regex ? '?regex=' + payload.regex : '';
            sendRequest.doGet('/api/v1/packages' + query, {action: payload.actionType})
              .success(function(packages) {
                db.searchablePackages.reset(packages);
              });
          break;
          case 'get-packages-for-device':
            sendRequest.doGet('/api/v1/devices_info', {action: payload.actionType})
              .success(function(devices) {        
                var device = _.find(devices, function(device) {
                  return device.uuid == payload.device;
                });
                if (!_.isUndefined(device)) {
                  sendRequest.doGet('/api/v1/resolver/devices/' + device.uuid + '/package', {action: payload.actionType})
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
            sendRequest.doGet('/api/v1/devices_info', {action: payload.actionType})
              .success(function(devices) {
                var device = _.find(devices, function(device) {
                  return device.uuid == payload.device;
                });
                if (!_.isUndefined(device)) {
                  sendRequest.doGet('/api/v1/resolver/devices/' + device.uuid + '/package' + query, {action: payload.actionType})
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
            sendRequest.doPut('/api/v1/packages/' + payload.name + '/' + payload.version + '/info', payload.data, {action: payload.actionType})
              .success(function() {
              });
          break;
          case 'get-blacklisted-packages':
            sendRequest.doGet('/api/v1/blacklist')
              .success(function(packages) {
                db.blacklistedPackages.reset(packages);
              });
          break;
          case 'get-blacklisted-packages-with-stats':
            sendRequest.doGet('/api/v1/blacklist')
              .success(function(packages) {
                if(Object.keys(packages).length) {
                  var after = _.after(Object.keys(packages).length, function() {
                    db.blacklistedPackagesWithStats.reset(packages);
                  });
                  _.each(packages, function(pack, index) {
                    sendRequest.doGet('/api/v1/device_count/' + pack.packageId.name + '/' + pack.packageId.version, {action: 'get-package-version-stats'})
                      .success(function(statistics) {
                        packages[index].statistics = statistics;
                      })
                      .always(function() {
                        after();
                      });
                  });
                } else {
                  db.blacklistedPackagesWithStats.reset(packages);
                }
              });
          break;
          case 'get-blacklisted-package':
            sendRequest.doGet('/api/v1/blacklist/' + payload.name + '/' + payload.version, {action: payload.actionType})
              .success(function(package) {
                db.blacklistedPackage.reset(package);
              });
          break;
          case 'add-package-to-blacklist':
            sendRequest.doPost('/api/v1/blacklist', payload.data, {action: payload.actionType})
              .success(function() {
              });
          break;
          case 'update-package-in-blacklist':
            sendRequest.doPut('/api/v1/blacklist', payload.data, {action: payload.actionType, dataType: 'text'})
              .success(function() {
              });
          break;
          case 'remove-package-from-blacklist':
            sendRequest.doDelete('/api/v1/blacklist/' + payload.name + '/' + payload.version, null, {action: payload.actionType, dataType: 'text'})
              .success(function() {
              });
          break;
          case 'impact-analysis':
            sendRequest.doGet('/api/v1/impact/blacklist')
              .success(function(impact) {
                db.impactAnalysis.reset(impact);                
              });
          break;
          case 'get-impacted-devices-count':
            sendRequest.doGet('/api/v1/blacklist/' + payload.name + '/' + payload.version + '/preview')
              .success(function(impactedDevicesCount) {
                db.impactedDevicesCount.reset(impactedDevicesCount);                
              });
          break;
          case 'get-affected-devices':
            sendRequest.doPost('/api/v1/resolver/packages/affected', payload.data, {action: payload.actionType})
              .success(function(vehicles) {
                db.affectedDevices.reset(vehicles);
              });
          break;
          case 'get-package-stats':
            sendRequest.doGet('/api/v1/resolver/package_stats/' + payload.packageName, {action: payload.actionType})
              .success(function(packageStats) {
                if(Object.keys(packageStats).length) {
                  var after = _.after(Object.keys(packageStats).length, function() {
                    db.packageStats.reset(packageStats);
                  });
                  _.each(packageStats, function(pack, index) {                      
                    sendRequest.doGet('/api/v1/device_count/' + payload.packageName + '/' + pack.packageVersion, {action: 'get-package-version-stats'})
                      .success(function(statistics) {
                        packageStats[index].groupIds = statistics.groupIds;
                      })
                      .always(function() {
                        after();
                      });
                  });
                } else {
                  db.packageStats.reset(packageStats);
                }
              });
          break;
          case 'get-auto-install-devices-for-package':
            sendRequest.doGet('/api/v1/auto_install/' + payload.packageName, {action: payload.actionType})
              .success(function(autoInstallDevicesForPackage) {
                db.autoInstallDevicesForPackage.reset(autoInstallDevicesForPackage);
              });
          break;
          case 'disable-package-auto-install':
            sendRequest.doDelete('/api/v1/auto_install/' + payload.packageName, null, {action: payload.actionType})
              .success(function() {
              });
          break;
        }
      };
      SotaDispatcher.register(this.dispatchCallback.bind(this));
  });

  return new Handler();

});
