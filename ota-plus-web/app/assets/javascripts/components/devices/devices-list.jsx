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
        draggingId: null,
        draggingName: null,
        overId: null,
        groupNames: [],
        Groups: null,
        Devices: null,
        expandedGroupName: null
      };
      
      this.restoreGroups = this.restoreGroups.bind(this);
      this.checkIfComponentsMatch = this.checkIfComponentsMatch.bind(this);
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
    checkIfComponentsMatch(data, common, isCorrect) {
      if (Object.keys(common).length !== _.union(Object.keys(data), Object.keys(common)).length) {
        isCorrect = false;
      } else {
        for (var prop in common) {
          if (common[prop] !== null) {
            if (data.hasOwnProperty(prop)) {
              if (typeof common[prop] == 'object') {
                isCorrect = this.checkIfComponentsMatch(data[prop], common[prop], isCorrect);
              } else if(common[prop] !== data[prop]) {
		isCorrect = false;
	      }
            } else {
              isCorrect = false;
            }
          }
        }
      }
      return isCorrect;
    }
    restoreGroups(devices, groupsJSON) {
      var that = this;
      var groups = [];
            
      _.each(devices, function(device, deviceIndex) {
        _.each(groupsJSON, function(group) {
          var deviceComponents = _.clone(device.components);
          var correct = true;
          
          if(!_.isUndefined(deviceComponents)) {
            correct = that.checkIfComponentsMatch(deviceComponents, JSON.parse(group.groupInfo), correct);
            if(correct) {
              if(typeof groups[group.groupName] == 'undefined' || !groups[group.groupName] instanceof Array) {
                groups[group.groupName] = [];
                groups[group.groupName].devices = [];
                groups[group.groupName].info = group;
              }
              groups[group.groupName].devices.push(device);
              delete devices[deviceIndex];
            }
          }
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
        draggingId: Number(e.currentTarget.dataset.id),
        draggingName: e.currentTarget.dataset.name
      });
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData("text/html", null);
    }
    dragEnter(e) {
      e.preventDefault();
    }
    dragOver(e) {
      e.preventDefault();
      this.setState({overId: Number(e.currentTarget.dataset.id)});
    }
    dragLeave(e) {
      this.setState({overId: null});
    }
    dragEnd(e) {
      this.setState({draggingId: null, draggingName: null, overId: null});
    }
    drop(e) {
      if(e.preventDefault)
        e.preventDefault();
      var draggingName = this.state.draggingName;
      var draggingId = this.state.draggingId;
      var dropName = e.currentTarget.dataset.name;
      var dropId = Number(e.currentTarget.dataset.id);
      var groupNames = [draggingName, dropName];
            
      if(this.state.draggingId !== null && this.state.draggingId !== dropId) {
        this.setState({
          groupNames: groupNames
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
      for(var groupName in Groups) {
        var rowNo = Math.ceil(itemIndex/this.state.boxesPerRow);
        var isLastItemInRow = (itemIndex/this.state.boxesPerRow % 1 === 0 || (!Object.keys(Devices).length && itemIndex === Object.keys(Groups).length));
        
        if(_.isUndefined(rows[rowNo]))
          rows[rowNo] = [];
        
        rows[rowNo].push(groupName);
                                
        groups.push(
          <span key={'group-' + groupName}>
            <DeviceListGroupItem
              group={Groups[groupName]}
              width={this.state.boxWidth}
              expandGroup={this.expandGroup}
              openRenameGroupModal={this.props.openRenameGroupModal}
              areActionButtonsShown={!_.isUndefined(this.props.areActionButtonsShown) ? this.props.areActionButtonsShown : true}/>
          </span>
        );

        if(this.state.expandedGroupName === groupName)
          expandedItemIndex = itemIndex;

        groups.push(
          <span key={'group-panel-details-' + groupName}>
            <VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}}>
              {rows[rowNo].indexOf(this.state.expandedGroupName) > -1 && isLastItemInRow ? 
                <DevicesGroupDetailsPanel 
                  devices={Groups[this.state.expandedGroupName].devices}
                  width={this.state.groupPanelWidth}
                  boxWidth={this.state.boxWidth}
                  arrowLeftPosition={(((expandedItemIndex - 1) % this.state.boxesPerRow) * this.state.boxWidth + 53)}
                  areActionButtonsShown={!_.isUndefined(this.props.areActionButtonsShown) ? this.props.areActionButtonsShown : true}/>
              : null}
            </VelocityTransitionGroup>
          </span>
        );
        itemIndex++;
      }
      
      var devicesIndexItem = 1;
      var devices = _.map(Devices, function(device, i) {
        if(!_.isUndefined(device)) {
          var rowNo = Math.ceil(itemIndex/this.state.boxesPerRow);
          var isLastItemInRow = itemIndex/this.state.boxesPerRow % 1 === 0 || Object.keys(Devices).length === devicesIndexItem;
          
          if(_.isUndefined(rows[rowNo]))
            rows[rowNo] = [];
          
          var className = '';
          if(this.state.draggingId !== null) {
            if(this.state.draggingId !== i) {
              className = this.state.overId === i ? 'droppable active' : 'droppable';
            } else {
              className = 'dragging';
            }
          }
                    
          var returnedData = (
            <span data-id={i}
              data-name={device.deviceName}
              className={className}
              key={"dnd-device-" + i}
              draggable={(!_.isUndefined(this.props.isDND) ? this.props.isDND : "true")}
              onDragEnd={_.isUndefined(this.props.isDND) || this.props.isDND ? this.dragEnd : null}
              onDragOver={_.isUndefined(this.props.isDND) || this.props.isDND ? this.dragOver : null}
              onDragLeave={_.isUndefined(this.props.isDND) || this.props.isDND ? this.dragLeave : null}
              onDragStart={_.isUndefined(this.props.isDND) || this.props.isDND ? this.dragStart : null}
              onDragEnter={_.isUndefined(this.props.isDND) || this.props.isDND ? this.dragEnter : null}
              onDrop={_.isUndefined(this.props.isDND) || this.props.isDND ? this.drop : null}>
              <DeviceListItem key={device.deviceName}
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
                  devices={Groups[this.state.expandedGroupName].devices}
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
                groupNames={this.state.groupNames}
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
