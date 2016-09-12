define(function(require) {
  var db = require('../stores/db'),
      request = require('../handlers/request');
      sendRequest = require('./send-request');

  return function(url, resourceName, callback, action, checkIfExists, data, multiple) {
    multipleKey = undefined;
    if(multiple) {
      var multipleKey = _.map(data, function(elem) {return elem;}).join("-");
    }
    sendRequest.doGet(url, {action: 'check-exists', notHandleAjaxActions: true})
      .error(function(xhr) {
        if(checkIfExists) {
          if (xhr.status == 404) {
            request.renderRequestError(xhr, action, multipleKey);
          } else {
            callback();
          }
        } else {
          if (xhr.status == 404) {
            callback();
          } else {
            request.renderRequestError(xhr, action, multipleKey);
          }
        }
      })
      .success(function(data) {
        var xhr = [];
        if(checkIfExists) {
          if (_.isEmpty(data)) {
            request.renderRequestError(resourceName + " doesn't exist.", action, multipleKey);
          } else {
            callback();
          }
        } else {
          if (_.isEmpty(data)) {
            callback();
          } else {
            request.renderRequestError(resourceName + " already exists.", action, multipleKey);
          }
        }
      });
  };
});
