define(function(require) {
  var SotaDispatcher = require('sota-dispatcher'),
      _ = require('underscore'),
      db = require('../stores/db'),
      sendRequest = require('../mixins/send-request');

  var Handler = (function() {
      this.dispatchCallback = function(payload) {
        switch(payload.actionType) {
          case 'get-campaigns':
            sendRequest.doGet('/api/v1/campaigns', {action: payload.actionType})
              .success(function(campaigns) {
                db.campaigns.reset(campaigns);
              });
          break;
          case 'get-campaign':
            sendRequest.doGet('/api/v1/campaigns/' + payload.uuid, {action: payload.actionType})
              .success(function(campaign) {
                db.campaign.reset(campaign);
              });
          break;
          case 'create-campaign':
            sendRequest.doPost('/api/v1/campaigns', payload.data, {action: payload.actionType})
              .success(function() {
              });
          break;
          case 'set-package-for-campaign':
            sendRequest.doPut('/api/v1/campaigns/' + payload.uuid + '/package', payload.data, {action: payload.actionType})
              .success(function() {
              });
          break;
          case 'set-groups-for-campaign':
            sendRequest.doPut('/api/v1/campaigns/' + payload.uuid + '/groups', payload.data, {action: payload.actionType})
              .success(function() {
              });
          break;
          case 'launch-campaign':
            sendRequest.doPost('/api/v1/campaigns/' + payload.uuid + '/launch', payload.data, {action: payload.actionType})
              .success(function() {
              });
          break;
          case 'delete-campaign':
            sendRequest.doDelete('/api/v1/campaigns/' + payload.uuid, null, {action: payload.actionType})
              .success(function() {
              });
          break;
        }
      };
      SotaDispatcher.register(this.dispatchCallback.bind(this));
  });

  return new Handler();

});
