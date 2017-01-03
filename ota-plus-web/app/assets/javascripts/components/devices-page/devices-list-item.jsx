define(function(require) {
  var React = require('react'),
      ReactDOM = require('react-dom'),
      Router = require('react-router'),
      Link = Router.Link;

  class DeviceListItem extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isMouseOverActions: false,
      };
      this.renameDevice = this.renameDevice.bind(this);
      this.goToDetailsPage = this.goToDetailsPage.bind(this);
      this.actionsMouseEnter = this.actionsMouseEnter.bind(this);
      this.actionsMouseLeave = this.actionsMouseLeave.bind(this);
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
    actionsMouseEnter() {
      this.setState({
        isMouseOverActions: true
      });
    }
    actionsMouseLeave() {
      this.setState({
        isMouseOverActions: false
      });
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
        <div onClick={this.goToDetailsPage} className={"common-box" + (this.state.isMouseOverActions ? " actions-active" : "")} id={"link-devicedetails-" + this.props.device.uuid} style={{width: this.props.width}}>
          <div className="common-box-actions" onMouseEnter={this.actionsMouseEnter} onMouseLeave={this.actionsMouseLeave}>
            <ul>
              <li onClick={this.renameDevice} title="Rename device" data-toggle="device-tooltip" data-placement="right">
                <img src="/assets/img/icons/edit_white.png" alt="" />
                <div>Rename</div>
              </li>
            </ul>
          </div>
          <div className="common-box-icon">
            <div className={"device-status device-status-" + this.props.device.status} title={deviceStatus}></div>
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
