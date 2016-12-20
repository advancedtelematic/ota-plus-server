define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      Cookies = require('js-cookie'),
      DevicesPageHeader = require('./devices-page-header'),
      GroupsSection = require('./groups-section'),
      DevicesSection = require('./devices-section'),
      ModalTooltip = require('../modal-tooltip'),
      NewDevice = require('../devices/new-device'),
      RenameDevice = require('../devices/rename-device'),
      NewSmartGroup = require('../groups/new-smart-group'),
      NewManualGroup = require('../groups/new-manual-group'),
      RenameGroup = require('../groups/rename-group'),
      Loader = require('../loader'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group');
      
  class Devices extends React.Component {
    constructor(props) {
      super(props);
      var selectedGroupCookie;
      try {
        selectedGroupCookie = JSON.parse(Cookies.get('selectedGroup'));
      } catch (e) {
        selectedGroupCookie = {name: 'all', type: 'artificial', uuid: ''};
      }
            
      this.state = {
        devicesData: undefined,
        searchableDevicesData: undefined,
        searchableDevicesDataNotFilteredByGroup: undefined,
        searchableDevicesDataNotFilteredOrSorted: undefined,
        searchableProductionDevicesData: undefined,
        groupsData: undefined,
        selectedGroup: selectedGroupCookie,
        filterValue: '',
        selectedStatus: 'All',
        selectedStatusName: 'All',
        selectedSort: 'asc',
        contentHeight: 300,
        isNewDeviceModalShown: false,
        isRenameDeviceModalShown: false,
        renamedDevice: null,
        isNewSmartGroupModalShown: false,
        isNewManualGroupModalShown: false,
        newManualGroupSelectedDeviceUUID: null,
        isRenameGroupModalShown: false,
        renamedGroup: null,
        groupedDevices: [],
        draggingDevice: null,
        draggingOverGroup: null,
        isDraggingOverButton: false,
        isDevicesTooltipShown: false,
      };
      
      this.openNewDeviceModal = this.openNewDeviceModal.bind(this);
      this.closeNewDeviceModal = this.closeNewDeviceModal.bind(this);
      this.openRenameDeviceModal = this.openRenameDeviceModal.bind(this);
      this.closeRenameDeviceModal = this.closeRenameDeviceModal.bind(this);
      this.openNewSmartGroupModal = this.openNewSmartGroupModal.bind(this);
      this.closeNewSmartGroupModal = this.closeNewSmartGroupModal.bind(this);
      this.openNewManualGroupModal = this.openNewManualGroupModal.bind(this);
      this.closeNewManualGroupModal = this.closeNewManualGroupModal.bind(this);
      this.openRenameGroupModal = this.openRenameGroupModal.bind(this);
      this.closeRenameGroupModal = this.closeRenameGroupModal.bind(this);
      this.showDevicesTooltip = this.showDevicesTooltip.bind(this);
      this.hideDevicesTooltip = this.hideDevicesTooltip.bind(this);
      this.selectGroup = this.selectGroup.bind(this);
      this.changeFilter = this.changeFilter.bind(this);
      this.selectStatus = this.selectStatus.bind(this);
      this.selectSort = this.selectSort.bind(this);
      this.refreshData = this.refreshData.bind(this);
      this.setContentHeight = this.setContentHeight.bind(this);
      this.filterAndSortDevices = this.filterAndSortDevices.bind(this);
      this.filterDevicesByGroup = this.filterDevicesByGroup.bind(this);
      this.setDevicesData = this.setDevicesData.bind(this);
      this.setSearchableDevicesAndGroupsData = this.setSearchableDevicesAndGroupsData.bind(this);
      this.setSearchableProductionDevicesData = this.setSearchableProductionDevicesData.bind(this);
      this.handleDeviceCreated = this.handleDeviceCreated.bind(this);
      this.handleDeviceSeen = this.handleDeviceSeen.bind(this);
      this.onDeviceDragStart = this.onDeviceDragStart.bind(this);
      this.onDeviceDragEnd = this.onDeviceDragEnd.bind(this);
      this.onGroupDragOver = this.onGroupDragOver.bind(this);
      this.toggleDraggingOverButton = this.toggleDraggingOverButton.bind(this);

      db.devices.reset();
      db.searchableDevices.reset();
      db.searchableProductionDevices.reset();
      SotaDispatcher.dispatch({actionType: 'get-devices'});
      SotaDispatcher.dispatch({actionType: 'search-devices-by-regex', regex: ''});
      SotaDispatcher.dispatch({actionType: 'get-groups'});
      db.devices.addWatch("devices", _.bind(this.setDevicesData, this, null));
      db.searchableDevices.addWatch("searchable-devices", _.bind(this.setSearchableDevicesAndGroupsData, this, null));
      db.searchableProductionDevices.addWatch("searchable-production-devices", _.bind(this.setSearchableProductionDevicesData, this, null));
      db.groups.addWatch("groups", _.bind(this.setSearchableDevicesAndGroupsData, this, null));
      db.deviceCreated.addWatch("device-created", _.bind(this.handleDeviceCreated, this, null));
      db.deviceSeen.addWatch("device-seen", _.bind(this.handleDeviceSeen, this, null));
    }
    componentDidMount() {
      var that = this;
      window.addEventListener("resize", this.setContentHeight);
      setTimeout(function() {
        that.setContentHeight();
      }, 1);
    }
    componentDidUpdate(prevProps, prevState) {
      if (!_.isEqual(this.state.searchableDevicesData, prevState.searchableDevicesData)) {
        $('[data-toggle="device-tooltip"]').tooltip();
      }
    }
    componentWillUnmount(){
      db.devices.reset();
      db.searchableDevices.reset();
      db.searchableProductionDevices.reset();
      db.groups.reset();
      db.deviceCreated.reset();
      db.devices.removeWatch("devices");
      db.searchableDevices.removeWatch("searchable-devices");
      db.searchableProductionDevices.removeWatch("searchable-production-devices");
      db.groups.removeWatch("groups");
      db.deviceCreated.removeWatch("device-created");
      db.deviceSeen.removeWatch("device-seen");
      window.removeEventListener("resize", this.setContentHeight);
    }
    refreshData(filterValue) {
      SotaDispatcher.dispatch({actionType: 'get-devices'});
      SotaDispatcher.dispatch({actionType: 'search-devices-by-regex', regex: (typeof filterValue !== 'undefined' ? filterValue : this.state.filterValue)});
      SotaDispatcher.dispatch({actionType: 'search-production-devices', regex: (typeof filterValue !== 'undefined' ? filterValue : this.state.filterValue)});
      SotaDispatcher.dispatch({actionType: 'get-groups'});
    }
    changeFilter(filter) {
      this.setState({filterValue: filter});
      this.refreshData(filter);
    }
    filterAndSortDevices(devices, groups, selectedStatus, selectedSort) {
      devices = devices.filter(function (device) {
        return (selectedStatus === 'All' || selectedStatus === device.status);
      });
      var sortedDevices = [];
      Object.keys(devices).sort(function(a, b) {
        var aName = devices[a].deviceName;
        var bName = devices[b].deviceName;
        if(!_.isUndefined(selectedSort) && selectedSort == 'desc')
          return bName.localeCompare(aName);
        else
          return aName.localeCompare(bName);
      }).forEach(function(key) {
        sortedDevices.push(devices[key]);
      });
            
      _.each(sortedDevices, function(device, index) {
        sortedDevices[index].groupName = null;
        sortedDevices[index].groupUUID = null;
        _.each(groups, function(group) {
          if(group.devicesUUIDs.indexOf(device.uuid) > -1) {
            sortedDevices[index].groupName = group.groupName;
            sortedDevices[index].groupUUID = group.id;
          }
        });
      })
      
      return sortedDevices;
    }
    filterDevicesByGroup(devices, groups, selectedGroup = {name: '', type: '', uuid: ''}) {
      if(selectedGroup.type == 'real') {
        var foundGroup = _.findWhere(groups, {groupName: selectedGroup.name});
        if(!_.isUndefined(foundGroup)) {
          devices = _.filter(devices, function (device) {
            return (foundGroup.devicesUUIDs.indexOf(device.uuid) > -1);
          });
        }
      } else if(selectedGroup.type == 'artificial' && selectedGroup.name == 'ungrouped') {
        var discardedDeviceUUIDs = [];
        _.each(groups, function(group) {
          _.each(group.devicesUUIDs, function(uuid) {
            if(discardedDeviceUUIDs.indexOf(uuid) < 0) {
              devices = _.reject(devices, function(device) {
                return device.uuid == uuid;
              });
              discardedDeviceUUIDs.push(uuid);
            }
          });
        });
      }
      return devices;
    }
    selectStatus(status, e) {
      e.preventDefault();
      var devicesFilteredAndSorted = this.filterAndSortDevices(this.state.searchableDevicesDataNotFilteredOrSorted, this.state.groupsData, status, this.state.selectedSort);
      var devicesFilteredByGroup = this.filterDevicesByGroup(devicesFilteredAndSorted, this.state.groupsData, this.state.selectedGroup);
      this.setState({
        searchableDevicesData: devicesFilteredByGroup,
        searchableDevicesDataNotFilteredByGroup: devicesFilteredAndSorted,
        selectedStatus: status,
        selectedStatusName: jQuery(e.target).text()
      });
    }
    selectSort(sort, e) {
      e.preventDefault();
      var devicesFilteredAndSorted = this.filterAndSortDevices(this.state.searchableDevicesDataNotFilteredOrSorted, this.state.groupsData, this.state.selectedStatus, sort);
      var devicesFilteredByGroup = this.filterDevicesByGroup(devicesFilteredAndSorted, this.state.groupsData, this.state.selectedGroup);
      this.setState({
        searchableDevicesData: devicesFilteredByGroup,
        searchableDevicesDataNotFilteredByGroup: devicesFilteredAndSorted,
        selectedSort: sort
      });
    }
    setContentHeight() {
      var windowHeight = jQuery(window).height();
      this.setState({
        contentHeight: windowHeight - jQuery('.grey-header').offset().top - jQuery('.grey-header').outerHeight()
      });
    }
    openNewDeviceModal() {
      this.setState({isNewDeviceModalShown: true});
    }
    closeNewDeviceModal() {
      this.setState({isNewDeviceModalShown: false});
    }
    openRenameDeviceModal(device) {
      this.setState({
        isRenameDeviceModalShown: true,
        renamedDevice: device
      });
    }
    closeRenameDeviceModal(ifRefreshDevicesList) {
      if(ifRefreshDevicesList)
        SotaDispatcher.dispatch({actionType: 'search-devices-by-regex', regex: this.state.filterValue});
      this.setState({
        isRenameDeviceModalShown: false,
        renamedDevice: null
      });
    }
    openNewSmartGroupModal(groupedDevices) {
      this.setState({
        isNewSmartGroupModalShown: true,
        groupedDevices: groupedDevices
      });
    }
    closeNewSmartGroupModal(ifRefreshGroupsList = false) {
      if(ifRefreshGroupsList)
        SotaDispatcher.dispatch({actionType: 'get-groups'});
      this.setState({
        isNewSmartGroupModalShown: false
      });
    }
    openNewManualGroupModal(deviceUUID = null) {
      this.setState({
        isNewManualGroupModalShown: true,
        newManualGroupSelectedDeviceUUID: deviceUUID
      });
    }
    closeNewManualGroupModal(ifRefreshGroupsList = false) {
      if(ifRefreshGroupsList)
        SotaDispatcher.dispatch({actionType: 'get-groups'});
      this.setState({
        isNewManualGroupModalShown: false,
        newManualGroupSelectedDeviceUUID: null
      });
    }
    openRenameGroupModal(group) {
      this.setState({
        isRenameGroupModalShown: true,
        renamedGroup: group
      });
    }
    closeRenameGroupModal(ifRefreshGroupsList = false) {
      if(ifRefreshGroupsList)
        SotaDispatcher.dispatch({actionType: 'get-groups'});
      this.setState({
        isRenameGroupModalShown: false,
        renamedGroup: null
      });
    }
    showDevicesTooltip(e) {
      e.preventDefault();
      this.setState({isDevicesTooltipShown: true});
    }
    hideDevicesTooltip() {
      this.setState({isDevicesTooltipShown: false});
    }
    selectGroup(groupObj) {
      Cookies.set('selectedGroup', groupObj);
      var devicesFilteredAndSorted = this.filterAndSortDevices(this.state.searchableDevicesDataNotFilteredOrSorted, this.state.groupsData, this.state.selectedStatus, this.state.selectedSort);
      var devicesFilteredByGroup = this.filterDevicesByGroup(devicesFilteredAndSorted, this.state.groupsData, groupObj);
      this.setState({
        selectedGroup: groupObj,
        searchableDevicesData: devicesFilteredByGroup
      });
    }
    setDevicesData() {
      this.setState({devicesData: db.devices.deref()});
    }
    setSearchableDevicesAndGroupsData() {
      var searchableDevices = db.searchableDevices.deref();
      var groups = db.groups.deref();
      if(!_.isUndefined(searchableDevices) && !_.isUndefined(groups)) {
        var searchableDevicesNotFilteredOrSorted = this.filterAndSortDevices(searchableDevices, groups, 'All', 'asc', {name: '', type: '', uuid: ''});
        var searchableDevicesFilteredAndSorted = this.filterAndSortDevices(searchableDevices, groups, this.state.selectedStatus, this.state.selectedSort);
        var searchableDevicesFilteredByGroup = this.filterDevicesByGroup(searchableDevicesFilteredAndSorted, groups, this.state.selectedGroup);
        this.setState({
          searchableDevicesData: searchableDevicesFilteredByGroup,
          searchableDevicesDataNotFilteredByGroup: searchableDevicesFilteredAndSorted,
          searchableDevicesDataNotFilteredOrSorted: searchableDevicesNotFilteredOrSorted,
          groupsData: groups
        });
      }
    }
    setSearchableProductionDevicesData() {
      this.setState({searchableProductionDevicesData: db.searchableProductionDevices.deref()});
    }
    handleDeviceCreated() {
      var deviceCreated = db.deviceCreated.deref();
      if(!_.isUndefined(deviceCreated)) {
        var devices = this.state.devicesData;
        var searchableDevicesDataNotFilteredOrSorted = this.state.searchableDevicesDataNotFilteredOrSorted;
        var selectedStatus = this.state.selectedStatus;
        var selectedSort = this.state.selectedSort;
        devices.push(deviceCreated);
        searchableDevicesDataNotFilteredOrSorted.push(deviceCreated);
        
        var devicesFilteredOrSorted = this.filterAndSortDevices(searchableDevicesDataNotFilteredOrSorted, this.state.groupsData, this.state.selectedStatus, this.state.selectedSort);
        var devicesFilteredByGroup = this.filterDevicesByGroup(devicesFilteredOrSorted, this.state.groupsData, this.state.selectedGroup);
        this.setState({
          devicesData: devices,
          searchableDevicesData: devicesFilteredByGroup,
          searchableDevicesDataNotFilteredByGroup: devicesFilteredOrSorted,
        });
        db.deviceCreated.reset();
      }
    }
    handleDeviceSeen() {
      var deviceSeen = db.deviceSeen.deref();
      if(!_.isUndefined(deviceSeen)) {          
        var searchableDevices = this.state.searchableDevicesData;
        var searchableDevicesNotFilteredByGroup = this.state.searchableDevicesDataNotFilteredByGroup;
        var searchableDevicesNotFilteredOrSorted = this.state.searchableDevicesDataNotFilteredOrSorted;
        _.each(searchableDevices, function(device, index) {
          if(device.uuid === deviceSeen.uuid) {
            searchableDevices[index].lastSeen = deviceSeen.lastSeen;
          }
        });
        _.each(searchableDevicesNotFilteredOrSorted, function(device, index) {
          if(device.uuid === deviceSeen.uuid) {
            searchableDevicesNotFilteredOrSorted[index].lastSeen = deviceSeen.lastSeen;
          }
        });
        _.each(searchableDevicesNotFilteredByGroup, function(device, index) {
          if(device.uuid === deviceSeen.uuid) {
            searchableDevicesNotFilteredByGroup[index].lastSeen = deviceSeen.lastSeen;
          }
        });
        this.setState({
          searchableDevicesData: searchableDevices,
          searchableDevicesDataNotFilteredByGroup: searchableDevicesNotFilteredByGroup,
          searchableDevicesDataNotFilteredOrSorted: searchableDevicesNotFilteredOrSorted
        });  
        db.deviceSeen.reset();
      }
    }
    onDeviceDragStart(e) {
      var deviceUUID = e.currentTarget.dataset.uuid;
      var deviceGroupUUID = e.currentTarget.dataset.groupuuid;
                  
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData("deviceUUID", deviceUUID);
      
      this.setState({
        draggingDevice: {
          uuid: deviceUUID,
          groupUUID: deviceGroupUUID
        }
      });
    }
    onDeviceDragEnd(e) {
      this.setState({
        draggingDevice: null,
        draggingOverGroup: null,
        isDraggingOverButton: false
      });
    }
    onGroupDragOver(group = null) {
      this.setState({draggingOverGroup: group});
    }
    toggleDraggingOverButton(isDragging = false) {
      this.setState({isDraggingOverButton: isDragging});
    }
    render() {
      var tooltipContent = (
        <div className="text-center margin-top-20">
          ATS Garage helps you manage your embedded devices. <br /><br />
          To get started, you'll need to create a device and install the ATS Garage client on it.
        </div>
      );
    
      return (
        <div>
          <DevicesPageHeader 
            deviceCount={!_.isUndefined(this.state.searchableDevicesData) ? Object.keys(this.state.searchableDevicesData).length : undefined}/>
          <div id="home-content" style={{height: this.state.contentHeight}}>
            {!_.isUndefined(this.state.devicesData) && !_.isUndefined(this.state.searchableDevicesData) && !_.isUndefined(this.state.groupsData) ?
              !_.isEmpty(this.state.devicesData) ?
                <div>
                  <GroupsSection 
                    groups={this.state.groupsData}
                    devices={this.state.searchableDevicesDataNotFilteredByGroup}
                    contentHeight={this.state.contentHeight}
                    filterValue={this.state.filterValue}
                    draggingDevice={this.state.draggingDevice}
                    isDraggingOverButton={this.state.isDraggingOverButton}
                    draggingOverGroup={this.state.draggingOverGroup}
                    selectedGroup={this.state.selectedGroup}
                    openNewManualGroupModal={this.openNewManualGroupModal}
                    onGroupDragOver={this.onGroupDragOver}
                    selectGroup={this.selectGroup}
                    toggleDraggingOverButton={this.toggleDraggingOverButton}
                    openRenameGroupModal={this.openRenameGroupModal}/>
                  <DevicesSection 
                    groups={this.state.groupsData}
                    devices={this.state.devicesData}
                    searchableDevices={this.state.searchableDevicesData}
                    productionDevices={this.state.searchableProductionDevicesData}
                    contentHeight={this.state.contentHeight}
                    draggingDeviceUUID={this.state.draggingDeviceUUID}
                    filterValue={this.state.filterValue}
                    selectedStatus={this.state.selectedStatus}
                    selectedStatusName={this.state.selectedStatusName}
                    selectedSort={this.state.selectedSort}
                    selectStatus={this.selectStatus}
                    selectSort={this.selectSort}
                    changeFilter={this.changeFilter}
                    openNewDeviceModal={this.openNewDeviceModal}
                    openRenameDeviceModal={this.openRenameDeviceModal}
                    openNewSmartGroupModal={this.openNewSmartGroupModal}
                    onDeviceDragStart={this.onDeviceDragStart}
                    onDeviceDragEnd={this.onDeviceDragEnd}/>
                </div>
              : 
                <div className="height-100 position-relative text-center">
                  <div className="center-xy padding-15">
                    <div className="font-22 white">You haven't created any devices yet.</div>
                    <div>
                      <button className="btn btn-confirm margin-top-20" onClick={this.openNewDeviceModal}><i className="fa fa-plus"></i> ADD NEW DEVICE</button>
                    </div>
                    <div className="margin-top-10">
                      <a href="#" className="font-18" onClick={this.showDevicesTooltip}>
                        <span className="color-main"><strong>What is this?</strong></span>
                      </a>
                    </div>
                  </div>
                </div>
            : undefined}
            {_.isUndefined(this.state.devicesData) ? 
              <div className="height-100 position-relative text-center">
                <div className="center-xy padding-15">
                  <Loader />
                </div>
              </div>
            : undefined}
          </div>
            
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {this.state.isNewDeviceModalShown ?
              <NewDevice 
                selectedGroup={this.state.selectedGroup}
                closeNewDeviceModal={this.closeNewDeviceModal}/>
            : undefined}
          </VelocityTransitionGroup>
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {this.state.isRenameDeviceModalShown ?
              <RenameDevice 
                device={this.state.renamedDevice}
                closeRenameDeviceModal={this.closeRenameDeviceModal}/>
            : undefined}
          </VelocityTransitionGroup>
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {this.state.isNewSmartGroupModalShown ?
              <NewSmartGroup
                groupedDevices={this.state.groupedDevices}
                closeModal={this.closeNewSmartGroupModal}
                key="create-group"/>
            : null}
          </VelocityTransitionGroup>
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {this.state.isNewManualGroupModalShown ?
              <NewManualGroup
                deviceUUID={this.state.newManualGroupSelectedDeviceUUID}
                closeModal={this.closeNewManualGroupModal}/>
            : undefined}
          </VelocityTransitionGroup>
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {this.state.isRenameGroupModalShown ?
              <RenameGroup
                group={this.state.renamedGroup}
                closeRenameGroupModal={this.closeRenameGroupModal}/>
            : undefined}
          </VelocityTransitionGroup>
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {this.state.isDevicesTooltipShown ?                
              <ModalTooltip 
                title="Devices"
                body={tooltipContent}
                confirmButtonAction={this.hideDevicesTooltip}/>
            : undefined}
          </VelocityTransitionGroup>
        </div>
      );
    }
  };

  return Devices;
});
