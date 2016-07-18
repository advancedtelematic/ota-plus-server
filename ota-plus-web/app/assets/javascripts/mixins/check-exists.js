define(function(require) {
  var db = require('../stores/db'),
      errors = require('../handlers/errors');
      sendRequest = require('./send-request');

  return function(url, resourceName, callback, action, ifExists) {
    var postStatus = (db.postStatus.deref() !== null && typeof db.postStatus.deref() === 'object') ? db.postStatus.deref() : {};

    sendRequest.doGet(url, {global: false})
      .error(function(xhr) {
        if(ifExists) {
          if (xhr.status == 404) {
            errors.renderRequestError(xhr, postStatus, action);
          } else {
            callback();
          }
        } else {
          if (xhr.status == 404) {
            callback();
          } else {
            errors.renderRequestError(xhr, postStatus, action);
          }
        }
      })
      .success(function(data) {
        if(ifExists) {
          if (_.isEmpty(data)) {
            postStatus[action] = resourceName + " doesn't exist";
            db.postStatus.reset(postStatus);
          } else {
            callback();
          }
        } else {
          if (_.isEmpty(data)) {
            callback();
          } else {
            postStatus[action] = resourceName + " already exists";
            db.postStatus.reset(postStatus);
          }
        }
      });
  };
});
