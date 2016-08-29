define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      DevicesList = require('es6!./devices-list'),
      DevicesHeader = require('es6!./devices-header'),
      Loader = require('es6!../loader'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group');
  class Devices extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        filterValue: '',
        selectedStatus: 'All',
        selectedStatusName: 'All',
        selectedSort: 'asc',
        selectedSortName: 'A > Z',
        intervalId: null,
        expandedSectionName: 'testDevices',
        packagesCount: 67,
        campaignsCount: 32,
        productionDevicesCount: 0,
        devicesListHeight: '400px',
      };

      this.changeFilter = this.changeFilter.bind(this);
      this.selectStatus = this.selectStatus.bind(this);
      this.selectSort = this.selectSort.bind(this);
      this.refreshData = this.refreshData.bind(this);
      this.setDevicesListHeight = this.setDevicesListHeight.bind(this);

      db.devices.reset();
      db.searchableDevices.reset();
      db.searchableProductionDevices.reset();
      SotaDispatcher.dispatch({actionType: 'get-devices'});
      SotaDispatcher.dispatch({actionType: 'search-devices-by-regex', regex: ''});
      db.devices.addWatch("devices", _.bind(this.forceUpdate, this, null));
      db.searchableDevices.addWatch("searchable-devices", _.bind(this.forceUpdate, this, null));
      db.searchableProductionDevices.addWatch("searchable-production-devices", _.bind(this.forceUpdate, this, null));
    }
    changeFilter(filter) {
      this.setState({filterValue: filter});
    }
    selectStatus(status, e) {
      e.preventDefault();

      var name = jQuery(e.target).text();
      this.setState({
        selectedStatus: status,
        selectedStatusName: name
      });
    }
    selectSort(sort, e) {
      e.preventDefault();

      var name = jQuery(e.target).text();
      this.setState({
        selectedSort: sort,
        selectedSortName: name
      });
    }
    componentDidMount() {
      var that = this;
      var intervalId = setInterval(function() {
        that.refreshData();
      }, 10000);
      this.setState({intervalId: intervalId});
      
      window.addEventListener("resize", this.setDevicesListHeight);
      this.setDevicesListHeight();
    }
    componentWillUnmount(){
      db.devices.reset();
      db.searchableDevices.reset();
      db.devices.removeWatch("devices");
      db.searchableDevices.removeWatch("searchable-devices");
      db.searchableProductionDevices.removeWatch("searchable-production-devices");
      clearInterval(this.state.intervalId);
      window.removeEventListener("resize", this.setDevicesListHeight);
    }
    refreshData() {
      SotaDispatcher.dispatch({actionType: 'get-devices'});
      SotaDispatcher.dispatch({actionType: 'search-devices-by-regex', regex: this.state.filterValue});
      SotaDispatcher.dispatch({actionType: 'search-production-devices', regex: this.state.filterValue});
    }
    expandSection(sectionName, e) {
      this.setState({
        expandedSectionName: (this.state.expandedSectionName == sectionName) ? null : sectionName
      });
    }
    numberWithDots(x) {
      return !_.isUndefined(x) ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : '';
    }
    setDevicesListHeight() {
      var windowHeight = jQuery(window).height();
      var offsetTop = jQuery('#devices-bar').offset().top + jQuery('#devices-bar').height();
      var btnSectionsHeight = jQuery('.btn-full-section').length ? 4 * 34 : 0;
      this.setState({
        devicesListHeight: windowHeight - offsetTop - btnSectionsHeight
      });
    }
    render() {
      var Devices = db.searchableDevices.deref();
      var SortedDevices;
      var selectedStatus = this.state.selectedStatus;
      var selectedSort = this.state.selectedSort;

      var isTutorialShown = (this.props.location.pathname.indexOf('newdevice') > -1 || _.isUndefined(db.devices.deref()) || db.devices.deref().length) ? false : true;
      
      var productionDevicesCount = 0;
      var totalProductionDevicesCount = 15382448;
      if(this.state.filterValue.length >= 17) {
        productionDevicesCount = !_.isUndefined(db.searchableProductionDevices.deref()) ? db.searchableProductionDevices.deref().length : 0;
      } else {
        productionDevicesCount = this.state.filterValue.length > 0 ? this.state.filterValue.length == 16 ? 25 : Math.round(totalProductionDevicesCount / (this.state.filterValue.length * 3499)) : totalProductionDevicesCount;
      }
      
      var areTestSettingsCorrect = localStorage.getItem('firstProductionTestDevice') && localStorage.getItem('firstProductionTestDevice') !== '' && 
                                   localStorage.getItem('secondProductionTestDevice') && localStorage.getItem('secondProductionTestDevice') !== '' && 
                                   localStorage.getItem('thirdProductionTestDevice') && localStorage.getItem('thirdProductionTestDevice') !== '' ? true : false;
      
      if(!_.isUndefined(Devices)) {
        SortedDevices = [];
        Devices = Devices.filter(function (pack) {
          return (selectedStatus === 'All' || selectedStatus === pack.status);
        });
      
        Object.keys(Devices).sort(function(a, b) {
          var aName = Devices[a].deviceName;
          var bName = Devices[b].deviceName;
          if(!_.isUndefined(selectedSort) && selectedSort == 'desc')
            return bName.localeCompare(aName);
          else
            return aName.localeCompare(bName);
        }).forEach(function(key) {
          SortedDevices.push(Devices[key]);
        });
      }
      
      return (
        <div>
          <DevicesHeader
            changeFilter={this.changeFilter}
            filterValue={this.state.filterValue}
            selectedStatus={this.state.selectedStatus}
            selectedStatusName={this.state.selectedStatusName}
            selectedSort={this.state.selectedSort}
            selectedSortName={this.state.selectedSortName}
            selectStatus={this.selectStatus}
            selectSort={this.selectSort}
            isTutorialShown={isTutorialShown}/>
          
          {areTestSettingsCorrect ?
            <button className="btn btn-full-section first" onClick={this.expandSection.bind(this, 'testDevices')}>
              <i className={(this.state.expandedSectionName == 'testDevices') ? "fa fa-chevron-circle-down" : "fa fa-chevron-circle-right"} aria-hidden="true"></i> &nbsp;
              TEST DEVICES &nbsp;
              {!_.isUndefined(SortedDevices) ?
                <span>
                  (
                    {this.numberWithDots(SortedDevices.length)} 
                    {!_.isUndefined(db.devices.deref()) ?
                      <span>
                        &nbsp;out of {this.numberWithDots(db.devices.deref().length)}
                      </span>
                    : null}
                  )
                </span>
              : null}
            </button>
          : null}
          <div style={{paddingTop: !areTestSettingsCorrect ? '40px' : 0}}>
            {_.isUndefined(SortedDevices) ?
              <Loader />
            :
              <VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}} runOnMount={true}>
                {this.state.expandedSectionName == 'testDevices' ? 
                  <div>
                    <div className="devices" style={{height: this.state.devicesListHeight}}>
                      <DevicesList
                        Devices={SortedDevices}
                        areProductionDevices={false}/>
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
                        Devices={db.searchableProductionDevices.deref()}
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
      );
    }
  };

  return Devices;
});
