define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link;

  class ImpactedDevicesListItem extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      const link = 'devicedetails/' + this.props.device.uuid;
      const deviceName = this.props.device.deviceName;
      return (
        <Link to={`${link}`} id={"link-devicedetails-" + this.props.device.uuid} style={{width: this.props.width}}>
          <div className="impacted-device">
              <div className="device-icon"></div>
              <div className="title">{deviceName}</div>
              <div className="subtitle">Available</div>
            </div>
        </Link>
      );
    }
  };

  return ImpactedDevicesListItem;
});
