define(function(require) {
  var db = require('../stores/db');

  return {
    renderRequestError: function(xhr, action) {
      var postStatus = _.clone(db.postStatus.deref());
      var result = '';
      var errorObj = {status: 'error'};
            
      if(typeof xhr === 'string') {
        errorObj.response = xhr;
      } else {
        var ct = xhr.getResponseHeader("content-type") || "";
        result = xhr.responseText;
        errorObj.code = xhr.status;
        
        if (ct.indexOf('plain') > -1) {
          console.log('Plaintext error message');
          errorObj.response = result;
        } else if (ct.indexOf('json') > -1) {
          errorObj.response = JSON.parse(result).description;
        }
      }
      
      postStatus[action] = errorObj;
      db.postStatus.reset(postStatus);
    },
    renderRequestSuccess: function(data, action, code) {
      var postStatus = _.clone(db.postStatus.deref());
      var successObj = {status: 'success', code: code};
      
      if(!_.isUndefined(data)) {
        successObj.response = data;
      }
            
      postStatus[action] = successObj;
      db.postStatus.reset(postStatus);
    }
  };

});
