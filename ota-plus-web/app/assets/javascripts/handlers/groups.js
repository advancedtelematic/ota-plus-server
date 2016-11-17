define(function(require) {
  var SotaDispatcher = require('sota-dispatcher'),
      _ = require('underscore'),
      db = require('../stores/db'),
      sendRequest = require('../mixins/send-request');

  var Handler = (function() {
      this.dispatchCallback = function(payload) {
        switch(payload.actionType) {
          case 'get-groups':
            sendRequest.doGet('/api/v1/device_groups', {action: payload.actionType})
              .success(function(groups) {
                if(Object.keys(groups).length) {
                  var after = _.after(Object.keys(groups).length, function() {
                    db.groups.reset(newGroups);
                  });
                  
                  var newGroups = _.each(groups, function(group, index) {
                    sendRequest.doGet('/api/v1/device_groups/' + group.id + '/devices', {action: 'get-devices-for-group'})
                      .success(function(devices) {
                        groups[index].devicesUUIDs = devices;
                      })
                      .always(function() {
                        after();
                      });
                  });
                } else {
                  db.groups.reset(groups);
                }
              });
          break;
          case 'get-group':
            sendRequest.doGet('/api/v1/device_groups/' + payload.name, {action: payload.actionType})
              .success(function(group) {
                db.group.reset(group);
              });
          break;
          case 'create-smart-group':
            sendRequest.doPost('/api/v1/device_groups/from_attributes', payload.data, {action: payload.actionType})
              .success(function() {
              });
          break;
          case 'create-manual-group':
            sendRequest.doPut('/api/v1/device_groups?groupName=' + payload.name, null, {action: payload.actionType})
              .success(function() {
              });
          break;
          case 'update-group':
            sendRequest.doPut('/api/v1/device_groups/' + payload.name, payload.data, {action: payload.actionType})
              .success(function() {
              });
          break;
          case 'rename-group':
            sendRequest.doPut('/api/v1/device_groups/' + payload.uuid + '/rename?groupName=' + payload.groupName, payload.data, {action: payload.actionType})
              .success(function() {
              });
          break;
          case 'delete-group':
            sendRequest.doDelete('/api/v1/device_groups/' + payload.name, null, {action: payload.actionType})
              .success(function() {
              });
          break;
          case 'add-device-to-group':
            sendRequest.doPost('/api/v1/device_groups/' + payload.uuid + '/devices/' + payload.deviceId, null, {action: payload.actionType})
              .success(function() {
              });
          break;
        }
      };
      SotaDispatcher.register(this.dispatchCallback.bind(this));
  });

  return new Handler();

});
