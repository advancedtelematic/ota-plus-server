define(function(require) {
  var SotaDispatcher = require('sota-dispatcher'),
      _ = require('underscore'),
      db = require('../stores/db'),
      sendRequest = require('../mixins/send-request');

  var Handler = (function() {
      this.dispatchCallback = function(payload) {
        switch(payload.actionType) {
          case 'get-features':
            sendRequest.doGet('/api/v1/features', {action: payload.actionType})
              .success(function(features) {
                db.features.reset(features);
              });
          break;
          case 'enable-treehub-feature':
            sendRequest.doPut('/api/v1/features/ostreehub', null, {action: payload.actionType})
              .success(function() {
              });
          break;
          case 'get-treehub-json':
            sendRequest.doGet('/api/v1/features/ostreehub/client', {action: payload.actionType})
              .success(function(treehubJson) {
                db.treehubJson.reset(treehubJson);
              });
          break;
        }
      };
      SotaDispatcher.register(this.dispatchCallback.bind(this));
  });
  return new Handler();
});