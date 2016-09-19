define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      ImpactAnalysisHeader = require('es6!./impact-analysis-header'),
      BlacklistedPackagesList = require('es6!./blacklisted-packages-list'),
      ImpactedDevicesList = require('es6!./impacted-devices-list');
  
  class ImpactAnalysisPage extends React.Component {
    constructor(props) {
      super(props);
      
      this.state = {
        intervalId: null,
        impactedDevicesListHeight: '400px'
      };
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
      window.removeEventListener("resize", this.setDevicesListHeight);
    }
    setImpactedDevicesListHeight() {
      var windowHeight = jQuery(window).height();
      var offsetTop = jQuery('#impacted-devices-list').offset().top
      this.setState({
        impactedDevicesListHeight: windowHeight - offsetTop
      });
    }
    render() {
      var impactAnalysis = db.impactAnalysis.deref();
      var devices = db.devices.deref();
      var impactedDevices = undefined;
      var impactedPackages = undefined;
            
      if(!_.isUndefined(impactAnalysis)) {
        impactedDevices = {};
        impactedPackages = {};
                        
        _.each(impactAnalysis, function(impact) {
          _.each(impact, function(pack, deviceUUID) {
            impactedPackages[pack.name + '-' + pack.version] = {
              packageId: {
                name: pack.name,
                version: pack.version
              }
            }
            var deviceData = _.findWhere(devices, {id: deviceUUID});
          
            impactedDevices[deviceUUID] = {
              id: deviceUUID,
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
              packages={db.blacklistedPackages.deref()}/>
            <BlacklistedPackagesList 
              packages={impactedPackages}
              type="impacted"/>
            <ImpactedDevicesList 
              Devices={impactedDevices} />
          </div>
        </div>
      );
    }
  };

  return ImpactAnalysisPage;
});
