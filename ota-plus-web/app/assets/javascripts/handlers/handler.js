define(function(require) {
  var SotaDispatcher = require('sota-dispatcher'),
      _ = require('underscore'),
      db = require('../stores/db'),
      errors = require('./errors'),
      devicesHandler = require('./devices'),
      packagesHandler = require('./packages');

  var Handler = (function() {
      this.dispatchCallback = function(payload) {
        var postStatus = (db.postStatus.deref() !== null && typeof db.postStatus.deref() === 'object') ? db.postStatus.deref() : {};
        if(payload.actionType in postStatus) {
          delete postStatus[payload.actionType];
        }
        
        $(document).ajaxError(function(event, xhr) {
          if (xhr.status === 401) {
            return location.reload();
          }
          errors.renderRequestError(xhr, postStatus, payload.actionType);
        });
        
        $(document).ajaxStop(function(event, xhr) {
          $('.loading').fadeOut(); 
        });
      };
      SotaDispatcher.register(this.dispatchCallback.bind(this));
  });

  return new Handler();
});
