define(function(require) {
  var React = require('react'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      QueueList = require('./queue-list'),
      HistoryList = require('./history-list');

  class QueueWrapper extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isFirstFailedExpanded: false
      }
      this.toggleQueueHistory = this.toggleQueueHistory.bind(this);
      this.reviewFailedInstall = this.reviewFailedInstall.bind(this);
      this.unblockQueue = this.unblockQueue.bind(this);
    }
    toggleQueueHistory() {
      this.setState({
        isFirstFailedExpanded: false
      });
      this.props.toggleQueueHistory();
    }
    reviewFailedInstall() {
      this.setState({
        isFirstFailedExpanded: true
      });
      this.props.reviewFailedInstall();
    }
    unblockQueue() {
      console.log('unblocked');
    }
    render() {
      return (
        <div id="queue">
          <div className="panel-subheading">
            <button onClick={this.toggleQueueHistory} className="btn btn-history pull-right">{this.props.textPackagesHistory}</button>
          </div>
          <div className="alert alert-ats alert-dismissible" role="alert">
            <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true"></span></button>
            <img src="/assets/img/icons/info.png" className="icon-info" alt=""/>
            The installation of the packages will start automatically when you connect to your device.
          </div>
  
          {this.props.status === 'Error' ? 
            <div className="box-red">
              <span className="font-14"><strong><i className="fa fa-warning" aria-hidden="true"></i> Paused!</strong></span>
              <div className="margin-top-10">
                We've interrupted the installation process for this device because of. Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui.
              </div>
              <div className="margin-top-10">
                <button className="btn btn-white" onClick={this.reviewFailedInstall}><i className="fa fa-arrow-right font-14" aria-hidden="true"></i> &nbsp; Review failed install</button>
                <button className="btn btn-white margin-left-10" onClick={this.unblockQueue}><i className="fa fa-unlock-alt font-14 vertical-align-middle" aria-hidden="true"></i> &nbsp; Ignore and resume</button>
              </div>
            </div>
          : null}
          
          <div id="queue-wrapper">          
              {!this.props.isPackagesHistoryShown ?
                <QueueList
                  device={this.props.device}
                  setQueueStatistics={this.props.setQueueStatistics}
                  key="queue-list"/>
              :
                <HistoryList
                  device={this.props.device}
                  key="history-list"
                  isFirstFailedExpanded={this.state.isFirstFailedExpanded}/>
              }
          </div>
        </div>
      );
    }
  };

  return QueueWrapper;
});
