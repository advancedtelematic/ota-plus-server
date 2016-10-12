define(function(require) {
  var SotaDispatcher = require('sota-dispatcher'),
      _ = require('underscore'),
      db = require('../stores/db'),
      request = require('./request'),
      devicesHandler = require('./devices'),
      packagesHandler = require('./packages'),
      userHandler = require('./user'),
      componentsHandler = require('./components'),
      groupsHandler = require('./groups'),
      campaignsHandler = require('./campaigns');

  var Handler = (function() {
      this.dispatchCallback = function(payload) {
        $(document).ajaxError(function(event, xhr) {
          if (xhr.status === 401) {
            return location.reload();
          }
        });
      };
      SotaDispatcher.register(this.dispatchCallback.bind(this));
  });

  return new Handler();
});
