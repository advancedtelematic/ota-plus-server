define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      Cookies = require('js-cookie'),
      DevicesList = require('es6!./devices-list'),
      DevicesHeader = require('es6!./devices-header'),
      GroupsArtificial = require('es6!../groups/groups-artificial'),
      GroupsList = require('es6!../groups/groups-list'),
      NewDevice = require('es6!./new-device'),
      RenameDevice = require('es6!./rename-device'),
      NewSmartGroup = require('es6!../groups/new-smart-group'),
      NewManualGroup = require('es6!../groups/new-manual-group'),
      NewManualGroupButton = require('es6!../groups/new-manual-group-button'),
      RenameGroup = require('es6!../groups/rename-group'),
      Loader = require('es6!../loader'),
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
        expandedSectionName: 'testDevices',
        packagesCount: 67,
        campaignsCount: 32,
        productionDevicesCount: 0,
        groupsWrapperHeight: '400px',
        groupsListHeight: '400px',
        devicesListHeight: '400px',
        devicesColumnWidth: '930px',
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
        isDraggingOverButton: false
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
      this.selectGroup = this.selectGroup.bind(this);
      this.changeFilter = this.changeFilter.bind(this);
      this.selectStatus = this.selectStatus.bind(this);
      this.selectSort = this.selectSort.bind(this);
      this.refreshData = this.refreshData.bind(this);
      this.setElementsSize = this.setElementsSize.bind(this);
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
      window.addEventListener("resize", this.setElementsSize);
      setTimeout(function() {
        that.setElementsSize();
      }, 1);
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
      window.removeEventListener("resize", this.setElementsSize);
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
    expandSection(sectionName, e) {
      this.setState({
        expandedSectionName: (this.state.expandedSectionName == sectionName) ? null : sectionName
      });
    }
    numberWithDots(x) {
      return !_.isUndefined(x) ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : '';
    }
    setElementsSize() {
      var windowWidth = jQuery(window).width();
      var windowHeight = jQuery(window).height();
      var offsetTopGroupsWrapper = jQuery('.groups-wrapper').offset().top;
      var offsetTopGroupsList = jQuery('#groups-list').offset().top;
      var offsetTopDevicesBar = jQuery('#devices-bar').offset().top + jQuery('#devices-bar').height();
      var btnSectionsHeight = jQuery('.btn-full-section').length ? 4 * 34 : 0;
      var groupsColumnWidth = jQuery('#groups-column').width();
      
      this.setState({
        groupsWrapperHeight: windowHeight - offsetTopGroupsWrapper,
        groupsListHeight: windowHeight - offsetTopGroupsList,
        devicesListHeight: windowHeight - offsetTopDevicesBar - btnSectionsHeight,
        devicesColumnWidth: windowWidth - groupsColumnWidth
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
      const devices = this.state.devicesData;
      const searchableDevices = this.state.searchableDevicesData;
      const searchableDevicesDataNotFilteredByGroup = this.state.searchableDevicesDataNotFilteredByGroup;
      const searchableProductionDevices = this.state.searchableProductionDevicesData;
      const groups = this.state.groupsData;
                           
      var isDevicesListEmpty = (_.isUndefined(devices) || devices.length) ? false : true;
      
      var productionDevicesCount = 0;
      var totalProductionDevicesCount = 15382448;
      if(this.state.filterValue.length >= 17) {
        productionDevicesCount = !_.isUndefined(searchableProductionDevices) ? searchableProductionDevices.length : 0;
      } else {
        productionDevicesCount = this.state.filterValue.length > 0 ? this.state.filterValue.length == 16 ? 25 : Math.round(totalProductionDevicesCount / (this.state.filterValue.length * 3499)) : totalProductionDevicesCount;
      }
      
      var areTestSettingsCorrect = localStorage.getItem('firstProductionTestDevice') && localStorage.getItem('firstProductionTestDevice') !== '' && 
                                   localStorage.getItem('secondProductionTestDevice') && localStorage.getItem('secondProductionTestDevice') !== '' && 
                                   localStorage.getItem('thirdProductionTestDevice') && localStorage.getItem('thirdProductionTestDevice') !== '' ? true : false;
      return (
        <div>
          <div id="groups-column">
            <div className="panel panel-ats">
              <div className="panel-heading">
                <div className="panel-heading-left pull-left">
                  Groups
                </div>
              </div>
              <div className="panel-body">
                <div className="groups-wrapper" style={{height: this.state.groupsWrapperHeight}}>
                  <div className="add-group-btn-wrapper">
                    <NewManualGroupButton
                      draggingDevice={this.state.draggingDevice}
                      isDraggingOverButton={this.state.isDraggingOverButton}
                      toggleDraggingOverButton={this.toggleDraggingOverButton}
                      openNewManualGroupModal={this.openNewManualGroupModal}/>
                  </div>
              
                  <div id="groups-list" style={{height: this.state.groupsListHeight}}>
                    <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
                      {!_.isUndefined(groups) && !_.isUndefined(searchableDevicesDataNotFilteredByGroup) ?
                        <div>
                          <GroupsArtificial
                            groups={groups}
                            devices={searchableDevicesDataNotFilteredByGroup}
                            selectGroup={this.selectGroup}
                            selectedGroup={this.state.selectedGroup}
                            draggingDevice={this.state.draggingDevice}
                            draggingOverGroup={this.state.draggingOverGroup}
                            onGroupDragOver={this.onGroupDragOver}
                            isDraggingOverButton={this.state.isDraggingOverButton}/>
                          {groups.length ?
                            <GroupsList 
                              groups={groups}
                              devices={searchableDevicesDataNotFilteredByGroup}
                              isFiltered={this.state.filterValue != ''}
                              groupsListHeight={this.state.groupsListHeight}
                              selectGroup={this.selectGroup}
                              selectedGroup={this.state.selectedGroup}
                              openRenameGroupModal={this.openRenameGroupModal}
                              draggingDevice={this.state.draggingDevice}
                              draggingOverGroup={this.state.draggingOverGroup}
                              onGroupDragOver={this.onGroupDragOver}
                              isDraggingOverButton={this.state.isDraggingOverButton}/>
                          :
                            <span>There are no groups</span>
                          }
                        </div>
                      : undefined}
                    </VelocityTransitionGroup>
                    {_.isUndefined(groups) || _.isUndefined(searchableDevicesDataNotFilteredByGroup) ?
                      <Loader />
                    : undefined}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="devices-column" style={{width: this.state.devicesColumnWidth}}>
            <div className="panel panel-ats">
              <div className="panel-heading">
                <div className="panel-heading-left pull-left">
                  Devices
                </div>
              </div>
              <div className="panel-body">
                <DevicesHeader
                  changeFilter={this.changeFilter}
                  filterValue={this.state.filterValue}
                  selectedStatus={this.state.selectedStatus}
                  selectedStatusName={this.state.selectedStatusName}
                  selectedSort={this.state.selectedSort}
                  selectStatus={this.selectStatus}
                  selectSort={this.selectSort}
                  isDevicesListEmpty={isDevicesListEmpty}/>
          
                {areTestSettingsCorrect ?
                  <button className="btn btn-full-section first" onClick={this.expandSection.bind(this, 'testDevices')}>
                    <i className={(this.state.expandedSectionName == 'testDevices') ? "fa fa-chevron-circle-down" : "fa fa-chevron-circle-right"} aria-hidden="true"></i> &nbsp;
                    TEST DEVICES &nbsp;
                    {!_.isUndefined(searchableDevices) ?
                      <span>
                        (
                          {this.numberWithDots(searchableDevices.length)} 
                          {!_.isUndefined(devices) ?
                            <span>
                              &nbsp;out of {this.numberWithDots(devices.length)}
                            </span>
                          : null}
                        )
                      </span>
                    : null}
                  </button>
                : null}
                <div style={{paddingTop: !areTestSettingsCorrect ? '40px' : 0}}>
                  {!_.isUndefined(searchableDevices) && !_.isUndefined(groups) ?
                    <VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}} runOnMount={true}>
                      {this.state.expandedSectionName == 'testDevices' ? 
                        <div>
                          <div className="devices" style={{height: this.state.devicesListHeight}}>
                            <DevicesList
                              devices={searchableDevices}
                              areProductionDevices={false}
                              isDevicesListEmpty={isDevicesListEmpty}
                              openNewDeviceModal={this.openNewDeviceModal}
                              openRenameDeviceModal={this.openRenameDeviceModal}
                              openNewSmartGroupModal={this.openNewSmartGroupModal}
                              draggingDeviceUUID={this.state.draggingDeviceUUID}
                              onDeviceDragStart={this.onDeviceDragStart}
                              onDeviceDragEnd={this.onDeviceDragEnd}/>
                            {this.props.children}
                          </div>
                        </div>
                      : undefined}
                    </VelocityTransitionGroup>
                  : undefined}
                  {_.isUndefined(searchableDevices) || _.isUndefined(groups) ?
                    <Loader className="white"/>
                  : undefined}
                </div>
                {areTestSettingsCorrect ?
                  <div>
                    <button className="btn btn-full-section" onClick={this.expandSection.bind(this, 'productionDevices')}>
                      <i className={(this.state.expandedSectionName == 'productionDevices') ? "fa fa-chevron-circle-down" : "fa fa-chevron-circle-right"} aria-hidden="true"></i> PRODUCTION DEVICES ({this.numberWithDots(productionDevicesCount)} out of {this.numberWithDots(totalProductionDevicesCount)})
                    </button>
                    <VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}}>
                      {this.state.expandedSectionName == 'productionDevices' ?
                        <div>
                          <div className="devices" style={{height: this.state.devicesListHeight}}>
                            <DevicesList
                              devices={searchableProductionDevices}
                              areProductionDevices={true}
                              productionDeviceName={this.state.filterValue}/>
                            {this.props.children}
                          </div>
                        </div>
                      : null}
                    </VelocityTransitionGroup>

                    <button className="btn btn-full-section" onClick={this.expandSection.bind(this, 'packages')}>
                      <i className={(this.state.expandedSectionName == 'packages') ? "fa fa-chevron-circle-down" : "fa fa-chevron-circle-right"} aria-hidden="true"></i> PACKAGES ({this.state.filterValue.length  == 0 ? this.numberWithDots(this.state.packagesCount) : this.state.filterValue.length == 1 ? 1 : this.state.filterValue.length == 2 ? 0 : 0} out of {this.numberWithDots(this.state.packagesCount)})
                    </button>
                    {this.state.expandedSectionName == 'packages' ?
                      <div></div>
                    : null}

                    <button className="btn btn-full-section" onClick={this.expandSection.bind(this, 'campaigns')}>
                      <i className={(this.state.expandedSectionName == 'campaigns') ? "fa fa-chevron-circle-down" : "fa fa-chevron-circle-right"} aria-hidden="true"></i> CAMPAIGNS ({this.state.filterValue.length  == 0 ? this.numberWithDots(this.state.campaignsCount) : this.state.filterValue.length == 1 ? 1 : this.state.filterValue.length == 2 ? 0 : 0} out of {this.numberWithDots(this.state.campaignsCount)})
                    </button>
                    {this.state.expandedSectionName == 'campaigns' ?
                      <div></div>
                    : null}
                  </div>
                : null}
              </div>
            </div>
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
        </div>
      );
    }
  };

  return Devices;
});
