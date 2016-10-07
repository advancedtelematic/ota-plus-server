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
        filterValue: '',
        isPackagesHistoryShown: false,
        textPackagesHistory: context.strings.viewhistory,
        installedPackagesCount: 0,
        queuedPackagesCount: 0,
        queueCount: 0,
        intervalId: null,
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
      this.toggleQueueHistory = this.toggleQueueHistory.bind(this);
      this.reviewFailedInstall = this.reviewFailedInstall.bind(this);
      this.setPackagesStatistics = this.setPackagesStatistics.bind(this);
      this.setQueueStatistics = this.setQueueStatistics.bind(this);
      this.refreshData = this.refreshData.bind(this);
      this.openForm = this.openForm.bind(this);
      this.closeForm = this.closeForm.bind(this);
      this.onDrop = this.onDrop.bind(this);
      this.showBlacklistForm = this.showBlacklistForm.bind(this);
      this.closeBlacklistForm = this.closeBlacklistForm.bind(this);
      this.changeFilter = this.changeFilter.bind(this);

      db.showDevice.reset();
      SotaDispatcher.dispatch({actionType: 'get-device', uuid: this.props.params.id});
      db.showDevice.addWatch("poll-device", _.bind(this.forceUpdate, this, null));
    }
    componentDidMount() {
      var that = this;
      var intervalId = setInterval(function() {
        that.refreshData();
      }, 1000);
      this.setState({intervalId: intervalId});

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
    componentWillUnmount(){
      db.showDevice.reset();
      db.showDevice.removeWatch("poll-device");
      clearInterval(this.state.intervalId);
      clearTimeout(this.state.timeoutIntervalId);
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
    refreshData() {
      SotaDispatcher.dispatch({actionType: 'get-device', uuid: this.props.params.id});
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
    closeBlacklistForm() {
      var that = this;
      this.setState({
        isBlacklistFormShown: false,
        blacklistedPackageName: null,
        blacklistedPackageVersion: null
      });
      setTimeout(function() {
        SotaDispatcher.dispatch({actionType: 'search-packages-by-regex', regex: that.state.filterValue});
      }, 1);
    }
    changeFilter(filter) {
      this.setState({filterValue: filter});
    }
    render() {
      const deviceWithStatus = db.showDevice.deref();

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
          {!_.isUndefined(deviceWithStatus) && deviceWithStatus.status == "NotSeen" ?
            <div className="lightgrey-overlay">
              <TutorialInstallDevice deviceId={deviceWithStatus.uuid}/>
            </div>
          : null}
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
          <div id="components-column" className="col-xs-2 nopadding">
            <div className="panel panel-ats">
              <div className="panel-heading" id="panel-heading-components">
                <div className="panel-heading-left pull-left">
                  Components
                </div>
              </div>
              <div className="panel-body">
                <Components deviceId={this.props.params.id}/>
              </div>
            </div>
          </div>
          <div id="packages-column" className="col-xs-6 nopadding">
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
                    changeFilter={this.changeFilter}/>
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
          <div className="col-xs-4 nopadding">
            <div className="panel panel-ats">
              <div className="panel-heading">
                <div className="panel-heading-left pull-left">
                  {this.context.strings.queue}
                </div>
                <div className="panel-heading-right pull-right">
                </div>
              </div>
              <div className="panel-body">
                <PackagesQueue
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
      );
    }
  };

  DeviceDetails.contextTypes = {
    strings: React.PropTypes.object.isRequired
  };

  return DeviceDetails;
});
