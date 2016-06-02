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
      var devicesIds = [];
      var devices = _.map(this.props.Devices.deref(), function(device, i) {   
        return (
          <DeviceListItem key={device.vin} vin={device.vin} status={device.status} isProductionDevice={this.props.areProductionDevices}/>
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
                {this.props.areProductionDevices ?
                  <span><i className="fa fa-warning"></i> Sorry, there are too many results.</span>
                :
                  <span><i className="fa fa-warning"></i> Sorry, there is no results.</span>
                }
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
