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
                if(!_.isUndefined(user) && !_.isUndefined(user.scope)) {
                  var hasAccess = user.scope === "https://www.atsgarage.com/api/beta";
                  db.hasBetaAccess.reset(hasAccess);
                }
              });
          break;
          case 'update-user':
            sendRequest.doPut('/user/profile', payload.data, {action: payload.actionType})
              .success(function(user) {
                db.user.reset(user);
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