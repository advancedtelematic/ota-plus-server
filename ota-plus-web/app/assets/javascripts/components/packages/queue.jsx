define(function(require) {
  var React = require('react'),
      Cookies = require('js-cookie'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      QueueList = require('./queue-list'),
      HistoryList = require('./history-list');

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
      
      this.toggleQueueHistory = this.toggleQueueHistory.bind(this);
      this.reviewFailedInstall = this.reviewFailedInstall.bind(this);
      this.unblockQueue = this.unblockQueue.bind(this);
      this.setQueueListHeight = this.setQueueListHeight.bind(this);
      this.handleDeviceSeen = this.handleDeviceSeen.bind(this);
      db.deviceSeen.addWatch("poll-deviceseen-queue", _.bind(this.handleDeviceSeen, this, null));
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
      SotaDispatcher.dispatch({actionType: 'get-package-queue-for-device', device: this.props.deviceId});
    }
    componentWillUnmount() {
      db.deviceSeen.removeWatch("poll-deviceseen-queue");
      window.removeEventListener("resize", this.setQueueListHeight);
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
    handleDeviceSeen() {
      var deviceSeen = db.deviceSeen.deref();
      if(!_.isUndefined(deviceSeen) && this.props.deviceId === deviceSeen.uuid) {
        SotaDispatcher.dispatch({actionType: 'get-package-queue-for-device', device: this.props.deviceId});
      }
    }
    render() {
      return (
        <div id="queue">
          <div className="panel-subheading">
            <button onClick={this.toggleQueueHistory} className="btn btn-main btn-history pull-right" id="button-toggle-queue-history">{this.props.textPackagesHistory}</button>
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
                  setQueueStatistics={this.props.setQueueStatistics}
                  setQueueListHeight={this.setQueueListHeight}/>
              :
                <HistoryList
                  key="history-list"
                  deviceId={this.props.device.uuid}
                  isFirstFailedExpanded={this.state.isFirstFailedExpanded}
                  setQueueListHeight={this.setQueueListHeight}/>
            : undefined}
          </div>
        </div>
      );
    }
  };

  return QueueWrapper;
});
