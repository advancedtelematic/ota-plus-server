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
      if(!_.isUndefined(postStatus[this.props.action]))
        delete postStatus[this.props.action];
      db.postStatus.reset(postStatus);
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
      var postStatus = !_.isUndefined(db.postStatus.deref()[this.props.action]) ? db.postStatus.deref()[this.props.action] : null;
      return (
        <div>
          {postStatus ?
            <div className={"alert alert-" + (postStatus.status == 'error' ? "danger" : "success")}>
              {typeof postStatus.response === 'string' ?
                postStatus.response
              :
                this.objToString(postStatus.response)
              }
            </div>
          : null}
        </div>
      );
    }
  }
  return Responses;
});
