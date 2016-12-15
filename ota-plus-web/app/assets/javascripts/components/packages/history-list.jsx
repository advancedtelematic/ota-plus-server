define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      HistoryListItem = require('./history-list-item'),
      Loader = require('../loader');
  
  class HistoryList extends React.Component {
    constructor(props) {
      super(props);
      SotaDispatcher.dispatch({actionType: "get-package-history-for-device", device: this.props.deviceId});
      SotaDispatcher.dispatch({actionType: "get-installation-log-for-device", device: this.props.deviceId});
      db.packageHistoryForDevice.addWatch("poll-packages-history-for-device", _.bind(this.forceUpdate, this, null));
      db.installationLogForDevice.addWatch("poll-installation-log-for-device", _.bind(this.forceUpdate, this, null));
      db.deviceSeen.addWatch("poll-deviceseen-history", _.bind(this.handleDeviceSeen, this, null));
    }
    componentDidMount() {
      this.props.setQueueListHeight();
    }
    componentWillUnmount() {
      db.packageHistoryForDevice.reset();
      db.installationLogForDevice.reset();
      db.packageHistoryForDevice.removeWatch("poll-packages-history-for-device");
      db.installationLogForDevice.removeWatch("poll-installation-log-for-device");
      db.deviceSeen.removeWatch("poll-deviceseen-history");
    }
    handleDeviceSeen() {
      var deviceSeen = db.deviceSeen.deref();
      if(!_.isUndefined(deviceSeen) && this.props.deviceId === deviceSeen.uuid) {
        SotaDispatcher.dispatch({actionType: "get-package-history-for-device", device: this.props.deviceId});
        SotaDispatcher.dispatch({actionType: "get-installation-log-for-device", device: this.props.deviceId});
      }
    }
    render() {
      var Packages = db.packageHistoryForDevice.deref();
      var AllInstallationsLog = db.installationLogForDevice.deref();
            
      if(!_.isUndefined(Packages) && !_.isUndefined(AllInstallationsLog)) {
        Packages.sort(function(a, b) {
          var dateCompared = new Date(b.completionTime) - new Date(a.completionTime);
          return dateCompared == 0 ? b.id - a.id : dateCompared;
        });
      
        var firstFailedInstallId = Packages.find(function(obj) {
          return !obj.success;
        }, this);
            
        var packages = _.map(Packages, function(pack, i) {
          var installationLog = AllInstallationsLog.find(function(obj) { 
            return obj.updateId == pack.updateId
          }, this);
                          
          var isLogShown = (this.props.isFirstFailedExpanded && firstFailedInstallId.updateId == pack.updateId) ? true : false;

          return (
            <HistoryListItem 
              key={pack.updateId}
              package={pack}
              installationLog={installationLog !== undefined ? installationLog : []}
              isLogShown={isLogShown}
              deviceId={this.props.deviceId}/>
          );
        }, this);
      }
      return (
        <div className="height-100">
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {!_.isUndefined(packages) ? 
              <ul id="history-list" className="list-group height-100 position-relative"> 
                {packages.length > 0 ?
                  packages
                :
                  <div className="text-center center-xy padding-15">
                    Installation history is empty. <br />
                    The installation of the queued packages will start automatically when your device connects.
                  </div>
                }
              </ul>
            : undefined}
          </VelocityTransitionGroup>
          {_.isUndefined(packages) ? 
            <Loader />
          : undefined}
        </div>
      );
    }
  };

  return HistoryList;
});
