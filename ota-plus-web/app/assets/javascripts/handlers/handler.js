define(function(require) {
  var SotaDispatcher = require('sota-dispatcher'),
      _ = require('underscore'),
      db = require('../stores/db'),
      errors = require('./errors'),
      devicesHandler = require('./devices'),
      packagesHandler = require('./packages');

  var Handler = (function() {
      this.dispatchCallback = function(payload) {
        db.postStatus.reset("");
      };
      SotaDispatcher.register(this.dispatchCallback.bind(this));

      $(document).ajaxError(function(event, xhr) {
        if (xhr.status === 401) {
          return location.reload();
        }
        errors.renderRequestError(xhr);
      });

  });

  return new Handler();
});
