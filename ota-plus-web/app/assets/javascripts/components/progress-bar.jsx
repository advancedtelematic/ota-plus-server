define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher')

  class ProgressBar extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        uploadProgress: undefined,
      };
      this.setProgress = this.setProgress.bind(this);
      db.postUpload.addWatch("poll-progress-" + this.props.action, _.bind(this.setProgress, this, null));
    }
    componentWillUnmount() {
      db.postUpload.removeWatch("poll-progress-" + this.props.action);
    }
    setProgress() {
      if(!_.isUndefined(db.postUpload.deref()) && !_.isUndefined(db.postUpload.deref()[this.props.action])) {
        if(!_.isUndefined(this.props.multipleKey) && !_.isUndefined(db.postUpload.deref()[this.props.action][this.props.multipleKey])) {
          if(db.postUpload.deref()[this.props.action][this.props.multipleKey]['progress'] == 100)
            this.props.finishCallback();
          this.setState({uploadProgress: db.postUpload.deref()[this.props.action][this.props.multipleKey]['progress'] < 100 ? db.postUpload.deref()[this.props.action][this.props.multipleKey]['progress'] : undefined});
        } else {
          if(db.postUpload.deref()[this.props.action]['progress'] == 100)
            this.props.finishCallback();
          this.setState({uploadProgress: db.postUpload.deref()[this.props.action]['progress'] < 100 ? db.postUpload.deref()[this.props.action]['progress'] : undefined});
        }
      }
    }
    render() {
      return (
        <div>
          {!_.isUndefined(this.state.uploadProgress) && this.state.uploadProgress < 100 ? 
            <div className="progress">
              <div id="progressBar" className="progress-bar" role="progressbar" style={{width: this.state.uploadProgress + '%'}}></div>
            </div>
          : null}
        </div>
      );
    }
  };

  return ProgressBar;
});
