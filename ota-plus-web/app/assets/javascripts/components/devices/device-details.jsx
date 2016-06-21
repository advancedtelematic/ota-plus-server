define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      ReactCSSTransitionGroup = React.addons.CSSTransitionGroup,
      SotaDispatcher = require('sota-dispatcher'),
      DetailsHeader = require('./details-header'),
      PackagesQueue = require('../packages/queue'),
      Packages = require('../packages/packages');
        
  class DeviceDetails extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.state = {
        showPackagesHistory: false,
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
      this.showQueueHistory = this.showQueueHistory.bind(this);
      this.setPackagesStatistics = this.setPackagesStatistics.bind(this);
      this.setQueueStatistics = this.setQueueStatistics.bind(this);
      this.refreshData = this.refreshData.bind(this);
      this.countImpactAnalysisPackages = this.countImpactAnalysisPackages.bind(this);
      
      SotaDispatcher.dispatch({actionType: 'get-device', vin: this.props.params.vin});
      this.props.Device.addWatch("poll-device", _.bind(this.forceUpdate, this, null));
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
          textPackagesHistory: nextState.showPackagesHistory ? nextContext.strings.hidehistory : nextContext.strings.viewhistory
        });
      }
    }
    componentWillUnmount(){
      this.props.Device.removeWatch("poll-device");
      clearInterval(this.state.intervalId);
      clearTimeout(this.state.timeoutIntervalId);
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
      SotaDispatcher.dispatch({actionType: 'get-device', vin: this.props.params.vin});
    }
    countImpactAnalysisPackages(val) {
      this.setState({
        selectedImpactAnalysisPackagesCount: val
      });
    }
    render() {
      var Device = this.props.Device.deref();
      return (
        <ReactCSSTransitionGroup
          transitionAppear={true}
          transitionLeave={false}
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
          transitionName="example">  
          <div>
            {Device.status == "NotSeen" ? 
              <div className="white-overlay">
                Device never seen online <br />
                Download the SDK
                (<a href={`/api/v1/client/${this.props.params.vin}/deb/32`}>debian 32</a> &nbsp; or &nbsp;
                 <a href={`/api/v1/client/${this.props.params.vin}/deb/64`}>debian 64</a>)
              </div>
            : null}
            {this.state.duplicatingInProgress ? 
              <div className="grey-overlay">
                <p><img src='/assets/img/icons/loading.gif' alt=''/></p>
                <div>applying configuration from</div>
                <div>{this.props.params.vin2}</div>
              </div>
            : null}
            <DetailsHeader 
              device={Device} 
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
                    vin={this.props.params.vin} 
                    setPackagesStatistics={this.setPackagesStatistics}
                    lastSeen={Device.lastSeen}
                    countImpactAnalysisPackages={this.countImpactAnalysisPackages}/>
                </div>
                <div className="panel-footer">
                  {this.state.selectedImpactAnalysisPackagesCount > 0 ? 
                    <ReactCSSTransitionGroup
                      transitionAppear={true}
                      transitionLeave={false}
                      transitionAppearTimeout={500}
                      transitionEnterTimeout={500}
                      transitionLeaveTimeout={500}
                      transitionName="example">
                      <Link to={`devicedetails/${this.props.params.vin}/impactanalysis/${this.state.selectedImpactAnalysisPackagesCount}`} className="btn btn-black impact-analysis-button pull-left">
                        Impact analysis
                      </Link>
                    </ReactCSSTransitionGroup>
                  : null}
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
                    vin={this.props.params.vin}/>
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
  
  DeviceDetails.contextTypes = {
    strings: React.PropTypes.object.isRequired
  };

  return DeviceDetails;
});
