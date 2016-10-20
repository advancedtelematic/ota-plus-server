define(function(require) {
  var SotaDispatcher = require('sota-dispatcher'),
      _ = require('underscore'),
      db = require('../stores/db'),
      sendRequest = require('../mixins/send-request');

  var Handler = (function() {
      this.dispatchCallback = function(payload) {
        switch(payload.actionType) {
          case 'get-components':
            sendRequest.doGet('/api/v1/devices/' + payload.uuid + '/system_info', {action: payload.actionType})
              .success(function(components) {
                db.components.reset(components);
              });
          break;
          case 'get-components-for-selected-devices':
            sendRequest.doGet('/api/v1/devices/' + payload.uuid + '/system_info', {action: payload.actionType, multiple: true, multipleData: {uuid: payload.uuid}})
              .success(function(components) {
                var componentsForSelectedDevices = db.componentsForSelectedDevices.deref() || {};
                componentsForSelectedDevices[payload.uuid] = components;
                db.componentsForSelectedDevices.reset(componentsForSelectedDevices);
              });
        }
      };
      SotaDispatcher.register(this.dispatchCallback.bind(this));
  });

  return new Handler();

});
