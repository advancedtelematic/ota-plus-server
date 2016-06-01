define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      ReactCSSTransitionGroup = React.addons.CSSTransitionGroup,
      SotaDispatcher = require('sota-dispatcher'),
      ProductionDetailsHeader = require('./production-details-header'),
      PackagesQueue = require('../packages/queue'),
      Packages = require('../packages/packages');

  class ProductionDeviceDetails extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.state = {
        showPackagesHistory: false,
        textPackagesHistory: context.strings.viewhistory,
        installedPackagesCount: 0,
        queuedPackagesCount: 0,
        queueCount: 0,
        intervalId: null,
        testVin: localStorage.getItem('firstProductionTestDevice'),
      }
      this.showQueueHistory = this.showQueueHistory.bind(this);
      this.setPackagesStatistics = this.setPackagesStatistics.bind(this);
      this.setQueueStatistics = this.setQueueStatistics.bind(this);
      this.refreshData = this.refreshData.bind(this);

      SotaDispatcher.dispatch({actionType: 'get-device', device: this.state.testVin});
      this.props.Device.addWatch("poll-device", _.bind(this.forceUpdate, this, null));
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
          textPackagesHistory: nextState.showPackagesHistory ? nextContext.strings.hidehistory : nextContext.strings.viewhistory
        });
      }
    }
    componentWillUnmount(){
      this.props.Device.removeWatch("poll-device");
      clearInterval(this.state.intervalId);
    }
    showQueueHistory() {
      this.setState({
        showPackagesHistory: !this.state.showPackagesHistory,
        textPackagesHistory: (this.state.showPackagesHistory) ? this.context.strings.viewhistory : this.context.strings.hidehistory,
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
      SotaDispatcher.dispatch({actionType: 'get-device', device: this.state.testVin});
    }
    render() {
      // TODO: might be initialized empty
      const deviceWithStatus = this.props.Device.deref();
      return (
        <ReactCSSTransitionGroup
          transitionAppear={true}
          transitionLeave={false}
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
          transitionName="example">
          <div>
            <ProductionDetailsHeader
              device={deviceWithStatus}/>
            <div className="col-md-6 nopadding border-right-2">
              <div className="panel panel-ats">
                <div className="panel-heading">
                  <div className="panel-heading-left pull-left">
                    {this.context.strings.packages}
                  </div>
                </div>
                <div className="panel-body">
                  <Packages
                    device={this.state.testVin}
                    setPackagesStatistics={this.setPackagesStatistics}
                    lastSeen={Device.lastSeen}/>
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
                    showPackagesHistory={this.state.showPackagesHistory}
                    showQueueHistory={this.showQueueHistory}
                    setQueueStatistics={this.setQueueStatistics}
                    device={this.props.params.id}/>
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
