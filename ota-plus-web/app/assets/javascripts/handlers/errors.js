define(function(require) {
  var db = require('../stores/db');

  return {
    renderRequestError: function(xhr, postStatus, action) {
      var ct = xhr.getResponseHeader("content-type") || "";
      var result = xhr.responseText;

      if (ct.indexOf('plain') > -1) {
        console.log('Plaintext error message');
        postStatus[action] = result;
      } else if (ct.indexOf('json') > -1) {
        postStatus[action] = JSON.parse(result).description;
      }
            
      db.postStatus.reset(postStatus);
    }
  };

});
