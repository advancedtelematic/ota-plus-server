define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      Loader = require('es6!../loader'),
      ImpactAnalysisHeader = require('es6!./impact-analysis-header'),
      BlacklistedPackagesList = require('es6!./blacklisted-packages-list'),
      DevicesList = require('es6!./../devices/devices-list'),
      ImpactTooltip = require('es6!./impact-tooltip');
  
  class ImpactAnalysisPage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        blacklistedPackagesData: undefined,
        searchableDevicesData: undefined,
        groupsData: undefined,
        impactAnalysisData: undefined,
        impactedDevicesListHeight: '400px',
        isImpactTooltipShown: false
      };
      this.setBlacklistedPackagesData = this.setBlacklistedPackagesData.bind(this);
      this.setSearchableDevicesData = this.setSearchableDevicesData.bind(this);
      this.setGroupsData = this.setGroupsData.bind(this);
      this.setImpactAnalysisData = this.setImpactAnalysisData.bind(this);
      this.showImpactTooltip = this.showImpactTooltip.bind(this);
      this.hideImpactTooltip = this.hideImpactTooltip.bind(this);
      this.setImpactedDevicesListHeight = this.setImpactedDevicesListHeight.bind(this);
      this.handleDeviceCreated = this.handleDeviceCreated.bind(this);
      this.handlePackageBlacklisted = this.handlePackageBlacklisted.bind(this);
      
      SotaDispatcher.dispatch({actionType: 'search-devices-by-regex', regex: ''});
      SotaDispatcher.dispatch({actionType: 'get-blacklisted-packages'});
      SotaDispatcher.dispatch({actionType: 'get-groups'});
      SotaDispatcher.dispatch({actionType: 'impact-analysis'});
      db.blacklistedPackages.addWatch("poll-blacklisted-packages", _.bind(this.setBlacklistedPackagesData, this, null));
      db.searchableDevices.addWatch("poll-devices-impact-analysis-page", _.bind(this.setSearchableDevicesData, this, null));
      db.groups.addWatch("groups-impact-analysis-page", _.bind(this.setGroupsData, this, null));
      db.impactAnalysis.addWatch("poll-impact-analysis-page", _.bind(this.setImpactAnalysisData, this, null));
      db.deviceCreated.addWatch("poll-device-created-impact-analysis-page", _.bind(this.handleDeviceCreated, this, null));
      db.packageBlacklisted.addWatch("poll-package-blacklisted-impact-analysis-page", _.bind(this.handlePackageBlacklisted, this, null));
    }
    componentDidMount() {
      var that = this;
      window.addEventListener("resize", this.setImpactedDevicesListHeight);
      setTimeout(function() {
        that.setImpactedDevicesListHeight();
      }, 1);
    }
    componentWillUnmount(){
      db.searchableDevices.reset();
      db.blacklistedPackages.reset();
      db.groups.reset();
      db.blacklistedPackages.removeWatch("poll-blacklisted-packages");
      db.impactAnalysis.removeWatch("poll-impact-analysis-page");
      db.searchableDevices.removeWatch("poll-devices-impact-analysis-page");
      db.groups.removeWatch("groups-impact-analysis-page");
      db.deviceCreated.removeWatch("poll-device-created-impact-analysis-page");
      db.packageBlacklisted.removeWatch("poll-package-blacklisted-impact-analysis-page");
      window.removeEventListener("resize", this.setImpactedDevicesListHeight);
    }
    setBlacklistedPackagesData() {
      this.setState({blacklistedPackagesData: db.blacklistedPackages.deref()});
    }
    setSearchableDevicesData() {
      this.setState({searchableDevicesData: db.searchableDevices.deref()});
    }
    setGroupsData() {
      this.setState({groupsData: db.groups.deref()});
    }
    setImpactAnalysisData() {
      this.setState({impactAnalysisData: db.impactAnalysis.deref()});
    }
    setImpactedDevicesListHeight() {
      var windowHeight = jQuery(window).height();
      var offsetTop = jQuery('#impacted-devices-list').offset().top
      this.setState({
        impactedDevicesListHeight: windowHeight - offsetTop
      });
    }
    showImpactTooltip() {
      this.setState({isImpactTooltipShown: true});
    }
    hideImpactTooltip() {
      this.setState({isImpactTooltipShown: false});
    }
    handleDeviceCreated() {
      var deviceCreated = db.deviceCreated.deref();
      if(!_.isUndefined(deviceCreated)) {
        SotaDispatcher.dispatch({actionType: 'search-devices-by-regex', regex: ''});
        SotaDispatcher.dispatch({actionType: 'get-groups'});
      }
    }
    handlePackageBlacklisted() {
      var packageBlacklisted = db.packageBlacklisted.deref();
      if(!_.isUndefined(packageBlacklisted)) {
        SotaDispatcher.dispatch({actionType: 'get-blacklisted-packages'});
      }  
    }
    render() {
      var impactedDevices = undefined;
      var impactedPackages = undefined;
            
      if(!_.isUndefined(this.state.impactAnalysisData) && !_.isUndefined(this.state.searchableDevicesData)) {
        impactedDevices = {};
        impactedPackages = {};
                        
        _.each(this.state.impactAnalysisData, function(impact, deviceUUID) {
          _.each(impact, function(pack) {
            impactedPackages[pack.name + '-' + pack.version] = {
              packageId: {
                name: pack.name,
                version: pack.version
              }
            }
            var deviceData = _.findWhere(this.state.searchableDevicesData, {uuid: deviceUUID});
          
            impactedDevices[deviceUUID] = deviceData;
          }, this);          
        }, this);
      }
            
      return (
        <div className="impact-analysis">
          <ImpactAnalysisHeader 
            impactedDevices={impactedDevices}/>
          <div id="impacted-devices-list" style={{height: this.state.impactedDevicesListHeight}}>
            <BlacklistedPackagesList 
              packages={this.state.blacklistedPackagesData}
              showImpactTooltip={this.showImpactTooltip}/>
            <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
              {!_.isUndefined(impactedPackages) && !_.isEmpty(impactedPackages) ? 
                <BlacklistedPackagesList 
                  packages={impactedPackages}
                  type="impacted"/>
              : undefined}
            </VelocityTransitionGroup>
            <VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}}>
              {!_.isUndefined(impactedDevices) && !_.isEmpty(impactedDevices) ?
                <DevicesList
                  devices={impactedDevices}
                  groups={this.state.groupsData}
                  areProductionDevices={false}
                  isDND={false}
                  areActionButtonsShown={false}/>
              : undefined}
            </VelocityTransitionGroup>
            {_.isUndefined(impactedPackages) || _.isUndefined(impactedDevices) ?
              <Loader />
            : undefined}
            <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
              {this.state.isImpactTooltipShown ?
                <ImpactTooltip 
                  hideImpactTooltip={this.hideImpactTooltip}/>
              : undefined}
            </VelocityTransitionGroup>
          </div>
        </div>
      );
    }
  };

  return ImpactAnalysisPage;
});
