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
      if(nextProps.draggingDevice === null || !_.isEqual(this.props.draggingDevice, nextProps.draggingDevice)) {
        this.setState({overUUID: null});
      }
    }
    componentWillUnmount() {
      window.removeEventListener("resize", this.setBoxesWidth);
    }
    setBoxesWidth() {
      var containerWidth = $('.intend-container').width();
      var minBoxWidth = 350;
      var howManyBoxesPerRow = Math.floor(containerWidth / minBoxWidth);
      this.setState({
        boxWidth: Math.floor(containerWidth / howManyBoxesPerRow),
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
        var draggingUUID = this.props.draggingDevice.uuid;
        var dropUUID = e.currentTarget.dataset.uuid;
        var groupedDevices = [draggingUUID, dropUUID];
                        
        if(draggingUUID !== null && draggingUUID !== dropUUID) {
          this.props.openNewSmartGroupModal(groupedDevices);
        }
      } else {
        this.props.onDeviceDragEnd();
      }
    }
    render() {
      const devices = this.props.devices;
      var devicesList = [];
      _.each(devices, function(device, i) {
        if(!_.isUndefined(device)) {
          var className = '';
          if(this.state.areSmartGroupsEnabled && !_.isUndefined(this.props.draggingDevice.uuid) && this.props.isDND) {
            if(this.props.draggingDevice.uuid !== device.uuid) {
              className = this.state.overUUID === device.uuid ? 'droppable active' : 'droppable';
            } else {
              className = 'dragging';
            }
          }
          if(this.props.draggingDevice !== null && !_.isUndefined(this.props.draggingDevice.uuid) && this.props.draggingDevice.uuid === device.uuid) {
            className = 'dragging';
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
          <div className="container intend-container height-100">
            {devicesList.length > 0 ?
              devicesList
            :
              <div className="col-md-12 text-center center-xy">
                {this.props.areProductionDevices ?
                  <span className="font-24 white">Oops, there are too many devices to show.</span>
                :
                  <span className="font-24 white">Oops, there are no devices to show.</span>
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
