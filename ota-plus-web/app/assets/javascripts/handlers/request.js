define(function(require) {
  var db = require('../stores/db');

  return {
    renderRequestError: function(xhr, action, multipleKey) {
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
        } else if(ct.indexOf('text/html') > -1) {
          errorObj.response = xhr.statusText;
        }
      }
      
      if(!_.isUndefined(multipleKey)) {
        if(_.isUndefined(postStatus[action]))
          postStatus[action] = {};
        postStatus[action][multipleKey] = errorObj;
      } else {
        postStatus[action] = errorObj;
      }
      
      db.postStatus.reset(postStatus);
    },
    renderRequestSuccess: function(data, action, code, multipleKey) {
      var postStatus = _.clone(db.postStatus.deref());
      var successObj = {status: 'success', code: code};
      
      if(!_.isUndefined(data)) {
        successObj.response = data;
      }
      
      if(!_.isUndefined(multipleKey)) {
        if(_.isUndefined(postStatus[action]))
          postStatus[action] = {};
        postStatus[action][multipleKey] = successObj;
      } else {
        postStatus[action] = successObj;
      }
      
      db.postStatus.reset(postStatus);
    }
  };

});
