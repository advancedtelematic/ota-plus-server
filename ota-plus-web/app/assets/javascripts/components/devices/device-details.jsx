define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      ReactCSSTransitionGroup = React.addons.CSSTransitionGroup,
      SotaDispatcher = require('sota-dispatcher'),
      DetailsHeader = require('./details-header'),
      PackagesHistory = require('../packages/history'),
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
        intervalId: null
      }
      this.showQueueHistory = this.showQueueHistory.bind(this);
      this.setPackagesStatistics = this.setPackagesStatistics.bind(this);
      this.setQueueStatistics = this.setQueueStatistics.bind(this);
      this.refreshData = this.refreshData.bind(this);
      
      SotaDispatcher.dispatch({actionType: 'get-device', vin: this.props.params.vin});
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
      SotaDispatcher.dispatch({actionType: 'get-device', vin: this.props.params.vin});
    }
    render() {
      var Device = this.props.Device.deref();
      return (
        <ReactCSSTransitionGroup
          transitionAppear={true}
          transactionLeave={false}
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
            <DetailsHeader device={Device} />
            <div className="row">
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
                      setPackagesStatistics={this.setPackagesStatistics}/>
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
                      <button onClick={this.showQueueHistory} className="btn btn-black">{this.state.textPackagesHistory}</button>
                    </div>
                  </div>
                  <div className="panel-body">
                    <div className="alert alert-ats alert-dismissible fade in" role="alert">
                      <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true"></span></button>
                      <img src="/assets/img/icons/info.png" className="icon-info" alt=""/> 
                      The installation of the packages will start automatically when you connect to your device.
                    </div>
                    <div id="queue-both-lists">
                      {this.state.showPackagesHistory ? 
                        <ReactCSSTransitionGroup
                          transitionAppear={true}
                          transactionLeave={false}
                          transitionAppearTimeout={500}
                          transitionEnterTimeout={500}
                          transitionLeaveTimeout={500}
                          transitionName="example">
                          <PackagesHistory vin={this.props.params.vin}/>
                        </ReactCSSTransitionGroup>
                      : null}
                  
                      <PackagesQueue 
                        vin={this.props.params.vin}
                        setQueueStatistics={this.setQueueStatistics}/>
                    </div>
                  </div>
                  <div className="panel-footer">
                    {this.state.queueCount} packages in queue
                  </div>
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
