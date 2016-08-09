define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      _ = require('underscore'),
      DeviceListItem = require('./devices-list-item');

  class DevicesList extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
        
      var devices = [];
      var Devices = this.props.Devices;
      var devices = _.map(Devices, function(device, i) {
        return (
          <DeviceListItem key={device.deviceName}
            device={device}
            isProductionDevice={this.props.areProductionDevices}
            productionDeviceName={this.props.productionDeviceName}/>
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
                {this.props.areProductionDevices ?
                  <span><i className="fa fa-warning"></i> Sorry, there are too many devices to show.</span>
                :
                  <span><i className="fa fa-warning"></i> Sorry, there are no devices to show.</span>
                }
              </div>
            }
          </div>
        </div>
      );
    }
  };

  return DevicesList;
});
