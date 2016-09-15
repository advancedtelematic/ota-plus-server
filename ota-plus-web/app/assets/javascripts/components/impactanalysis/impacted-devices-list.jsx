define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      _ = require('underscore'),
      ImpactedDevicesListItem = require('es6!./impacted-devices-list-item');

  class ImpactedDevicesList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        boxWidth: 200
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
      var containerWidth = $('#impacted-devices-container').width();
      var minBoxWidth = 200;
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
          <ImpactedDevicesListItem key={device.deviceName}
            device={device}
            isProductionDevice={false}
            productionDeviceName={false}
            width={this.state.boxWidth}/>
        );
      }, this);

      return (
        <div id="devices-list" className="pull-left">
          <div id="impacted-devices-container" className="container">
            {devices.length > 0 ?
              devices
            :
              <span>There are no impacted devices.</span>
            }
          </div>
        </div>
      );
    }
  };

  return ImpactedDevicesList;
});
