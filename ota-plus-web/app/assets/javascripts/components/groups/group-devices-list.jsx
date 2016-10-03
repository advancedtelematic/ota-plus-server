define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      _ = require('underscore'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      Cookies = require('js-cookie'),
      DeviceListItem = require('es6!../devices/devices-list-item');

  class GroupDevicesList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        boxWidth: 330,
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
      var minBoxWidth = 330;
      var howManyBoxesPerRow = Math.floor(containerWidth / minBoxWidth);
      this.setState({
        boxWidth: containerWidth / howManyBoxesPerRow
      });
    }
    render() {
      var devices = [];
      var Devices = this.props.Devices;
            
      for(var i in Devices) {
        devices.push(
          <span key={"device-" + i}>
            <DeviceListItem key={Devices[i].deviceName}
              device={Devices[i]}
              isProductionDevice={false}
              productionDeviceName={false}
              width={this.state.boxWidth}/>
         </span>
        );
      }

      return (
        <div id="devices-list">
          <div id="devices-container" className="container">
            {devices}
          </div>
        </div>
      );
    }
  };

  return GroupDevicesList;
});
