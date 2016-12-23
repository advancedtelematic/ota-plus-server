define(function(require) {
  var React = require('react'),
      ReactDOM = require('react-dom'),
      Router = require('react-router'),
      _ = require('underscore'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      Cookies = require('js-cookie'),
      DeviceListItem = require('./devices-list-item');

  const minBoxWidth = 350;
  const boxHeight = 105;

  class DevicesList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        boxWidth: 350,
        howManyBoxesPerRow: 4,
        overUUID: null,
        areSmartGroupsEnabled: false,
        devicesShownStartIndex: 0,
        devicesShownEndIndex: 20
      };
      this.setBoxesWidth = this.setBoxesWidth.bind(this);
      this.onDragEnter = this.onDragEnter.bind(this);
      this.onDragLeave = this.onDragLeave.bind(this);
      this.onDragOver = this.onDragOver.bind(this);
      this.onDrop = this.onDrop.bind(this);
      this.devicesListScroll = this.devicesListScroll.bind(this);
    }
    componentDidMount() {
      this.setBoxesWidth();
      this.devicesListScroll();
      ReactDOM.findDOMNode(this.refs.devicesList).addEventListener('scroll', this.devicesListScroll);
      window.addEventListener("resize", this.setBoxesWidth);
    }
    componentWillReceiveProps(nextProps) {
      if(nextProps.draggingDevice === null || !_.isEqual(this.props.draggingDevice, nextProps.draggingDevice)) {
        this.setState({overUUID: null});
      }
    }
    componentDidUpdate(prevProps, prevState) {
      if(this.props.devicesListHeight !== prevProps.devicesListHeight && (this.refs.intendContainer).offsetWidth) {
        this.devicesListScroll();
      }
    }
    componentWillUnmount() {
      ReactDOM.findDOMNode(this.refs.devicesList).removeEventListener('scroll', this.devicesListScroll);
      window.removeEventListener("resize", this.setBoxesWidth);
    }
    setBoxesWidth() {
      var containerWidth = $('.intend-container').width();
      var howManyBoxesPerRow = Math.floor(containerWidth / minBoxWidth);
      this.setState({
        boxWidth: Math.floor(containerWidth / howManyBoxesPerRow),
        howManyBoxesPerRow: howManyBoxesPerRow
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
    devicesListScroll() {
      var howManyBoxesPerRow = Math.floor(ReactDOM.findDOMNode(this.refs.intendContainer).offsetWidth / minBoxWidth); 
      var howManyBoxesPerColumn = Math.ceil(ReactDOM.findDOMNode(this.refs.intendContainer).offsetHeight / boxHeight);
      var howManyBoxes = howManyBoxesPerRow * howManyBoxesPerColumn;
      var offset = 1 * howManyBoxesPerRow;
      var devicesShownStartIndex = howManyBoxesPerRow * Math.floor(((ReactDOM.findDOMNode(this.refs.devicesList).scrollTop)) / boxHeight);
      var devicesShownEndIndex = devicesShownStartIndex + howManyBoxes - 1;
      this.setState({
        devicesShownStartIndex: devicesShownStartIndex - offset,
        devicesShownEndIndex: devicesShownEndIndex + offset
      });
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
                              
          if(i === this.state.devicesShownStartIndex - 1)
            devicesList.push(
              <div key="before" style={{height: Math.floor((i + 1)/this.state.howManyBoxesPerRow) * boxHeight }}></div>
            );
          else if(i >= this.state.devicesShownStartIndex && i <= this.state.devicesShownEndIndex)
            devicesList.push(
              <span 
                data-uuid={device.uuid}
                data-groupuuid={device.groupUUID}
                className={className}
                key={i}
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
          else if(i === devices.length - 1)
            devicesList.push(
              <div key="after" style={{height: Math.ceil((devices.length - this.state.devicesShownEndIndex - 1) / this.state.howManyBoxesPerRow) * boxHeight }}></div>
            );
        }
      }, this);

      return (
        <div id="devices-list" ref="devicesList" style={{height: this.props.devicesListHeight}}>
          <div className="container intend-container height-100" ref="intendContainer">
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
