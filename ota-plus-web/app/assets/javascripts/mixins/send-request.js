define(['jquery', 'underscore', '../stores/db', '../handlers/request'], function($, _, db, request) {
    
  var sendRequest = {

    getCsrfToken: function() {
      return $('input[name=csrfToken]').val();
    },

    send: function(type, url, data, opts) {
      opts = opts || {};
      
      var postStatus = _.clone(db.postStatus.deref());
      
      if(_.isUndefined(opts.multiple) || !opts.multiple) {
        if(!_.isUndefined(opts.action) && !_.isUndefined(postStatus[opts.action]))
          delete postStatus[opts.action];
      } else {
        var multipleData = opts.multipleData || {};
        var key = _.map(multipleData, function(elem) {return elem;}).join("-");
        if(!_.isUndefined(opts.action) && !_.isUndefined(postStatus[opts.action]) && !_.isUndefined(postStatus[opts.action][key]))
          delete postStatus[opts.action][key];
      }
      
      db.postStatus.reset(postStatus);
        
      if (opts.form) {
        return this.formMultipart(type, url, data, opts);
      } else {
        return this.formAjax(type, url, data, opts);
      }
    },
    formAjax: function(type, url, data, opts) {
      var multipleKey = undefined;
      if(opts.multipleData) {
        var multipleKey = _.map(opts.multipleData, function(elem) {return elem;}).join("-");
      }
            
      var ajaxReq = $.ajax(_.extend({
        type: type,
        url: url,
        headers: {'Csrf-Token': this.getCsrfToken()},
        dataType: opts.dataType ? opts.dataType : 'json',
        data: JSON.stringify(data),
        contentType: "application/json"
      }, opts));
      
      if(opts.notHandleAjaxActions) 
        return ajaxReq;
      
      return ajaxReq.success(function(data) {
        request.renderRequestSuccess(data, opts.action, 200, multipleKey);
      })
      .error(function(xhr) {
        if (xhr.status==201) {
          request.renderRequestSuccess(xhr, opts.action, 201, multipleKey); 
          return; 
        }
        request.renderRequestError(xhr, opts.action, multipleKey);
      });
    },
    formMultipart: function(type, url, data, opts) {
      var postUpload = (db.postUpload.deref() !== null && typeof db.postUpload.deref() === 'object') ? db.postUpload.deref() : {};
      postUpload[opts.action] = postUpload[opts.action] || {};
      var multipleData = opts.multipleData || {};
      var multipleKey =  _.map(multipleData, function(elem) {return elem;}).join("-");
      
      postUpload[opts.action][multipleKey] = {
        data: multipleData
      };
      
      var ajaxReq =  $.ajax({
        type: type,
        url: url,
        headers: {'Csrf-Token': this.getCsrfToken()},
        cache: false,
        contentType: false,
        processData: false,
        data: data,
        xhr: function() {
          var myXhr = $.ajaxSettings.xhr();
          if(myXhr.upload) {
            myXhr.upload.addEventListener('progress',function(evt) {
              var endTime = new Date().getTime();
              var lastUpTime = !_.isUndefined(postUpload[opts.action][multipleKey]['lastUpTime']) ? postUpload[opts.action][multipleKey]['lastUpTime'] : endTime;
              var upSpeed = ((evt.loaded - postUpload[opts.action][multipleKey]['uploaded']) * 1000) / ((endTime - lastUpTime) * 1024);
              
              postUpload[opts.action][multipleKey]['progress'] = Math.round(evt.loaded / evt.total * 100);
              postUpload[opts.action][multipleKey]['size'] = evt.total;
              postUpload[opts.action][multipleKey]['uploaded'] = evt.loaded;
              postUpload[opts.action][multipleKey]['lastUpTime'] = endTime;
              postUpload[opts.action][multipleKey]['upSpeed'] = upSpeed;
              
              db.postUpload.reset(postUpload);
            }, false);
          }
          return myXhr;
        }
      });
      
      postUpload[opts.action][multipleKey]['request'] = ajaxReq;
      db.postUpload.reset(postUpload);
      
      if(opts.notHandleAjaxActions)
        return ajaxReq;
      
      return ajaxReq.success(function(data) {
        request.renderRequestSuccess(data, opts.action, 200, multipleKey);
      })
      .error(function(xhr) {
        if (xhr.status==201) {
          request.renderRequestSuccess(xhr, opts.action, 201, multipleKey); 
          return; 
        }
        request.renderRequestError(xhr, opts.action, multipleKey);
      });
    },
    doGet: function(url, opts) {
      return this.send("GET", url, undefined, opts);
    },
    doPost: function(url, data, opts) {
      return this.send("POST", url, data, opts);
    },
    doPut: function(url, data, opts) {
      return this.send("PUT", url, data, opts);
    },
    doDelete: function(url, data, opts) {
      return this.send("DELETE", url, data, opts);
    }
  };

  return sendRequest;
});
