define(function(require) {

  var db = require('../stores/db'),
      errors = require('../handlers/errors');
      sendRequest = require('./send-request');

  return function(url, resourceName, callback, action) {
    var postStatus = (db.postStatus.deref() !== null && typeof db.postStatus.deref() === 'object') ? db.postStatus.deref() : {};

    sendRequest.doGet(url, {global: false})
      .error(function(xhr) {
        errors.renderRequestError(xhr, postStatus, action);
      })
      .success(function(data) {
        if (_.isEmpty(data)) {
          callback();
        } else {
          postStatus[action] = resourceName + " already exists";
          db.postStatus.reset(postStatus);
        }
      });
  };
});
