define(function(require) {
  var React = require('react'),
      ReactDOM = require('react-dom'),
      Router = require('react-router'),
      Link = Router.Link;

  class DeviceListItem extends React.Component {
    constructor(props) {
      super(props);
      this.renameDevice = this.renameDevice.bind(this);
      this.goToDetailsPage = this.goToDetailsPage.bind(this);
    }
    renameDevice(e) {
      e.preventDefault();
      e.stopPropagation();
      this.props.openRenameDeviceModal(this.props.device);
    }
    goToDetailsPage() {
      const link = this.props.isProductionDevice ? 'productiondevicedetails/' + this.props.productionDeviceName : '/devicedetails/' + this.props.device.uuid;
      this.context.history.pushState(null, link);
    }
    render() {
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
        <div onClick={this.goToDetailsPage} className="common-box" id={"link-devicedetails-" + this.props.device.uuid} style={{width: this.props.width}}>
          <div className="common-box-actions">
            <ul>
              <li onClick={this.renameDevice} title="Rename device" data-toggle="device-tooltip" data-placement="right">
                <img src="/assets/img/icons/edit_white.png" alt="" />
              </li>
            </ul>
          </div>
          <div className="common-box-icon">
            <div className={"device-status device-status-" + this.props.device.status}></div>
          </div>
          <div className="common-box-desc">
            <div className="common-box-title" title={deviceName}>{deviceName}</div>
            <div className="common-box-subtitle">
              {this.props.device.status !== 'NotSeen' ?
                <span>Last seen: {lastSeenDate.toDateString() + ' ' + lastSeenDate.toLocaleTimeString()}</span>
              :
                <span>Never seen online</span>
              }
            </div>
            <div className="common-box-subtitle">{this.props.device.groupName ? "Group: " + this.props.device.groupName : "Ungrouped"}</div>
          </div>
        </div>
      );
    }
  };
  
  DeviceListItem.contextTypes = {
    history: React.PropTypes.object.isRequired,
  };

  return DeviceListItem;
});
