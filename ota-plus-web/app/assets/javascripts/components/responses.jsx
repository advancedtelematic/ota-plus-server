define(function(require) {
  var React = require('react'),
      _ = require('underscore'),
      db = require('../stores/db');

  class Responses extends React.Component {
    constructor(props) {
      super(props);
      this.objToString = this.objToString.bind(this);
      db.postStatus.addWatch("poll-response-" + this.props.action, _.bind(this.forceUpdate, this, null));
    }
    componentWillUnmount() {
      db.postStatus.removeWatch("poll-response-" + this.props.action);
      
      var postStatus = _.clone(db.postStatus.deref());
      
      if(!_.isUndefined(this.props.multipleKey)) {
        if(!_.isUndefined(postStatus[this.props.action]) && !_.isUndefined(postStatus[this.props.action][this.props.multipleKey]))
          delete postStatus[this.props.action][this.props.multipleKey];
        db.postStatus.reset(postStatus);
      } else {
        if(!_.isUndefined(postStatus[this.props.action]))
          delete postStatus[this.props.action];
        db.postStatus.reset(postStatus);
      }
    }
    objToString(obj) {
      var str = '';
      for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
          str += p + '::' + obj[p] + '\n';
        }
      }
      return str;
    }
    render() {
      var handledStatuses = this.props.handledStatuses || 'all';
      var postStatus;
      var message = '';
      
      if(!_.isUndefined(this.props.multipleKey)) {
        postStatus = !_.isUndefined(db.postStatus.deref()[this.props.action]) && !_.isUndefined(db.postStatus.deref()[this.props.action][this.props.multipleKey]) && (handledStatuses === 'all' || (db.postStatus.deref()[this.props.action][this.props.multipleKey].status === handledStatuses)) ? db.postStatus.deref()[this.props.action][this.props.multipleKey] : null;
      } else {
        postStatus = !_.isUndefined(db.postStatus.deref()[this.props.action]) && (handledStatuses === 'all' || (db.postStatus.deref()[this.props.action].status === handledStatuses)) ? db.postStatus.deref()[this.props.action] : null;
      }
      
      if(postStatus !== null) {
        if(postStatus.status == 'error' && this.props.errorText) {
          message = this.props.errorText;
        } else if(postStatus.status == 'success' && this.props.successText) {
          message = this.props.successText;
        } else {
          message = typeof postStatus.response === 'string' ? postStatus.response : this.objToString(postStatus.response);
        }
      }
      
      return (
        <div>
          {postStatus ?
            <div className={"alert alert-" + (postStatus.status == 'error' ? "danger" : "success")}>
              {message}
            </div>
          : null}
        </div>
      );
    }
  }
  return Responses;
});
