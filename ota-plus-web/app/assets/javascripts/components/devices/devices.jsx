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
        selectedGroupCookie = {name: 'all', type: 'artificial'};
      }
            
      this.state = {
        devicesData: undefined,
        searchableDevicesData: undefined,
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
        isNewDeviceModalShown: false,
        isRenameDeviceModalShown: false,
        renamedDevice: null,
        isNewSmartGroupModalShown: false,
        isNewManualGroupModalShown: false,
        isRenameGroupModalShown: false,
        renamedGroup: null,
        groupedDevices: []
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
      this.setListsHeight = this.setListsHeight.bind(this);
      this.filterAndSortDevices = this.filterAndSortDevices.bind(this);
      this.setDevicesData = this.setDevicesData.bind(this);
      this.setSearchableDevicesAndGroupsData = this.setSearchableDevicesAndGroupsData.bind(this);
      this.setSearchableProductionDevicesData = this.setSearchableProductionDevicesData.bind(this);
      this.handleDeviceCreated = this.handleDeviceCreated.bind(this);
      this.handleDeviceSeen = this.handleDeviceSeen.bind(this);

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
      window.addEventListener("resize", this.setListsHeight);
      setTimeout(function() {
        that.setListsHeight();
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
      window.removeEventListener("resize", this.setListsHeight);
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
    filterAndSortDevices(devices, groups, selectedStatus, selectedSort, selectedGroup = {name: '', type: ''}) {        
      if(selectedGroup.type == 'real') {
        var foundGroup = _.findWhere(groups, {groupName: selectedGroup.name});
        if(!_.isUndefined(foundGroup)) {
          devices = _.filter(devices, function (device) {
            return (foundGroup.devicesUUIDs.indexOf(device.uuid) > -1);
          });
        }
      } else if(selectedGroup.type == 'artificial' && selectedGroup.name == 'ungrouped') {
        var discardedDeviceUUIDs = [];
        _.each(this.state.groupsData, function(group) {
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
      return sortedDevices;
    }
    selectStatus(status, e) {
      e.preventDefault();
      this.setState({
        searchableDevicesData: this.filterAndSortDevices(this.state.searchableDevicesDataNotFilteredOrSorted, this.state.groupsData, status, this.state.selectedSort, this.state.selectedGroup),
        selectedStatus: status,
        selectedStatusName: jQuery(e.target).text()
      });
    }
    selectSort(sort, e) {
      e.preventDefault();
      this.setState({
        searchableDevicesData: this.filterAndSortDevices(this.state.searchableDevicesDataNotFilteredOrSorted, this.state.groupsData, this.state.selectedStatus, sort, this.state.selectedGroup),
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
    setListsHeight() {
      var windowHeight = jQuery(window).height();
      var offsetTopGroupsWrapper = jQuery('.groups-wrapper').offset().top;
      var offsetTopGroupsList = jQuery('#groups-list').offset().top;
      var offsetTopDevicesBar = jQuery('#devices-bar').offset().top + jQuery('#devices-bar').height();
      var btnSectionsHeight = jQuery('.btn-full-section').length ? 4 * 34 : 0;
      
      this.setState({
        groupsWrapperHeight: windowHeight - offsetTopGroupsWrapper,
        groupsListHeight: windowHeight - offsetTopGroupsList,
        devicesListHeight: windowHeight - offsetTopDevicesBar - btnSectionsHeight
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
    openNewManualGroupModal() {
      this.setState({isNewManualGroupModalShown: true});
    }
    closeNewManualGroupModal(ifRefreshGroupsList = false) {
      if(ifRefreshGroupsList)
        SotaDispatcher.dispatch({actionType: 'get-groups'});
      this.setState({isNewManualGroupModalShown: false});
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
      var selectedGroup = (_.isEqual(groupObj, this.state.selectedGroup) ? {name: '', type: ''} : groupObj);
      Cookies.set('selectedGroup', selectedGroup);
      this.setState({
        selectedGroup: selectedGroup,
        searchableDevicesData: this.filterAndSortDevices(this.state.searchableDevicesDataNotFilteredOrSorted, this.state.groupsData, this.state.selectedStatus, this.state.selectedSort, selectedGroup)
      });
    }
    setDevicesData() {
      this.setState({devicesData: db.devices.deref()});
    }
    setSearchableDevicesAndGroupsData() {
      var searchableDevices = db.searchableDevices.deref();
      var groups = db.groups.deref();
      if(!_.isUndefined(searchableDevices) && !_.isUndefined(groups)) {
        var searchableDevicesNotFilteredOrSorted = this.filterAndSortDevices(searchableDevices, groups, 'All', 'asc', {name: '', type: ''});
        searchableDevices = this.filterAndSortDevices(searchableDevices, groups, this.state.selectedStatus, this.state.selectedSort, this.state.selectedGroup);
        this.setState({
          searchableDevicesData: searchableDevices,
          groupsData: groups,
          searchableDevicesDataNotFilteredOrSorted: searchableDevicesNotFilteredOrSorted
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
        var searchableDevices = this.state.searchableDevicesData;
        var selectedStatus = this.state.selectedStatus;
        var selectedSort = this.state.selectedSort;
        devices.push(deviceCreated);
        searchableDevices.push(deviceCreated);
        this.setState({
          devicesData: devices,
          searchableDevicesData: this.filterAndSortDevices(searchableDevices, this.state.groupsData, this.state.selectedStatus, this.state.selectedSort, this.state.selectedGroup)
        });
        db.deviceCreated.reset();
      }
    }
    handleDeviceSeen() {
      var deviceSeen = db.deviceSeen.deref();
      if(!_.isUndefined(deviceSeen)) {          
        var searchableDevices = this.state.searchableDevicesData;
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
        this.setState({
          searchableDevicesData: searchableDevices,
          searchableDevicesDataNotFilteredOrSorted: searchableDevicesNotFilteredOrSorted
        });  
        db.deviceSeen.reset();
      }
    }
    render() {
      const devices = this.state.devicesData;
      const searchableDevices = this.state.searchableDevicesData;
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
                    <button type="button" className="btn btn-rect" onClick={this.openNewManualGroupModal}><i className="fa fa-plus"></i> Add new Group</button>
                  </div>
              
                  <div id="groups-list" style={{height: this.state.groupsListHeight}}>
                    <GroupsArtificial
                      selectGroup={this.selectGroup}
                      selectedGroup={this.state.selectedGroup}/>
                  
                    <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
                      {!_.isUndefined(groups) ?
                        groups.length ?
                          <GroupsList 
                            groups={groups}
                            groupsListHeight={this.state.groupsListHeight}
                            selectGroup={this.selectGroup}
                            selectedGroup={this.state.selectedGroup}/>
                        :
                          <span>There are no groups</span>
                      : undefined}
                    </VelocityTransitionGroup>
                    {_.isUndefined(groups) ?
                      <Loader />
                    : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="devices-column">
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
                  {_.isUndefined(searchableDevices) || _.isUndefined(groups) ?
                    <Loader />
                  :
                    <VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}} runOnMount={true}>
                      {this.state.expandedSectionName == 'testDevices' ? 
                        <div>
                          <div className="devices" style={{height: this.state.devicesListHeight}}>
                            <DevicesList
                              devices={searchableDevices}
                              areProductionDevices={false}
                              groups={groups}
                              isDevicesListEmpty={isDevicesListEmpty}
                              openNewDeviceModal={this.openNewDeviceModal}
                              openRenameDeviceModal={this.openRenameDeviceModal}
                              openNewSmartGroupModal={this.openNewSmartGroupModal}
                              openRenameGroupModal={this.openRenameGroupModal}/>
                            {this.props.children}
                          </div>
                        </div>
                      : undefined}
                    </VelocityTransitionGroup>
                  }
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
