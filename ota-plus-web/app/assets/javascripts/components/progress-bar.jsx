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
      db.postProgress.addWatch("poll-progress-" + this.props.action, _.bind(this.setProgress, this, null));
    }
    componentWillUnmount() {
      db.postProgress.reset();
      db.postProgress.removeWatch("poll-progress-" + this.props.action);
    }
    setProgress() {
      if(!_.isUndefined(db.postProgress.deref()) && !_.isUndefined(db.postProgress.deref()[this.props.action]))
        this.setState({uploadProgress: db.postProgress.deref()[this.props.action] < 100 ? db.postProgress.deref()[this.props.action] : undefined});
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
