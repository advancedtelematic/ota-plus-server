define(function(require) {
  var React = require('react'),
      _ = require('underscore'),
      db = require('../stores/db');

  class ResponsesCustomMsg extends React.Component {
    constructor(props) {
      super(props);
      db.postStatus.addWatch("poll-response-custom-msg-" + this.props.action, _.bind(this.forceUpdate, this, null));
    }
    componentWillUnmount() {
      db.postStatus.removeWatch("poll-response-custom-msg-" + this.props.action);
      
      var postStatus = _.clone(db.postStatus.deref());
      if(!_.isUndefined(postStatus[this.props.action]))
        delete postStatus[this.props.action];
      db.postStatus.reset(postStatus);
    }
    render() {
      var postStatus = !_.isUndefined(db.postStatus.deref()[this.props.action]) ? db.postStatus.deref()[this.props.action] : null;
      return (
        <div>
          {postStatus ?
            <div className={"alert alert-" + (postStatus.status == 'error' ? "danger" : "success")}>
              {postStatus.status === 'error' ?
                this.props.errorText
              :
                this.props.successText
              }
            </div>
          : null}
        </div>
      );
    }
  }
  return ResponsesCustomMsg;
});
