define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      DeviceListItem = require('es6!./devices-list-item');

  class DevicesGroupDetailsPanel extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      var devices = _.map(this.props.devices, function(device) {
        if(!_.isUndefined(device))
        return (
          <DeviceListItem key={device.deviceName}
            device={device}
            isProductionDevice={false}
            productionDeviceName={null}
            width={this.props.boxWidth}
            openRenameDeviceModal={this.props.openRenameDeviceModal}
            areActionButtonsShown={this.props.areActionButtonsShown}/>
        );
      }, this);
      
      return (
        <div className="group-details-panel" style={{width: this.props.width}}>
          <div className="arrow-pointer" style={{left: this.props.arrowLeftPosition}}></div>
          <div className="group-inner-devices-list col-md-12">
            {devices}
          </div>
        </div>
      );
    }
  };

  DevicesGroupDetailsPanel.contextTypes = {
    strings: React.PropTypes.object.isRequired
  };

  return DevicesGroupDetailsPanel;
});
