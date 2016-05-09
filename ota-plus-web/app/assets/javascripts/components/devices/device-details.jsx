define(function(require) {
  var React = require('react'),
      ReactCSSTransitionGroup = React.addons.CSSTransitionGroup,
      SotaDispatcher = require('sota-dispatcher'),
      DetailsHeader = require('./details-header'),
      PackagesHistory = require('../packages/history'),
      PackagesQueue = require('../packages/queue'),
      Packages = require('../packages/packages');
        
  class DeviceDetails extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        showPackagesHistory: false,
        textPackagesHistory: props.strings.viewhistory
      }
      this.showQueueHistory = this.showQueueHistory.bind(this);
    }
    componentWillMount(){
      SotaDispatcher.dispatch({actionType: 'get-device', vin: this.props.params.vin});
      this.props.Device.addWatch("poll-device", _.bind(this.forceUpdate, this, null));
    }
    componentWillUpdate(nextProps, nextState) {
      if(nextProps.strings != this.props.strings) {
        this.setState({
          textPackagesHistory: nextState.showPackagesHistory ? nextProps.strings.hidehistory : nextProps.strings.viewhistory
        });
      }
    }
    componentWillUnmount(){
      this.props.Device.removeWatch("poll-device");
    }
    showQueueHistory() {
      this.setState({
        showPackagesHistory: !this.state.showPackagesHistory,
        textPackagesHistory: (this.state.showPackagesHistory) ? this.props.strings.viewhistory : this.props.strings.hidehistory,
      });
    }
    render() {
      var Device = this.props.Device.deref()[0];
      return (
        <div>
          <DetailsHeader strings={this.props.strings} device={Device} />
          <div className="row">
            <div className="col-md-6 nopadding border-right-2">
              <div className="panel panel-ats">
                <div className="panel-heading">
                  <div className="panel-heading-left pull-left">
                    {this.props.strings.packages}
                  </div>
                </div>
                <div className="panel-body">
                  <Packages key={'dsads'} strings={this.props.strings} vin={this.props.params.vin}/>
                </div>
                <div className="panel-footer">
                  10 compatible, 5 installed, 0 broken, 4 queued
                </div>
              </div>
            </div>
            <div className="col-md-6 nopadding">
              <div className="panel panel-ats">
                <div className="panel-heading">
                  <div className="panel-heading-left pull-left">
                    {this.props.strings.queue}
                  </div>
                  <div className="panel-heading-right pull-right">
                    <button onClick={this.showQueueHistory} className="btn btn-black">{this.state.textPackagesHistory}</button>
                  </div>
                </div>
                <div className="panel-body">
                  <div className="alert alert-ats alert-dismissible fade in" role="alert">
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true"></span></button>
                    <img src="/assets/img/icons/info.png" className="icon-info" alt=""/> 
                    The installation of the queued packages will start automatically when you connect to your device.
                  </div>
                  <div id="queue-both-lists">
                    {this.state.showPackagesHistory ? 
                      <ReactCSSTransitionGroup
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={500}
                        transitionAppear={true}
                        transitionAppearTimeout={500}
                        transitionName="example">
                          <PackagesHistory strings={this.props.strings} vin={this.props.params.vin}/>
                        </ReactCSSTransitionGroup>
                    : null}
                  
                    <PackagesQueue strings={this.props.strings} vin={this.props.params.vin}/>
                  </div>
                </div>
                <div className="panel-footer">
                  4 packages in queue, 
                  <i className="fa fa-circle package-circle red" aria-hidden="true"></i> 1 error
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return DeviceDetails;
});
