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
      var devicesIds = [];
      var devices = _.map(this.props.Devices.deref(), function(device, i) {   
        return (
          <DeviceListItem key={device.vin} vin={device.vin} status={device.status}/>
        );
      }, this);       
      return (
        <div className="row" id="devices-list" >
          <div className="col-md-12">     
            <div id="devices-container">
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
        </div>
      );
    }
  };

  return DevicesList;
});
