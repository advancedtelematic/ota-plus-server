define(function(require) {
  var SotaDispatcher = require('sota-dispatcher'),
      _ = require('underscore'),
      db = require('../stores/db'),
      sendRequest = require('../mixins/send-request');

  var Handler = (function() {
      this.dispatchCallback = function(payload) {
        switch(payload.actionType) {
          case 'get-groups':
            sendRequest.doGet('/api/v1/devices/group_info', {action: payload.actionType})
              .success(function(groups) {
                db.groups.reset(groups);
              });
          break;
          case 'get-group':
            sendRequest.doGet('/api/v1/devices/' + payload.name + '/group_info', {action: payload.actionType})
              .success(function(group) {
                db.group.reset(group);
              });
          break;
          case 'create-group':
            sendRequest.doPost('/api/v1/devices/' + payload.name + '/group_info', payload.data, {action: payload.actionType})
              .success(function() {
              });
          break;
          case 'update-group':
            sendRequest.doPut('/api/v1/devices/' + payload.name + '/group_info', payload.data, {action: payload.actionType})
              .success(function() {
              });
          break;
          case 'delete-group':
            sendRequest.doDelete('/api/v1/devices/' + payload.name + '/group_info', null, {action: payload.actionType})
              .success(function() {
              });
          break;
        }
      };
      SotaDispatcher.register(this.dispatchCallback.bind(this));
  });

  return new Handler();

});
