define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      DetailsHeader = require('./details-header'),
      PackagesQueue = require('../packages/queue'),
      Packages = require('../packages/packages'),
      TutorialInstallDevice = require('../tutorial/install-device'),
      VelocityUI = require('velocity-ui'),
      VelocityHelpers = require('mixins/velocity/velocity-helpers'),
      VelocityComponent = require('mixins/velocity/velocity-component'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group');

  class DeviceDetails extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.state = {
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
      }
      this.toggleQueueHistory = this.toggleQueueHistory.bind(this);
      this.reviewFailedInstall = this.reviewFailedInstall.bind(this);
      this.setPackagesStatistics = this.setPackagesStatistics.bind(this);
      this.setQueueStatistics = this.setQueueStatistics.bind(this);
      this.refreshData = this.refreshData.bind(this);
      this.countImpactAnalysisPackages = this.countImpactAnalysisPackages.bind(this);

      SotaDispatcher.dispatch({actionType: 'get-device', device: this.props.params.id});
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
      db.showDevice.reset([]);
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
      SotaDispatcher.dispatch({actionType: 'get-device', device: this.props.params.id});
    }
    countImpactAnalysisPackages(val) {
      this.setState({
        selectedImpactAnalysisPackagesCount: val
      });
    }
    render() {
      // TODO: might be initialized empty
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
          {deviceWithStatus.status == "NotSeen" ?
            <div className="lightgrey-overlay">
              <TutorialInstallDevice />
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
          <DetailsHeader
            device={deviceWithStatus}
            duplicatingInProgress={this.state.duplicatingInProgress}/>
          <div className="col-md-6 nopadding border-right-2">
            <div className="panel panel-ats">
              <div className="panel-heading">
                <div className="panel-heading-left pull-left">
                  {this.context.strings.packages}
                </div>
              </div>
              <div className="panel-body">
                <Packages
                  device={deviceWithStatus.id}
                  setPackagesStatistics={this.setPackagesStatistics}
                  lastSeen={deviceWithStatus.lastSeen}
                  countImpactAnalysisPackages={this.countImpactAnalysisPackages}
                  deviceStatus={deviceWithStatus.status}/>
              </div>
              <div className="panel-footer">
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
          <div className="col-md-6 nopadding">
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
                  device={this.props.params.id}
                  status={deviceWithStatus.status}/>
              </div>
              <div className="panel-footer">
                {this.state.queueCount} packages in queue
              </div>
            </div>
          </div>
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
