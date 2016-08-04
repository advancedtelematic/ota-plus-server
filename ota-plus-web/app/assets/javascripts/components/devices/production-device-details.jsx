define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      ReactCSSTransitionGroup = React.addons.CSSTransitionGroup,
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      ProductionDetailsHeader = require('./production-details-header'),
      PackagesQueue = require('../packages/queue'),
      Packages = require('../packages/packages');

  class ProductionDeviceDetails extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.state = {
        isPackagesHistoryShown: false,
        textPackagesHistory: context.strings.viewhistory,
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
    }
    componentDidMount() {
      var that = this;
      var intervalId = setInterval(function() {
        that.refreshData();
      }, 1000);
      this.setState({intervalId: intervalId});
    }
    componentWillUpdate(nextProps, nextState, nextContext) {
      if(nextContext.strings != this.context.strings) {
        this.setState({
          textPackagesHistory: nextState.isPackagesHistoryShown ? nextContext.strings.hidehistory : nextContext.strings.viewhistory
        });
      }
    }
    componentWillUnmount(){
      clearInterval(this.state.intervalId);
    }
    toggleQueueHistory() {
      this.setState({
        isPackagesHistoryShown: !this.state.isPackagesHistoryShown,
        textPackagesHistory: (this.state.isPackagesHistoryShown) ? this.context.strings.viewhistory : this.context.strings.hidehistory,
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
      SotaDispatcher.dispatch({actionType: 'get-device', device: this.state.testId});
    }
    render() {
      // TODO: might be initialized empty
      const devices = db.searchableProductionDevices.deref();
      const deviceWithStatus = !_.isUndefined(devices) && devices.length ? devices[0] : undefined;

      return (
        <ReactCSSTransitionGroup
          transitionAppear={true}
          transitionLeave={false}
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
          transitionName="example">
          <div>
          {!_.isUndefined(deviceWithStatus) ?
            <ProductionDetailsHeader
              device={deviceWithStatus}/>
            : undefined }
            <div className="col-md-6 nopadding border-right-2">
              <div className="panel panel-ats">
                <div className="panel-heading">
                  <div className="panel-heading-left pull-left">
                    {this.context.strings.packages}
                  </div>
                </div>
                <div className="panel-body">
                {!_.isUndefined(deviceWithStatus) ?
                  <Packages
                    device={deviceWithStatus}
                    setPackagesStatistics={this.setPackagesStatistics}
                    lastSeen={deviceWithStatus.lastSeen}/>
                  : undefined}
                </div>
                <div className="panel-footer">
                  {this.state.installedPackagesCount} installed, &nbsp;
                  {this.state.queuedPackagesCount} queued
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
                    setQueueStatistics={this.setQueueStatistics}
                    device={deviceWithStatus}/>
                </div>
                <div className="panel-footer">
                  {this.state.queueCount} packages in queue
                </div>
              </div>
            </div>
          </div>
          {this.props.children}
        </ReactCSSTransitionGroup>
      );
    }
  };

  ProductionDeviceDetails.contextTypes = {
    strings: React.PropTypes.object.isRequired
  };

  return ProductionDeviceDetails;
});
