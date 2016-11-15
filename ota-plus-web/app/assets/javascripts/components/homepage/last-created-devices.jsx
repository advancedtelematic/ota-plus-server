define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      Loader = require('es6!../loader'),
      DeviceListItem = require('es6!../devices/devices-list-item');

  class LastCreatedDevices extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        devicesData: undefined
      };
      this.setDevicesData = this.setDevicesData.bind(this);
      SotaDispatcher.dispatch({actionType: 'get-devices'});
      db.devices.addWatch("homepage-devices", _.bind(this.setDevicesData, this, null));
    }
    componentWillUnmount() {
      db.devices.removeWatch("homepage-devices");
      db.devices.reset();
    }
    setDevicesData() {
      var devices = db.devices.deref();
      if(!_.isUndefined(devices)) {
        devices = _.sortBy(devices, function(device) {
          return device.createdAt;
        }).reverse();
        this.setState({
          devicesData: devices.slice(0, 10)
        });
      }
      
    }
    render() {
      var devices = [];
      if(!_.isUndefined(this.state.devicesData)) {
        devices = _.map(this.state.devicesData, function(device) {
          return (
            <DeviceListItem key={device.uuid}
              device={device}
              isProductionDevice={false}
              productionDeviceName={null}
              width="100%"
              openRenameDeviceModal={null}
              areActionButtonsShown={false}/>
          );
        }, this);
      }
      return (
        <div style={{height: this.props.listHeight}}>
          {!_.isUndefined(this.state.devicesData) ?
            this.state.devicesData.length ?
              devices
            :
              <div className="col-md-12 height-100 position-relative text-center">
                <div className="center-xy padding-15">
                  <button type="submit" className="btn btn-confirm btn-small" onClick={this.props.openNewDeviceModal}><i className="fa fa-plus"></i> ADD NEW DEVICE</button>
                </div>
              </div>
          : undefined}
          {_.isUndefined(this.state.devicesData) ?
            <Loader className="center-xy"/>
          : undefined}
        </div>
      );
    }
  }
  
  LastCreatedDevices.propTypes = {
    listHeight: React.PropTypes.number.isRequired,
  };
  
  return LastCreatedDevices;
});
