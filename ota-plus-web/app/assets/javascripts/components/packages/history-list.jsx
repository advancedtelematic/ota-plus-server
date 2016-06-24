define(function(require) {
  var React = require('react'),
      SotaDispatcher = require('sota-dispatcher'),
      db = require('stores/db'),
      HistoryListItem = require('./history-list-item');
  
  class HistoryList extends React.Component {
    constructor(props) {
      super(props);
      this.state = ({
        intervalId: null
      });
      this.refreshData = this.refreshData.bind(this);
      SotaDispatcher.dispatch({actionType: "get-package-history-for-vin", vin: this.props.vin});
      db.packageHistoryForVin.addWatch("poll-packages-history-for-vin", _.bind(this.forceUpdate, this, null));
      SotaDispatcher.dispatch({actionType: "get-installation-log-for-vin", vin: this.props.vin});
      db.installationLogForVin.addWatch("poll-installation-log-for-vin", _.bind(this.forceUpdate, this, null));
    }
    componentDidMount() {
      var that = this;
      var intervalId = setInterval(function() {
        that.refreshData();
      }, 1000);
      this.setState({intervalId: intervalId});
    }
    componentWillUnmount() {
      db.packageHistoryForVin.removeWatch("poll-packages-history-for-vin");
      db.installationLogForVin.removeWatch("poll-installation-log-for-vin");
      clearInterval(this.state.intervalId);
    }
    refreshData() {
      SotaDispatcher.dispatch({actionType: "get-package-history-for-vin", vin: this.props.vin});
      SotaDispatcher.dispatch({actionType: "get-installation-log-for-vin", vin: this.props.vin});
    }
    render() {
      var Packages = db.packageHistoryForVin.deref();
      var AllInstallationsLog = db.installationLogForVin.deref();
      Packages.sort(function(a, b) {
        var dateCompared = new Date(b.completionTime) - new Date(a.completionTime);
        return dateCompared == 0 ? b.id - a.id : dateCompared;
      });
      var packages = _.map(Packages, function(pack, i) {
                
        var installationLog = AllInstallationsLog.find(function(obj) {
          return obj.updateId == pack.updateId;
        }, this);

        return (
          <HistoryListItem 
            key={pack.packageId.name + '-' + pack.packageId.version + '-' + pack.id} 
            package={pack}
            installationLog={installationLog}/>
        );
      }, this);       
      return (
        <ul id="history-list" className="list-group"> 
          {packages.length > 0 ?
            packages
          :
            <div>History is empty</div>
          }
        </ul>
      );
    }
  };

  return HistoryList;
});
