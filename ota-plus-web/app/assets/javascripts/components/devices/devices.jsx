define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher')
      ReactCSSTransitionGroup = React.addons.CSSTransitionGroup,
      DevicesList = require('./devices-list'),
      DevicesHeader = require('./devices-header'),
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
      };
      
      this.changeFilter = this.changeFilter.bind(this);
      this.selectStatus = this.selectStatus.bind(this);
      this.selectSort = this.selectSort.bind(this);
      this.refreshData = this.refreshData.bind(this);
      
      SotaDispatcher.dispatch({actionType: 'get-devices'});
      db.devices.addWatch("devices", _.bind(this.forceUpdate, this, null));
      SotaDispatcher.dispatch({actionType: 'search-devices-by-regex', regex: ''});
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
      }, 1000);
      this.setState({intervalId: intervalId});
    }
    componentWillUnmount(){
      db.devices.removeWatch("devices");
      db.searchableDevices.removeWatch("searchable-devices");
      db.searchableProductionDevices.removeWatch("searchable-production-devices");
      clearInterval(this.state.intervalId);
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
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    render() {
      var Devices = db.searchableDevices.deref();
      var SortedDevices = [];
      var selectedStatus = this.state.selectedStatus;
      var selectedSort = this.state.selectedSort;
      
      var productionDevicesCount = 0;
      var totalProductionDevicesCount = 15382448;
      if(this.state.filterValue.length >= 17) {
        productionDevicesCount = db.searchableProductionDevices.deref().length;
      } else {
        productionDevicesCount = this.state.filterValue.length > 0 ? this.state.filterValue.length == 16 ? 25 : Math.round(totalProductionDevicesCount / (this.state.filterValue.length * 3499)) : totalProductionDevicesCount;
      }
      
      Devices = Devices.filter(function (pack) {          
        return (selectedStatus === 'All' || selectedStatus === pack.status);
      });
            
      Object.keys(Devices).sort(function(a, b) {
        var aName = Devices[a].vin;
        var bName = Devices[b].vin;
        if(selectedSort !== 'undefined' && selectedSort == 'desc')
          return bName.localeCompare(aName);
        else
          return aName.localeCompare(bName);
      }).forEach(function(key) {
        SortedDevices.push(Devices[key]);
      });
      
      return (
        <ReactCSSTransitionGroup
          transitionAppear={true}
          transitionLeave={false}
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
          transitionName="example">   
          <DevicesHeader 
            changeFilter={this.changeFilter} 
            filterValue={this.state.filterValue}
            selectedStatus={this.state.selectedStatus}
            selectedStatusName={this.state.selectedStatusName}
            selectedSort={this.state.selectedSort}
            selectedSortName={this.state.selectedSortName}
            selectStatus={this.selectStatus}
            selectSort={this.selectSort}/>
          <button className="btn btn-full-section first" onClick={this.expandSection.bind(this, 'testDevices')}>
            <i className={(this.state.expandedSectionName == 'testDevices') ? "fa fa-chevron-circle-down" : "fa fa-chevron-circle-right"} aria-hidden="true"></i> TEST DEVICES ({this.numberWithDots(SortedDevices.length)} out of {this.numberWithDots(db.devices.deref().length)})
          </button>
          <VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}}>
            {this.state.expandedSectionName == 'testDevices' ? 
              <div>
                <div id="devices">
                  <DevicesList
                    Devices={SortedDevices}
                    areProductionDevices={false}/>
                  {this.props.children}
                </div>
              </div>
            : null}
          </VelocityTransitionGroup>
          <button className="btn btn-full-section" onClick={this.expandSection.bind(this, 'productionDevices')}>
            <i className={(this.state.expandedSectionName == 'productionDevices') ? "fa fa-chevron-circle-down" : "fa fa-chevron-circle-right"} aria-hidden="true"></i> PRODUCTION DEVICES ({this.numberWithDots(productionDevicesCount)} out of {this.numberWithDots(totalProductionDevicesCount)})
          </button>
          <VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}}>
            {this.state.expandedSectionName == 'productionDevices' ? 
              <div>
                <div id="devices">
                  <DevicesList
                    Devices={db.searchableProductionDevices.deref()}
                    areProductionDevices={true}/>
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
        </ReactCSSTransitionGroup>
      );
    }
  };

  return Devices;
});
