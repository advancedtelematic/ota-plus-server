define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      ImpactAnalysisHeader = require('es6!./impact-analysis-header'),
      BlacklistedPackagesList = require('es6!./blacklisted-packages-list'),
      ImpactedDevicesList = require('es6!./impacted-devices-list'),
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
      
      SotaDispatcher.dispatch({actionType: 'get-devices'});
      SotaDispatcher.dispatch({actionType: 'get-blacklisted-packages'});
      db.blacklistedPackages.addWatch("poll-blacklisted-packages", _.bind(this.forceUpdate, this, null));
      db.impactAnalysis.addWatch("poll-impact-analysis-page", _.bind(this.forceUpdate, this, null));
      db.devices.addWatch("poll-devices-impact-analysis-page", _.bind(this.forceUpdate, this, null));
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
      db.devices.reset();
      db.blacklistedPackages.reset();
      db.blacklistedPackages.removeWatch("poll-blacklisted-packages");
      db.impactAnalysis.removeWatch("poll-impact-analysis-page");
      db.devices.removeWatch("poll-devices-impact-analysis-page");
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
      var devices = db.devices.deref();
      var impactedDevices = undefined;
      var impactedPackages = undefined;
            
      if(!_.isUndefined(impactAnalysis)) {
          console.log(impactAnalysis);
          
          
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
          
            impactedDevices[deviceUUID] = {
              uuid: deviceUUID,
              deviceName: !_.isUndefined(deviceData) ? deviceData.deviceName : deviceUUID
            };
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
            {!_.isUndefined(impactedPackages) && !_.isEmpty(impactedPackages) ? 
              <BlacklistedPackagesList 
                packages={impactedPackages}
                type="impacted"/>
            : undefined}
            {!_.isUndefined(impactedDevices) && !_.isEmpty(impactedDevices) ?
              <ImpactedDevicesList 
                devices={impactedDevices}/>
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
