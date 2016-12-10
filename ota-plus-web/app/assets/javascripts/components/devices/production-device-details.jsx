define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      ProductionDetailsHeader = require('./production-details-header'),
      PackagesQueue = require('../packages/queue'),
      Packages = require('../packages/packages'),
      Loader = require('../loader'),
      VelocityUI = require('velocity-ui'),
      VelocityHelpers = require('mixins/velocity/velocity-helpers'),
      VelocityComponent = require('mixins/velocity/velocity-component'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group');

  class ProductionDeviceDetails extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.state = {
        isPackagesHistoryShown: false,
        textPackagesHistory: 'View history',
        installedPackagesCount: 0,
        queuedPackagesCount: 0,
        queueCount: 0,
        intervalId: null,
        testId: localStorage.getItem('firstProductionTestDevice'),
      }
      this.toggleQueueHistory = this.toggleQueueHistory.bind(this);
      this.setPackagesStatistics = this.setPackagesStatistics.bind(this);
      this.setQueueStatistics = this.setQueueStatistics.bind(this);
      this.refreshData = this.refreshData.bind(this);
      
      db.device.reset();
      SotaDispatcher.dispatch({actionType: 'get-production-device'});
      db.device.addWatch("poll-device", _.bind(this.forceUpdate, this, null));
    }
    componentDidMount() {
      var that = this;
      var intervalId = setInterval(function() {
        that.refreshData();
      }, 1000);
      this.setState({intervalId: intervalId});
    }
    componentWillUnmount(){
      db.device.reset();
      db.device.removeWatch("poll-device");
      clearInterval(this.state.intervalId);
    }
    toggleQueueHistory() {
      this.setState({
        isPackagesHistoryShown: !this.state.isPackagesHistoryShown,
        textPackagesHistory: (this.state.isPackagesHistoryShown) ? 'View history' : 'Hide history',
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
      SotaDispatcher.dispatch({actionType: 'get-production-device'});
    }
    render() {
      // TODO: might be initialized empty
      const deviceWithStatus = db.device.deref();

      return (
        <div>
          <div className="device-header">
            <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
              {!_.isUndefined(deviceWithStatus) ? 
                <ProductionDetailsHeader
                  device={deviceWithStatus}
                  id={this.props.params.id}/>
              : undefined}
            </VelocityTransitionGroup>
            {_.isUndefined(deviceWithStatus) ? 
              <Loader />
            : undefined}
          </div>
          <div className="col-md-6 nopadding border-right-2">
            <div className="panel panel-ats">
              <div className="panel-heading">
                <div className="panel-heading-left pull-left">
                  Packages
                </div>
              </div>
              <div className="panel-body">
                  <Packages
                    device={deviceWithStatus}
                    setPackagesStatistics={this.setPackagesStatistics}/>
              </div>
              <div className="panel-footer">
                <span className="packages-statistics">
                  {this.state.installedPackagesCount} installed, &nbsp;
                  {this.state.queuedPackagesCount} queued
                </span>
              </div>
            </div>
          </div>
          <div className="col-md-6 nopadding">
            <div className="panel panel-ats">
              <div className="panel-heading">
                <div className="panel-heading-left pull-left">
                  Queue
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
          {this.props.children}
        </div>
      );
    }
  };

  return ProductionDeviceDetails;
});
