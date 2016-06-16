define(function(require) {
  var React = require('react'),
      ReactCSSTransitionGroup = React.addons.CSSTransitionGroup,
      db = require('stores/db'),
      QueueList = require('./queue-list'),
      HistoryList = require('./history-list');
  
  class QueueWrapper extends React.Component {
    render() {
      return (
        <div id="queue">
          <div className="panel-subheading">
            <button onClick={this.props.showQueueHistory} className="btn btn-history pull-right">{this.props.textPackagesHistory}</button>
          </div>
          <div className="alert alert-ats alert-dismissible fade in" role="alert">
            <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true"></span></button>
            <img src="/assets/img/icons/info.png" className="icon-info" alt=""/> 
            The installation of the packages will start automatically when you connect to your device.
          </div>
          <div id="queue-wrapper">
            <ReactCSSTransitionGroup
              transitionAppear={true}
              transitionLeave={false}
              transitionAppearTimeout={500}
              transitionEnterTimeout={500}
              transitionLeaveTimeout={500}
              transitionName="example">
              {!this.props.showPackagesHistory ? 
                <QueueList 
                  QueuedPackages={db.packageQueueForVin}
                  PollEventName="poll-queued-packages"
                  DispatchObject={{actionType: "get-package-queue-for-vin", vin: this.props.vin}}
                  vin={this.props.vin}
                  setQueueStatistics={this.props.setQueueStatistics}
                  key="queue-list"/>
              :
                <HistoryList 
                  PackagesHistory={db.packageHistoryForVin}
                  PollEventName="poll-packages-history-for-vin"
                  DispatchObject={{actionType: "get-package-history-for-vin", vin: this.props.vin}}
                  key="history-list"/>
              }
            </ReactCSSTransitionGroup>
          </div>
        </div>
      );
    }
  };

  return QueueWrapper;
});
