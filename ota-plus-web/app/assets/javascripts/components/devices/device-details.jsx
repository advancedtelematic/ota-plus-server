define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      DetailsHeader = require('es6!./details-header'),
      PackagesQueue = require('es6!../packages/queue'),
      Packages = require('es6!../packages/packages'),
      TutorialInstallDevice = require('es6!../tutorial/install-device'),
      Components = require('es6!../components/components'),
      AddPackage = require('es6!../packages/add-package'),
      BlacklistForm = require('es6!../packages/blacklist-form'),
      Loader = require('es6!../loader'),
      VelocityUI = require('velocity-ui'),
      VelocityHelpers = require('mixins/velocity/velocity-helpers'),
      VelocityComponent = require('mixins/velocity/velocity-component'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group');

  class DeviceDetails extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.state = {
        deviceData: undefined,
        filterValue: '',
        isPackagesHistoryShown: false,
        textPackagesHistory: context.strings.viewhistory,
        installedPackagesCount: 0,
        queuedPackagesCount: 0,
        queueCount: 0,
        timeoutIntervalId: null,
        duplicatingInProgress: (this.props.params.action == 'synchronising' && this.props.params.vin2) ? true : false,
        duplicatingTimeout: 2000,
        selectedImpactAnalysisPackagesCount: 0,
        files: null,
        isFormShown: false,
        blacklistedPackageName: null,
        blacklistedPackageVersion: null,
        blacklistMode: null,
        isBlacklistFormShown: false,
      }
      this.setDeviceData = this.setDeviceData.bind(this);
      this.toggleQueueHistory = this.toggleQueueHistory.bind(this);
      this.reviewFailedInstall = this.reviewFailedInstall.bind(this);
      this.setPackagesStatistics = this.setPackagesStatistics.bind(this);
      this.setQueueStatistics = this.setQueueStatistics.bind(this);
      this.openForm = this.openForm.bind(this);
      this.closeForm = this.closeForm.bind(this);
      this.onDrop = this.onDrop.bind(this);
      this.showBlacklistForm = this.showBlacklistForm.bind(this);
      this.closeBlacklistForm = this.closeBlacklistForm.bind(this);
      this.changeFilter = this.changeFilter.bind(this);
      this.handleDeviceSeen = this.handleDeviceSeen.bind(this);

      db.device.reset();
      SotaDispatcher.dispatch({actionType: 'get-device', uuid: this.props.params.id});
      db.device.addWatch("poll-device", _.bind(this.setDeviceData, this, null));
      db.deviceSeen.addWatch("poll-deviceseen", _.bind(this.handleDeviceSeen, this, null));
    }
    componentDidMount() {
      var that = this;

      if(this.state.duplicatingInProgress) {
        var that = this;
        var timeoutIntervalId = setTimeout(function() {
          that.setState({
            duplicatingInProgress: false,
          });
        }, 10000);
        this.setState({
          timeoutIntervalId: timeoutIntervalId
        });
      }
    }
    componentWillUpdate(nextProps, nextState, nextContext) {
      if(nextContext.strings != this.context.strings) {
        this.setState({
          textPackagesHistory: nextState.isPackagesHistoryShown ? nextContext.strings.hidehistory : nextContext.strings.viewhistory
        });
      }
    }
    componentWillUnmount() {
      db.device.reset();
      db.device.removeWatch("poll-device");
      db.deviceSeen.removeWatch("poll-deviceseen");
      clearTimeout(this.state.timeoutIntervalId);
    }
    setDeviceData() {
      if(!_.isUndefined(db.device.deref())) {
        this.setState({deviceData: db.device.deref()});
      }
    }
    toggleQueueHistory() {
      this.setState({
        isPackagesHistoryShown: !this.state.isPackagesHistoryShown,
        textPackagesHistory: (this.state.isPackagesHistoryShown) ? this.context.strings.viewhistory : this.context.strings.hidehistory,
      });
    }
    reviewFailedInstall() {
      this.setState({
        isPackagesHistoryShown: true,
        textPackagesHistory: this.context.strings.hidehistory,
      });
    }
    setPackagesStatistics(installed, queued) {
      this.setState({
        installedPackagesCount: installed,
        queuedPackagesCount: queued,
      });
    }
    setQueueStatistics(queued) {
      this.setState({
        queueCount: queued,
      });
    }
    openForm() {
      this.setState({
        isFormShown: true
      });
    }
    closeForm() {
      this.setState({
        isFormShown: false
      });
    }
    onDrop(files) {
      this.setState({
        files: files,
      });
      
      this.openForm();
    }
    showBlacklistForm(packageName, packageVersion, mode) {
      this.setState({
        isBlacklistFormShown: true,
        blacklistedPackageName: packageName,
        blacklistedPackageVersion: packageVersion,
        blacklistMode: mode
      });
    }
    closeBlacklistForm(ifRefreshData = false) {
      if(ifRefreshData) {
        var that = this;
        setTimeout(function() {
          SotaDispatcher.dispatch({actionType: 'search-packages-by-regex', regex: that.state.filterValue});
          SotaDispatcher.dispatch({actionType: 'get-device', uuid: that.props.params.id});
          SotaDispatcher.dispatch({actionType: "get-package-queue-for-device", device: that.props.params.id});
          SotaDispatcher.dispatch({actionType: 'get-blacklisted-packages'});
          SotaDispatcher.dispatch({actionType: 'impact-analysis'});
        }, 1);
      }
      this.setState({
        isBlacklistFormShown: false,
        blacklistedPackageName: null,
        blacklistedPackageVersion: null
      });
    }
    changeFilter(filter) {
      this.setState({filterValue: filter});
    }
    handleDeviceSeen() {
      var deviceSeen = db.deviceSeen.deref();
      if(!_.isUndefined(deviceSeen) && this.props.params.id === deviceSeen.uuid) {
        SotaDispatcher.dispatch({actionType: 'get-device', uuid: this.props.params.id});
        var device = this.state.deviceData;
        device.lastSeen = deviceSeen.lastSeen;
        this.setState({
          deviceData: device
        });
      }
    }
    render() {
      const deviceWithStatus = this.state.deviceData;

      function animateLeftPosition(left) {
        return VelocityHelpers.registerEffect({
          defaultDuration: 100,
          calls: [
            [{
              left: left,
            }]
          ],
        });
      }
      return (
        <div>
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {this.state.duplicatingInProgress ?
              <div className="grey-overlay">
                <p><img src='/assets/img/icons/loading.gif' alt=''/></p>
                <div>applying configuration from</div>
                <div>{this.props.params.vin2}</div>
              </div>
            : null}
          </VelocityTransitionGroup>
          <div className="device-header">
            <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
              {!_.isUndefined(deviceWithStatus) ? 
                <DetailsHeader
                  device={deviceWithStatus}
                  duplicatingInProgress={this.state.duplicatingInProgress}/>
              : undefined}
            </VelocityTransitionGroup>
            {_.isUndefined(deviceWithStatus) ? 
              <Loader />
            : undefined}
          </div>
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {!_.isUndefined(deviceWithStatus) && deviceWithStatus.status != "NotSeen" ?
              <div>
                <div id="components-column">
                  <div className="panel panel-ats">
                    <div className="panel-heading" id="panel-heading-components">
                      <div className="panel-heading-left pull-left">
                        Components
                      </div>
                    </div>
                    <div className="panel-body">
                      <Components deviceId={deviceWithStatus.uuid}/>
                    </div>
                  </div>
                </div>
                <div id="packages-column">
                  <div className="panel panel-ats">
                    <div className="panel-heading">
                      <div className="panel-heading-left pull-left">
                        {this.context.strings.packages}
                      </div>
                    </div>
                    <div className="panel-body">
                      <Packages
                        device={deviceWithStatus}
                        setPackagesStatistics={this.setPackagesStatistics}
                        openForm={this.openForm}
                        onDrop={this.onDrop}
                        showBlacklistForm={this.showBlacklistForm}
                        filterValue={this.state.filterValue}
                        changeFilter={this.changeFilter}
                        hasBetaAccess={this.props.hasBetaAccess}/>
                    </div>
                    <div className="panel-footer" style={{position: 'relative'}}>
                      <VelocityComponent animation={this.state.selectedImpactAnalysisPackagesCount ? animateLeftPosition('15px') : animateLeftPosition('-250px')}>
                        <Link to={`devicedetails/${this.props.params.id}/impactanalysis/${this.state.selectedImpactAnalysisPackagesCount}`} className="btn btn-black btn-impact-analysis pull-left">
                          Impact analysis
                        </Link>
                      </VelocityComponent>
                      <VelocityComponent animation={this.state.selectedImpactAnalysisPackagesCount ? animateLeftPosition('140px') : animateLeftPosition('15px')}>
                        <span className="packages-statistics">
                          {this.state.installedPackagesCount} installed, &nbsp;
                          {this.state.queuedPackagesCount} queued
                        </span>
                     </VelocityComponent>
                    </div>
                  </div>
                </div>
                <div id="queue-column">
                  <div className="panel panel-ats">
                    <div className="panel-heading">
                      <div className="panel-heading-left pull-left">
                        {this.context.strings.queue}
                      </div>
                    </div>
                    <div className="panel-body">
                      <PackagesQueue
                        deviceId={this.props.params.id}
                        textPackagesHistory={this.state.textPackagesHistory}
                        isPackagesHistoryShown={this.state.isPackagesHistoryShown}
                        toggleQueueHistory={this.toggleQueueHistory}
                        reviewFailedInstall={this.reviewFailedInstall}
                        setQueueStatistics={this.setQueueStatistics}
                        device={deviceWithStatus}/>
                    </div>
                    <div className="panel-footer">
                      {this.state.queueCount} packages in queue
                    </div>
                  </div>
                </div>
                <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
                  {this.state.isFormShown ?
                    <AddPackage
                      files={this.state.files}
                      closeForm={this.closeForm}
                      key="add-package"/>
                  : null}
                </VelocityTransitionGroup>
                <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
                  {this.state.isBlacklistFormShown ?
                    <BlacklistForm
                      mode={this.state.blacklistMode}
                      packageName={this.state.blacklistedPackageName}
                      packageVersion={this.state.blacklistedPackageVersion}
                      closeForm={this.closeBlacklistForm}/>
                  : undefined}
                </VelocityTransitionGroup>
                {this.props.children}
              </div>
            : undefined}
          </VelocityTransitionGroup>
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {!_.isUndefined(deviceWithStatus) && deviceWithStatus.status == "NotSeen" ?
              <TutorialInstallDevice deviceUUID={deviceWithStatus.uuid}/>
            : null}
          </VelocityTransitionGroup>
        </div>
      );
    }
  };

  DeviceDetails.contextTypes = {
    strings: React.PropTypes.object.isRequired
  };

  return DeviceDetails;
});
