define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      _ = require('underscore'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      Cookies = require('js-cookie'),
      DeviceListItem = require('es6!./devices-list-item'),
      DeviceListGroupItem = require('es6!./devices-list-groupitem'),
      DevicesGroupDetailsPanel = require('es6!./devices-group-details-panel'),
      CreateGroup = require('es6!../groups/create-group');

  class DevicesList extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        boxWidth: 340,
        boxesPerRow: null,
        showForm: false,
        draggingUUID: null,
        overUUID: null,
        groupDevices: [],
        Groups: null,
        Devices: null,
        expandedGroupName: null
      };
      
      this.restoreGroups = this.restoreGroups.bind(this);
      this.expandGroup = this.expandGroup.bind(this);
      
      this.setBoxesWidth = this.setBoxesWidth.bind(this);
      this.openForm = this.openForm.bind(this);
      this.closeForm = this.closeForm.bind(this);      
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
      this.restoreGroups(this.props.devices, this.props.groups);
    }
    componentWillReceiveProps(nextProps) {
      this.restoreGroups(nextProps.devices, nextProps.groups);
    }
    componentWillUnmount() {
      window.removeEventListener("resize", this.setBoxesWidth);
    }
    restoreGroups(devices, groupsInfo) {
      var that = this;
      var groups = [];
      var groupedDevices = [];
      
      _.each(groupsInfo, function(group, index) {
        groups[index] = group;
        groups[index].devices = [];
        _.each(group.devicesUUIDs, function(groupDevice) {
          var foundDevice = _.findWhere(devices, {uuid: groupDevice});
          if(foundDevice) {
            groupedDevices.push(groupDevice);
            groups[index].devices.push(foundDevice);
          }
        });
      });
          
      devices = _.filter(devices, function(device) { 
        return !_.find(groupedDevices, function(groupedDevice) {
          return groupedDevice === device.uuid;
        }); 
      });
                        
      this.setState({
        Devices: devices,
        Groups: groups
      });
    }
    expandGroup(groupName) {
      this.setState({
        expandedGroupName: this.state.expandedGroupName !== groupName ? groupName : null
      });
    }
    setBoxesWidth() {
      var containerWidth = $('#devices-container > div').width();
      var minBoxWidth = 340;
      var howManyBoxesPerRow = Math.floor(containerWidth / minBoxWidth);
      this.setState({
        boxWidth: containerWidth / howManyBoxesPerRow,
        boxesPerRow: howManyBoxesPerRow,
        groupPanelWidth: $('#devices-list').width()
      });
    }
    openForm() {
      this.setState({
        showForm: true
      });
    }
    closeForm() {
      this.setState({
        showForm: false
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
      var groupDevices = [draggingUUID, dropUUID];
                        
      if(this.state.draggingUUID !== null && this.state.draggingUUID !== dropUUID) {
        this.setState({
          groupDevices: groupDevices
        });
        this.openForm();
      }   
    }
    render() {        
      var devices = [];
      var groups = [];
      var Devices = this.state.Devices;
      var Groups = this.state.Groups;
                  
      var itemIndex = 1;
      var rows = [];
      var expandedItemIndex = null;
                        
      _.each(Groups, function(group) {
        var rowNo = Math.ceil(itemIndex/this.state.boxesPerRow);
        var isLastItemInRow = (itemIndex/this.state.boxesPerRow % 1 === 0 || (!Object.keys(Devices).length && itemIndex === Object.keys(Groups).length));
        
        if(_.isUndefined(rows[rowNo]))
          rows[rowNo] = [];
        
        rows[rowNo].push(group.groupName);
                                
        var deviceListGroupItem = (
          <span key={'group-' + group.groupName}>
            <DeviceListGroupItem
              group={group}
              width={this.state.boxWidth}
              expandGroup={this.expandGroup}
              openRenameGroupModal={this.props.openRenameGroupModal}
              areActionButtonsShown={!_.isUndefined(this.props.areActionButtonsShown) ? this.props.areActionButtonsShown : true}/>
          </span>
        );

        if(this.state.expandedGroupName === group.groupName)
          expandedItemIndex = itemIndex;

        itemIndex++;

        groups.push(deviceListGroupItem);

        if(isLastItemInRow)
          groups.push(
            <div key={'group-panel-details-' + group.groupName}>
              <VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}}>
                {rows[rowNo].indexOf(this.state.expandedGroupName) > -1 && isLastItemInRow ? 
                  <DevicesGroupDetailsPanel 
                    devices={_.findWhere(Groups, {groupName: this.state.expandedGroupName}).devices}
                    width={this.state.groupPanelWidth}
                    boxWidth={this.state.boxWidth}
                    openRenameDeviceModal={this.props.openRenameDeviceModal}
                    arrowLeftPosition={(((expandedItemIndex - 1) % this.state.boxesPerRow) * this.state.boxWidth + 50)}
                    areActionButtonsShown={!_.isUndefined(this.props.areActionButtonsShown) ? this.props.areActionButtonsShown : true}/>
                : null}
              </VelocityTransitionGroup>
            </div>
          );
      }, this);
            
      var devicesIndexItem = 1;
      _.each(Devices, function(device, i) {
        if(!_.isUndefined(device)) {
          var rowNo = Math.ceil(itemIndex/this.state.boxesPerRow);
          var isLastItemInRow = itemIndex/this.state.boxesPerRow % 1 === 0 || Object.keys(Devices).length === devicesIndexItem;
          
          if(_.isUndefined(rows[rowNo]))
            rows[rowNo] = [];
          
          var className = '';
          if(this.state.draggingUUID !== null) {
            if(this.state.draggingUUID !== device.uuid) {
              className = this.state.overUUID === device.uuid ? 'droppable active' : 'droppable';
            } else {
              className = 'dragging';
            }
          }
                    
          var returnedDevice = (
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
          
          itemIndex++;
          devicesIndexItem++;
          
          devices.push(returnedDevice);
          
          if(isLastItemInRow)
            devices.push(
              <div key={"device-panel-details-" + i}>
                <VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}}>
                  {rows[rowNo].indexOf(this.state.expandedGroupName) > -1 && isLastItemInRow ?
                    <DevicesGroupDetailsPanel 
                      devices={_.findWhere(Groups, {groupName: this.state.expandedGroupName}).devices}
                      width={this.state.groupPanelWidth}
                      boxWidth={this.state.boxWidth}
                      arrowLeftPosition={(((expandedItemIndex - 1) % this.state.boxesPerRow) * this.state.boxWidth + 50)}
                      openRenameDeviceModal={this.props.openRenameDeviceModal}
                      areActionButtonsShown={!_.isUndefined(this.props.areActionButtonsShown) ? this.props.areActionButtonsShown : true}/>
                  : null}
                </VelocityTransitionGroup>
              </div>
            );
        }
      }, this);

      return (
        <div id="devices-list">
          <div id="devices-container" className="container">
            {devices.length > 0 || groups.length > 0 ?
              <div>
                {groups}
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
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {this.state.showForm ?
              <CreateGroup
                groupDevices={this.state.groupDevices}
                closeForm={this.closeForm}
                key="create-group"/>
            : null}
          </VelocityTransitionGroup>
        </div>
      );
    }
  };

  return DevicesList;
});
