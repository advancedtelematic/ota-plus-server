define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      _ = require('underscore'),
      SotaDispatcher = require('sota-dispatcher'),
      DeviceListItem = require('./devices-list-item');
  
  class DevicesList extends React.Component {
    constructor(props) {
      super(props);
      this.state = ({
        intervalId: null
      });
      this.refreshData = this.refreshData.bind(this);
      SotaDispatcher.dispatch(this.props.DispatchObject);
      this.props.Devices.addWatch(this.props.PollEventName, _.bind(this.forceUpdate, this, null));
    }
    componentDidMount() {
      var that = this;
      var intervalId = setInterval(function() {
        that.refreshData();
      }, 1000);
      this.setState({intervalId: intervalId});
    }
    componentWillUpdate(nextProps, nextState) {
      if(nextProps.filterValue != this.props.filterValue) {
        SotaDispatcher.dispatch(nextProps.DispatchObject);
      }
    }
    componentWillUnmount(){
      this.props.Devices.removeWatch(this.props.PollEventName);
      clearInterval(this.state.intervalId);
    }
    refreshData() {
      SotaDispatcher.dispatch(this.props.DispatchObject);
    }
    render() {     
      var devices = [];
      var devicesIds = [];
      var selectedStatus = this.props.selectedStatus;
      var selectedSort = this.props.selectedSort;
      var Packages = this.props.Devices.deref();
      var SortedPackages = [];
            
      Packages = Packages.filter(function (pack) {          
        return (selectedStatus === 'All' || selectedStatus === pack.status);
      });
            
      Object.keys(Packages).sort(function(a, b) {
        var aName = Packages[a].vin;
        var bName = Packages[b].vin;
        if(selectedSort !== 'undefined' && selectedSort == 'desc')
          return bName.localeCompare(aName);
        else
          return aName.localeCompare(bName);
      }).forEach(function(key) {
        SortedPackages.push(Packages[key]);
      });
            
      var devices = _.map(SortedPackages, function(device, i) {
        return (
          <DeviceListItem key={device.vin} vin={device.vin} status={device.status}/>
        );
      }, this);   
      
      return (
        <div className="row" id="devices-list">
            <div id="devices-container" className="container">
            {devices.length > 0 ? 
              devices 
            :
              <div className="col-md-12">
                <br />
                <i className="fa fa-warning"></i> Sorry, there is no results.
              </div>
            }
          </div>
        </div>
      );
    }
  };

  return DevicesList;
});
