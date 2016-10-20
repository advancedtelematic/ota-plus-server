define(function(require) {
  var React = require('react'),
      Cookies = require('js-cookie'),
      SotaDispatcher = require('sota-dispatcher'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      QueueList = require('es6!./queue-list'),
      HistoryList = require('es6!./history-list');

  class QueueWrapper extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isFirstFailedExpanded: false,
        queueListHeight: '300px',
        intervalId: null,
        alertHidden: false,
      }
      
      var alertCookie;
      try {
        alertCookie = JSON.parse(Cookies.get('alerts'));
      } catch (e) {
        alertCookie = {};
      }
      if(!_.isUndefined(alertCookie.queue) && alertCookie.queue === 'closed')
        this.state.alertHidden = true;
      
      this.refreshData = this.refreshData.bind(this);
      this.toggleQueueHistory = this.toggleQueueHistory.bind(this);
      this.reviewFailedInstall = this.reviewFailedInstall.bind(this);
      this.unblockQueue = this.unblockQueue.bind(this);
      this.setQueueListHeight = this.setQueueListHeight.bind(this);
    }
    componentDidMount() {
      var that = this;
      
      jQuery('#queue .close').click(function() {
        var timeoutId = setTimeout(function(){
          var alertCookie;
          try {
            alertCookie = JSON.parse(Cookies.get('alerts'));
          } catch (e) {
            alertCookie = {};
          }
          that.setQueueListHeight();
          clearTimeout(timeoutId);
          alertCookie.queue = "closed";
          Cookies.set('alerts', alertCookie);
        }, 200);
      });
      window.addEventListener("resize", this.setQueueListHeight);
      setTimeout(function() {
        that.setQueueListHeight();
      }, 1);
      
      var intervalId = setInterval(function() {
        that.refreshData();
      }, 1000);
      this.setState({intervalId: intervalId});
    }
    componentWillUnmount() {
      window.removeEventListener("resize", this.setQueueListHeight);
      clearInterval(this.state.intervalId);
    }
    refreshData() {
      SotaDispatcher.dispatch({actionType: 'get-package-queue-for-device', device: this.props.deviceId});
    }
    toggleQueueHistory() {
      this.setState({
        isFirstFailedExpanded: false
      });
      this.props.toggleQueueHistory();
    }
    reviewFailedInstall() {
      this.setState({
        isFirstFailedExpanded: true
      });
      this.props.reviewFailedInstall();
    }
    unblockQueue() {
      SotaDispatcher.dispatch({
        actionType: 'unblock-queue',
        device: this.props.deviceId
      });
    }
    setQueueListHeight() {
      var windowHeight = jQuery(window).height();
      var footerHeight = jQuery('.panel-footer').outerHeight();
      var offsetTop = jQuery('#queue-wrapper').offset().top;
      this.setState({
        queueListHeight: windowHeight - offsetTop - footerHeight
      });
    }
    render() {
      return (
        <div id="queue">
          <div className="panel-subheading">
            <button onClick={this.toggleQueueHistory} className="btn btn-history pull-right" id="button-toggle-queue-history">{this.props.textPackagesHistory}</button>
          </div>
          <div className={"alert alert-ats alert-dismissible" + (this.state.alertHidden ? " hidden" : '')} role="alert">
            <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true"></span></button>
            <img src="/assets/img/icons/info.png" className="icon-info" alt=""/>
            The installation of the packages will start automatically when you connect to your device.
          </div>
  
          {this.props.status === 'Error' ? 
            <div className="box-red">
              <span className="font-14"><strong><i className="fa fa-warning" aria-hidden="true"></i> Paused!</strong></span>
              <div className="margin-top-10">
                We've interrupted the installation process for this device because of. Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui.
              </div>
              <div className="margin-top-10">
                <button className="btn btn-white" onClick={this.reviewFailedInstall}><i className="fa fa-arrow-right font-14" aria-hidden="true"></i> &nbsp; Review failed install</button>
                <button className="btn btn-white margin-left-10" onClick={this.unblockQueue}><i className="fa fa-unlock-alt font-14 vertical-align-middle" aria-hidden="true"></i> &nbsp; Ignore and resume</button>
              </div>
            </div>
          : null}
          
          <div id="queue-wrapper" style={{height: this.state.queueListHeight}}>
            {!_.isUndefined(this.props.device) ? 
              !this.props.isPackagesHistoryShown ?
                <QueueList
                  key="queue-list"
                  deviceId={this.props.device.uuid}
                  setQueueStatistics={this.props.setQueueStatistics}/>
              :
                <HistoryList
                  key="history-list"
                  deviceId={this.props.device.uuid}
                  isFirstFailedExpanded={this.state.isFirstFailedExpanded}/>
            : undefined}
          </div>
        </div>
      );
    }
  };

  return QueueWrapper;
});
