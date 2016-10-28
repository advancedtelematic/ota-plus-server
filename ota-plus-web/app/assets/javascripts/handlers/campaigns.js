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
                if(Object.keys(campaigns).length) {
                  var after = _.after(Object.keys(campaigns).length, function() {
                    db.campaigns.reset(newCampaigns);
                  });
                  
                  var newCampaigns = _.each(campaigns, function(campaign, index) {
                    sendRequest.doGet('/api/v1/campaigns/' + campaign.id + '/statistics', {action: 'get-campaign-statistics'})
                      .success(function(statistics) {
                        campaigns[index].statistics = statistics;
                      })
                      .always(function() {
                        after();
                      });
                  });
                } else {
                  db.campaigns.reset(campaigns);
                }
              });
          break;
          case 'get-campaign':
            sendRequest.doGet('/api/v1/campaigns/' + payload.uuid, {action: payload.actionType})
              .success(function(campaign) {
                db.campaign.reset(campaign);
              });
          break;
          case 'get-campaign-statistics':
            sendRequest.doGet('/api/v1/campaigns/' + payload.uuid + '/statistics', {action: payload.actionType})
              .success(function(statistics) {
                db.campaignStatistics.reset(statistics);
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
          case 'cancel-campaign-for-request':
            sendRequest.doPut('/api/v1/update_requests/' + payload.uuid + '/cancel', null, {action: payload.actionType})
              .success(function() {
              });
          break;
          case 'cancel-campaign':
            sendRequest.doPut('/api/v1/campaigns/' + payload.uuid + '/cancel', null, {action: payload.actionType})
              .success(function() {
              });
          break;
        }
      };
      SotaDispatcher.register(this.dispatchCallback.bind(this));
  });

  return new Handler();

});
