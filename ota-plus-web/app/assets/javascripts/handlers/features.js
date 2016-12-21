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
                var hasBetaAccess = features.indexOf('beta') > -1;
                db.hasBetaAccess.reset(hasBetaAccess);
              });
          break;
          case 'enable-treehub-feature':
            sendRequest.doPut('/api/v1/features/treehub', null, {action: payload.actionType, dataType: 'text'})
              .success(function() {
                setTimeout(function() {
                  SotaDispatcher.dispatch({actionType: 'get-features'});
                  SotaDispatcher.dispatch({actionType: 'get-treehub-json'});
                }, 1);
              });
          break;
          case 'get-treehub-json':
            sendRequest.doGet('/api/v1/features/treehub/client', {action: payload.actionType})
              .success(function(treehubJson) {
                db.treehubJson.reset(treehubJson);
              });
          break;
          case 'get-provisioning-status':
            sendRequest.doGet('/api/v1/provisioning/status', {action: payload.actionType})
              .success(function(provisioningStatus) {
                db.provisioningStatus.reset(provisioningStatus);
                if(provisioningStatus.active)
                  setTimeout(function() {
                    SotaDispatcher.dispatch({actionType: 'get-provisioning-details'});
                  }, 1);
              });
          break;
          case 'get-provisioning-details':
            sendRequest.doGet('/api/v1/provisioning', {action: payload.actionType})
              .success(function(provisioningDetails) {
                db.provisioningDetails.reset(provisioningDetails);
              });
          break;
          case 'activate-provisioning-feature':
            sendRequest.doPut('/api/v1/provisioning/activate', null, {action: payload.actionType})
              .success(function() {
                setTimeout(function() {
                  SotaDispatcher.dispatch({actionType: 'get-provisioning-status'});
                }, 1);
              });
          break;
        }
      };
      SotaDispatcher.register(this.dispatchCallback.bind(this));
  });
  return new Handler();
});
