define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link;

  class DeviceListItem extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      const link = this.props.isProductionDevice ? 'productiondevicedetails/' + this.props.productionDeviceName : 'devicedetails/' + this.props.device.id;
      const lastSeenDate = new Date(this.props.device.lastSeen);
      var deviceName = this.props.device.deviceName;
      var deviceStatus = 'Status unknown';
      switch(this.props.device.status) {
        case 'UpToDate':
          deviceStatus = 'Device synchronized';
        break;
        case 'Outdated':
          deviceStatus = 'Device unsynchronized';
        break;
        case 'Error':
          deviceStatus = 'Installation error';
        break;
        default:
        break;
      }
      return (
        <Link to={`${link}`} className="device-box" id={"link-devicedetails-" + this.props.device.id} style={{width: this.props.width}}>
          <div className="device-icon">
            <div className={"device-status device-status-" + this.props.device.status}>
              <i className="fa fa-circle" aria-hidden="true"></i>
            </div>
          </div>
          <div className="device-desc">
            <div className="device-name">{deviceName}</div>
            <div className="device-lastseen">
              {this.props.device.status !== 'NotSeen' ?
                <span>Last seen online: {lastSeenDate.toDateString() + ' ' + lastSeenDate.toLocaleTimeString()}</span>
              :
                <span>Never seen online</span>
              }
            </div>
            <div className="device-status-text">Device status: {deviceStatus}</div>
          </div>
        </Link>
      );
    }
  };

  return DeviceListItem;
});
