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
        var uploadData = opts.uploadData || {};
        var key = _.map(uploadData, function(elem) {return elem;}).join("-");
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
      var ajaxReq = $.ajax(_.extend({
        type: type,
        url: url,
        headers: {'Csrf-Token': this.getCsrfToken()},
        dataType: opts.contentType ? opts.contentType : 'json',
        data: JSON.stringify(data),
        contentType: "application/json",
      }, opts));
      
      if(opts.notHandleAjaxActions) 
        return ajaxReq;
      
      return ajaxReq.success(function(data) {
        request.renderRequestSuccess(data, opts.action, 200);
      })
      .error(function(xhr) {
        if (xhr.status==201) {
          request.renderRequestSuccess(xhr, opts.action, 201); 
          return; 
        }
        request.renderRequestError(xhr, opts.action);
      });
    },
    formMultipart: function(type, url, data, opts) {
      var postUpload = (db.postUpload.deref() !== null && typeof db.postUpload.deref() === 'object') ? db.postUpload.deref() : {};
      postUpload[opts.action] = postUpload[opts.action] || {};
      var uploadData = opts.uploadData || {};
      var uploadKey =  _.map(uploadData, function(elem) {return elem;}).join("-");
      
      postUpload[opts.action][uploadKey] = {
        data: uploadData,
        size: data.get('file').size
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
              var lastUpTime = !_.isUndefined(postUpload[opts.action][uploadKey]['lastUpTime']) ? postUpload[opts.action][uploadKey]['lastUpTime'] : endTime;
              var upSpeed = ((evt.loaded - postUpload[opts.action][uploadKey]['uploaded']) * 1000) / ((endTime - lastUpTime) * 1024);
              
              postUpload[opts.action][uploadKey]['progress'] = Math.round(evt.loaded / evt.total * 100);
              postUpload[opts.action][uploadKey]['size'] = evt.total;
              postUpload[opts.action][uploadKey]['uploaded'] = evt.loaded;
              postUpload[opts.action][uploadKey]['lastUpTime'] = endTime;
              postUpload[opts.action][uploadKey]['upSpeed'] = upSpeed;
              
              db.postUpload.reset(postUpload);
            }, false);
          }
          return myXhr;
        }
      });
      
      postUpload[opts.action][uploadKey]['request'] = ajaxReq;
      db.postUpload.reset(postUpload);
      
      if(opts.notHandleAjaxActions)
        return ajaxReq;
      
      return ajaxReq.success(function(data) {
        request.renderRequestSuccess(data, opts.action, 200, uploadKey);
      })
      .error(function(xhr) {
        if (xhr.status==201) {
          request.renderRequestSuccess(xhr, opts.action, 201, uploadKey); 
          return; 
        }
        request.renderRequestError(xhr, opts.action, uploadKey);
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
