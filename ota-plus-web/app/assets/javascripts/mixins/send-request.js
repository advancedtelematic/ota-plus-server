define(['jquery', 'underscore', '../stores/db', '../handlers/request'], function($, _, db, request) {
  var sendRequest = {

    getCsrfToken: function() {
      return $('input[name=csrfToken]').val();
    },

    send: function(type, url, data, opts) {
      opts = opts || {};
      
      var postStatus = _.clone(db.postStatus.deref());
      if(!_.isUndefined(opts.action) && !_.isUndefined(postStatus[opts.action]))
        delete postStatus[opts.action];
      db.postStatus.reset(postStatus);
            
      if (opts.form) {
        return this.formMultipart(type, url, data, opts);
      } else {
        return this.jsonAjax(type, url, data, opts);
      }
    },
    jsonAjax: function(type, url, data, opts) {
      var ajaxReq = $.ajax(_.extend({
        type: type,
        url: url,
        headers: {'Csrf-Token': this.getCsrfToken()},
        dataType: 'json',
        data: JSON.stringify(data),
        contentType: "application/json",
      }, opts));
      
      if(opts.notHandleAjaxActions) 
        return ajaxReq;
      
      return ajaxReq.success(function(data) {
        request.renderRequestSuccess(data, opts.action);
      })
      .error(function(xhr) {
        request.renderRequestError(xhr, opts.action);
      });
    },
    formMultipart: function(type, url, data, opts) {
      var postProgress = (db.postProgress.deref() !== null && typeof db.postProgress.deref() === 'object') ? db.postProgress.deref() : {};
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
              postProgress[opts.action] = Math.round(evt.loaded / evt.total * 100);
              db.postProgress.reset(postProgress);
            }, false);
          }
          return myXhr;
        }
      });
      
      if(opts.notHandleAjaxActions)
        return ajaxReq;
      
      return ajaxReq.success(function(data) {
        request.renderRequestSuccess(data, opts.action);
      })
      .error(function(xhr) {
        request.renderRequestError(xhr, opts.action);
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
