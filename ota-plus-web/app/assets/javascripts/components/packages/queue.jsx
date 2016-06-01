define(function(require) {
  var React = require('react'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      QueueList = require('./queue-list'),
      HistoryList = require('./history-list');

  class QueueWrapper extends React.Component {
    render() {
      return (
        <div id="queue">
          <div className="panel-subheading">
            <button onClick={this.props.showQueueHistory} className="btn btn-history pull-right">{this.props.textPackagesHistory}</button>
          </div>
          <div className="alert alert-ats alert-dismissible" role="alert">
            <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true"></span></button>
            <img src="/assets/img/icons/info.png" className="icon-info" alt=""/>
            The installation of the packages will start automatically when you connect to your device.
          </div>
          <div id="queue-wrapper">
            <VelocityTransitionGroup enter={{animation: "fadeIn"}}>
              {!this.props.showPackagesHistory ?
                <QueueList
                  device={this.props.device}
                  setQueueStatistics={this.props.setQueueStatistics}
                  key="queue-list"/>
              :
                <HistoryList
                  device={this.props.device}
                  key="history-list"/>
              }
            </VelocityTransitionGroup>
          </div>
        </div>
      );
    }
  };

  return QueueWrapper;
});
