define(function(require) {
  var db = require('../stores/db'),
      request = require('../handlers/request');
      sendRequest = require('./send-request');

  return function(url, resourceName, callback, action, checkIfExists) {
    sendRequest.doGet(url, {action: 'check-exists', notHandleAjaxActions: true})
      .error(function(xhr) {
        if(checkIfExists) {
          if (xhr.status == 404) {
            request.renderRequestError(xhr, action);
          } else {
            callback();
          }
        } else {
          if (xhr.status == 404) {
            callback();
          } else {
            request.renderRequestError(xhr, action);
          }
        }
      })
      .success(function(data) {
        var xhr = [];
        if(checkIfExists) {
          if (_.isEmpty(data)) {
            request.renderRequestError(resourceName + " doesn't exist.", action);
          } else {
            callback();
          }
        } else {
          if (_.isEmpty(data)) {
            callback();
          } else {
            request.renderRequestError(resourceName + " already exists.", action);
          }
        }
      });
  };
});
