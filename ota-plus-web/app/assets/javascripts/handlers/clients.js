define(function(require) {
  var SotaDispatcher = require('sota-dispatcher'),
      _ = require('underscore'),
      jQuery = require('jquery'),
      db = require('../stores/db'),
      sendRequest = require('../mixins/send-request');

  var Handler = (function() {
      this.dispatchCallback = function(payload) {
        switch(payload.actionType) {
          case 'get-clients':
            sendRequest.doGet('/api/v1/clients', {action: payload.actionType})
              .success(function(clients) {
                db.clients.reset(clients);
              });
          break;
          case 'get-client':
            sendRequest.doGet('/api/v1/clients/' + payload.id, {action: payload.actionType})
              .success(function(client) {
                db.client.reset(client);
              });
          break;
          case 'create-client':
            sendRequest.doPost('/api/v1/clients', payload.data, {action: payload.actionType})
              .success(function() {
              });
          break;
        }
      };
      SotaDispatcher.register(this.dispatchCallback.bind(this));
  });

  return new Handler();

});
