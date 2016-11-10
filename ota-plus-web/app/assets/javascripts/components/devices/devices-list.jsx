define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      _ = require('underscore'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      Cookies = require('js-cookie'),
      DeviceListItem = require('es6!./devices-list-item'),
      DeviceListGroupItem = require('es6!./devices-list-groupitem');

  class DevicesList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        boxWidth: 340,
        boxesPerRow: null,
        draggingUUID: null,
        overUUID: null,
        Devices: null
      };
      this.setBoxesWidth = this.setBoxesWidth.bind(this);
      this.dragStart = this.dragStart.bind(this);
      this.dragEnter = this.dragEnter.bind(this);
      this.dragEnd = this.dragEnd.bind(this);
      this.dragOver = this.dragOver.bind(this);
      this.dragLeave = this.dragLeave.bind(this);
      this.drop = this.drop.bind(this);
    }
    componentDidMount() {
      this.setBoxesWidth();
      window.addEventListener("resize", this.setBoxesWidth);
    }
    componentWillUnmount() {
      window.removeEventListener("resize", this.setBoxesWidth);
    }
    setBoxesWidth() {
      var containerWidth = $('#devices-container > div').width();
      var minBoxWidth = 340;
      var howManyBoxesPerRow = Math.floor(containerWidth / minBoxWidth);
      this.setState({
        boxWidth: containerWidth / howManyBoxesPerRow,
        boxesPerRow: howManyBoxesPerRow,
      });
    }
    dragStart(e) {
      this.setState({
        draggingUUID: e.currentTarget.dataset.uuid,
      });
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData("text/html", null);
    }
    dragEnter(e) {
      e.preventDefault();
    }
    dragOver(e) {
      e.preventDefault();
      this.setState({overUUID: e.currentTarget.dataset.uuid});
    }
    dragLeave(e) {
      this.setState({overUUID: null});
    }
    dragEnd(e) {
      this.setState({draggingUUID: null, overUUID: null});
    }
    drop(e) {        
      if(e.preventDefault)
        e.preventDefault();
      var draggingUUID = this.state.draggingUUID;
      var dropUUID = e.currentTarget.dataset.uuid;
      var groupedDevices = [draggingUUID, dropUUID];
                        
      if(this.state.draggingUUID !== null && this.state.draggingUUID !== dropUUID) {
        this.props.openNewSmartGroupModal(groupedDevices);
      }   
    }
    render() {        
      var devices = [];
      var Devices = this.props.devices;
                  
      _.each(Devices, function(device, i) {
        if(!_.isUndefined(device)) {
          var className = '';
          if(this.state.draggingUUID !== null) {
            if(this.state.draggingUUID !== device.uuid) {
              className = this.state.overUUID === device.uuid ? 'droppable active' : 'droppable';
            } else {
              className = 'dragging';
            }
          }
                    
          devices.push(
            <span data-uuid={device.uuid}
              className={className}
              key={"dnd-device-" + device.uuid}
              draggable={(!_.isUndefined(this.props.isDND) ? this.props.isDND : "true")}
              onDragEnd={_.isUndefined(this.props.isDND) || this.props.isDND ? this.dragEnd : null}
              onDragOver={_.isUndefined(this.props.isDND) || this.props.isDND ? this.dragOver : null}
              onDragLeave={_.isUndefined(this.props.isDND) || this.props.isDND ? this.dragLeave : null}
              onDragStart={_.isUndefined(this.props.isDND) || this.props.isDND ? this.dragStart : null}
              onDragEnter={_.isUndefined(this.props.isDND) || this.props.isDND ? this.dragEnter : null}
              onDrop={_.isUndefined(this.props.isDND) || this.props.isDND ? this.drop : null}>
              <DeviceListItem key={device.uuid}
                device={device}
                isProductionDevice={this.props.areProductionDevices}
                productionDeviceName={this.props.productionDeviceName}
                width={this.state.boxWidth}
                openRenameDeviceModal={this.props.openRenameDeviceModal}
                areActionButtonsShown={!_.isUndefined(this.props.areActionButtonsShown) ? this.props.areActionButtonsShown : true}/>
            </span>
          );
        }
      }, this);

      var button = (
        <div className="add-device-btn-wrapper" style={{width: this.state.boxWidth}}>
          <button type="button" className="btn btn-rect" onClick={this.props.openNewDeviceModal}><i className="fa fa-plus"></i> Add new Device</button>
        </div>
      );

      return (
        <div id="devices-list">
          <div id="devices-container" className="container">
            {devices.length > 0 ?
              <div>
                {button}
                {devices}
              </div>
            :
              <div className="col-md-12 text-center center-xy">
                {this.props.isDevicesListEmpty ?
                  <span>
                    <div className="font-24">Welcome to ATS Garage.</div>
                    <button className="btn btn-confirm margin-top-20" onClick={this.props.openNewDeviceModal}>Add new device</button>
                  </span>
                :
                  this.props.areProductionDevices ?
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
