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
        intervalId: null,
        impactedDevicesListHeight: '400px',
        isImpactTooltipShown: false
      };
      this.showImpactTooltip = this.showImpactTooltip.bind(this);
      this.hideImpactTooltip = this.hideImpactTooltip.bind(this);
      this.setImpactedDevicesListHeight = this.setImpactedDevicesListHeight.bind(this);
      
      SotaDispatcher.dispatch({actionType: 'search-devices-by-regex', regex: ''});
      SotaDispatcher.dispatch({actionType: 'get-blacklisted-packages'});
      SotaDispatcher.dispatch({actionType: 'get-groups'});
      db.blacklistedPackages.addWatch("poll-blacklisted-packages", _.bind(this.forceUpdate, this, null));
      db.impactAnalysis.addWatch("poll-impact-analysis-page", _.bind(this.forceUpdate, this, null));
      db.searchableDevices.addWatch("poll-devices-impact-analysis-page", _.bind(this.forceUpdate, this, null));
      db.groups.addWatch("groups-impact-analysis-page", _.bind(this.forceUpdate, this, null));
    }
    componentDidMount() {
      var that = this;
      window.addEventListener("resize", this.setImpactedDevicesListHeight);
      setTimeout(function() {
        that.setImpactedDevicesListHeight();
      }, 1);
      
      var intervalId = setInterval(function() {
        SotaDispatcher.dispatch({actionType: 'get-blacklisted-packages'});
      }, 1000);
      this.setState({
        intervalId: intervalId
      });
    }
    componentWillUnmount(){
      clearInterval(this.state.intervalId);
      db.searchableDevices.reset();
      db.blacklistedPackages.reset();
      db.groups.reset();
      db.blacklistedPackages.removeWatch("poll-blacklisted-packages");
      db.impactAnalysis.removeWatch("poll-impact-analysis-page");
      db.searchableDevices.removeWatch("poll-devices-impact-analysis-page");
      db.groups.removeWatch("groups-impact-analysis-page");
      window.removeEventListener("resize", this.setImpactedDevicesListHeight);
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
    render() {
      var impactAnalysis = db.impactAnalysis.deref();
      var devices = db.searchableDevices.deref();
      var impactedDevices = undefined;
      var impactedPackages = undefined;
            
      if(!_.isUndefined(impactAnalysis) && !_.isUndefined(devices)) {
        impactedDevices = {};
        impactedPackages = {};
                        
        _.each(impactAnalysis, function(impact, deviceUUID) {
          _.each(impact, function(pack) {
            impactedPackages[pack.name + '-' + pack.version] = {
              packageId: {
                name: pack.name,
                version: pack.version
              }
            }
            var deviceData = _.findWhere(devices, {uuid: deviceUUID});
          
            impactedDevices[deviceUUID] = deviceData;
          });          
        });
      }
            
      return (
        <div className="impact-analysis">
          <ImpactAnalysisHeader 
            impactedDevices={impactedDevices}/>
          <div id="impacted-devices-list" style={{height: this.state.impactedDevicesListHeight}}>
            <BlacklistedPackagesList 
              packages={db.blacklistedPackages.deref()}
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
                  groups={db.groups.deref()}
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
