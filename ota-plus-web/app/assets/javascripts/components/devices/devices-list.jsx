define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      _ = require('underscore'),
      DeviceListItem = require('es6!./devices-list-item');

  class DevicesList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        boxWidth: 320
      };
      this.setBoxesWidth = this.setBoxesWidth.bind(this);
    }
    componentDidMount() {
      var that = this;
      this.setBoxesWidth();
      window.addEventListener("resize", this.setBoxesWidth);
    }
    componentWillUnmount() {
      window.removeEventListener("resize", this.setBoxesWidth);
    }
    setBoxesWidth() {
      var containerWidth = $('#devices-container').width();
      var minBoxWidth = 320;
      var howManyBoxesPerRow = Math.floor(containerWidth / minBoxWidth);
      this.setState({
        boxWidth: containerWidth / howManyBoxesPerRow
      });
    }
    render() {
      var devices = [];
      var Devices = this.props.Devices;
      var devices = _.map(Devices, function(device, i) {
        return (
          <DeviceListItem key={device.deviceName}
            device={device}
            isProductionDevice={this.props.areProductionDevices}
            productionDeviceName={this.props.productionDeviceName}
            width={this.state.boxWidth}/>
        );
      }, this);

      return (
        <div id="devices-list" className="height-100">
          <div id="devices-container" className="container position-relative height-100">
            {devices.length > 0 ?
              devices
            :
              <div className="col-md-12 text-center center-xy">
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
