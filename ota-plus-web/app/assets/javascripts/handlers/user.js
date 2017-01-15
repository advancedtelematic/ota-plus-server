define(function(require) {
  var SotaDispatcher = require('sota-dispatcher'),
      _ = require('underscore'),
      db = require('../stores/db'),
      checkExists = require('../mixins/check-exists'),
      sendRequest = require('../mixins/send-request');

  var Handler = (function() {
      this.dispatchCallback = function(payload) {
        switch(payload.actionType) {
          case 'get-user':
            sendRequest.doGet('/user/profile', {action: payload.actionType})
              .success(function(user) {
                db.user.reset(user);
              });
          break;
          case 'update-user':
            sendRequest.doPut('/user/profile', payload.data, {action: payload.actionType})
              .success(function(user) {
                db.user.reset(user);
              });
          break;
          case 'update-user-billing':
            var query = '/user/profile/billing_info';
            if(payload.setQuote)
              query += '?plan=quote';
            sendRequest.doPut(query, payload.data, {action: payload.actionType})
              .success(function() {
                SotaDispatcher.dispatch({actionType: 'get-user'});
              });
          break;
          case 'change-password':
            sendRequest.doPost('/user/change_password', null, {action: payload.actionType, dataType: 'text'})
              .success(function() {
              });
          break;
        }
      };
      SotaDispatcher.register(this.dispatchCallback.bind(this));
  });
  return new Handler();
});