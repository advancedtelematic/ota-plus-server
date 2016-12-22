define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      _ = require('underscore'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      Cookies = require('js-cookie'),
      DeviceListItem = require('./devices-list-item');

  class DevicesList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        boxWidth: 350,
        overUUID: null,
        Devices: null,
        areSmartGroupsEnabled: false
      };
      this.setBoxesWidth = this.setBoxesWidth.bind(this);
      this.onDragEnter = this.onDragEnter.bind(this);
      this.onDragLeave = this.onDragLeave.bind(this);
      this.onDragOver = this.onDragOver.bind(this);
      this.onDrop = this.onDrop.bind(this);
    }
    componentDidMount() {
      this.setBoxesWidth();
      window.addEventListener("resize", this.setBoxesWidth);
    }
    componentWillReceiveProps(nextProps) {
      if(!nextProps.draggingDeviceUUID && this.props.draggingDeviceUUID !== nextProps.draggingDeviceUUID) {
        this.setState({overUUID: null});
      }
    }
    componentWillUnmount() {
      window.removeEventListener("resize", this.setBoxesWidth);
    }
    setBoxesWidth() {
      var containerWidth = $('#devices-container > div').innerWidth();
      var minBoxWidth = 350;
      var howManyBoxesPerRow = Math.floor(containerWidth / minBoxWidth);
      this.setState({
        boxWidth: Math.floor(containerWidth / howManyBoxesPerRow) - 5,
      });
    }
    onDragEnter(e) {
      e.preventDefault();
    }
    onDragLeave(e) {
      this.setState({overUUID: null});
    }
    onDragOver(e) {
      e.preventDefault();
      this.setState({overUUID: e.currentTarget.dataset.uuid});
    }
    onDrop(e) {
      if(e.preventDefault)
        e.preventDefault();
      if(this.state.areSmartGroupsEnabled) {
        var draggingUUID = this.props.draggingDeviceUUID;
        var dropUUID = e.currentTarget.dataset.uuid;
        var groupedDevices = [draggingUUID, dropUUID];
                        
        if(draggingUUID !== null && draggingUUID !== dropUUID) {
          this.props.openNewSmartGroupModal(groupedDevices);
        }
      }
    }
    render() {
      const devices = this.props.devices;
      var devicesList = [];
      _.each(devices, function(device, i) {
        if(!_.isUndefined(device)) {
          var className = '';
          if(this.state.areSmartGroupsEnabled && this.props.draggingDeviceUUID !== null && this.props.isDND) {
            if(this.props.draggingDeviceUUID !== device.uuid) {
              className = this.state.overUUID === device.uuid ? 'droppable active' : 'droppable';
            } else {
              className = 'dragging';
            }
          }
          devicesList.push(
            <span 
              data-uuid={device.uuid}
              data-groupuuid={device.groupUUID}
              className={className}
              key={"dnd-device-" + device.uuid}
              draggable={!_.isUndefined(this.props.isDND) ? this.props.isDND : "true"}
              onDragStart={_.isUndefined(this.props.isDND) || this.props.isDND ? this.props.onDeviceDragStart : null}
              onDragEnd={_.isUndefined(this.props.isDND) || this.props.isDND ? this.props.onDeviceDragEnd : null}
              onDragEnter={_.isUndefined(this.props.isDND) || this.props.isDND ? this.onDragEnter : null}
              onDragLeave={_.isUndefined(this.props.isDND) || this.props.isDND ? this.onDragLeave : null}
              onDragOver={_.isUndefined(this.props.isDND) || this.props.isDND ? this.onDragOver : null}
              onDrop={_.isUndefined(this.props.isDND) || this.props.isDND ? this.onDrop : null}>
              <DeviceListItem key={device.uuid}
                device={device}
                isProductionDevice={this.props.areProductionDevices}
                productionDeviceName={this.props.productionDeviceName}
                width={this.state.boxWidth}
                openRenameDeviceModal={this.props.openRenameDeviceModal}/>
            </span>
          );
        }
      }, this);

      return (
        <div id="devices-list">
          <div id="devices-container" className="container">
            {devicesList.length > 0 ?
              devicesList
            :
              <div className="col-md-12 text-center center-xy">
                {this.props.areProductionDevices ?
                  <span className="font-24">Oops, there are too many devices to show.</span>
                :
                  <span className="font-24">Oops, there are no devices to show.</span>
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
