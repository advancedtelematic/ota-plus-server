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
        boxWidth: 330,
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
      var that = this;
      this.setBoxesWidth();
      window.addEventListener("resize", this.setBoxesWidth);
      this.restoreGroups(this.props.Devices, this.props.groups);
    }
    componentWillReceiveProps(nextProps) {
      this.restoreGroups(nextProps.Devices, nextProps.groups);
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
      var minBoxWidth = 330;
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
                        
      groups = _.map(Groups, function(group) {
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

        return (
          <span key={'group-panel-details-' + group.groupName}>
            {deviceListGroupItem}
            <span>
              <VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}}>
                {rows[rowNo].indexOf(this.state.expandedGroupName) > -1 && isLastItemInRow ? 
                  <DevicesGroupDetailsPanel 
                    devices={_.findWhere(Groups, {groupName: this.state.expandedGroupName}).devices}
                    width={this.state.groupPanelWidth}
                    boxWidth={this.state.boxWidth}
                    arrowLeftPosition={(((expandedItemIndex - 1) % this.state.boxesPerRow) * this.state.boxWidth + 53)}
                    areActionButtonsShown={!_.isUndefined(this.props.areActionButtonsShown) ? this.props.areActionButtonsShown : true}/>
                : null}
              </VelocityTransitionGroup>
            </span>
          </span>
        );
      }, this);
            
      var devicesIndexItem = 1;
      var devices = _.map(Devices, function(device, i) {
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
                    
          var returnedData = (
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
          
          var returnedPanelDetails = (
            <VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}}>
              {rows[rowNo].indexOf(this.state.expandedGroupName) > -1 && isLastItemInRow ?
                <DevicesGroupDetailsPanel 
                  devices={_.findWhere(Groups, {groupName: this.state.expandedGroupName}).devices}
                  width={this.state.groupPanelWidth}
                  boxWidth={this.state.boxWidth}
                  arrowLeftPosition={(((expandedItemIndex - 1) % this.state.boxesPerRow) * this.state.boxWidth + 53)}
                  openRenameDeviceModal={this.props.openRenameDeviceModal}
                  areActionButtonsShown={!_.isUndefined(this.props.areActionButtonsShown) ? this.props.areActionButtonsShown : true}/>
              : null}
            </VelocityTransitionGroup>
          );
          itemIndex++;
          devicesIndexItem++;
          
          return (
            <span key={"device-panel-details-" + i}>
              {returnedData}
              {returnedPanelDetails}
            </span>
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
                <br />
                {this.props.areProductionDevices ?
                  <span><i className="fa fa-warning"></i> Sorry, there are too many devices to show.</span>
                :
                  <span><i className="fa fa-warning"></i> Sorry, there are no devices to show.</span>
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
