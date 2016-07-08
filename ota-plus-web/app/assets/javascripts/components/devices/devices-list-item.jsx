define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link;

  class DeviceListItem extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      const link = this.props.isProductionDevice ? 'productiondevicedetails' : 'devicedetails';
      const deviceId = this.props.deviceId;
      const deviceName = this.props.deviceName;
      return (
        <Link to={`${link}/${this.props.id}`} className="device-box">
          <div className="device-icon"></div>
          <div className="device-desc">
            <div className="device-name">
              <div className={"device-status device-status-" + this.props.status}>
                <i className="fa fa-circle" aria-hidden="true"></i>
              </div>
              {deviceName}
            </div>
            <div className="device-uuid">{deviceId}</div>
          </div>
        </Link>
      );
    }
  };

  return DeviceListItem;
});
