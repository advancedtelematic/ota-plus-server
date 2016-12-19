define(function(require) {
  var React = require('react'),
      SotaDispatcher = require('sota-dispatcher'),
      db = require('stores/db'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      ProvisioningTooltip = require('./provisioning-tooltip'),
      NoAccess = require('../noaccess'),
      Loader = require('../loader');

  class Provisioning extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isProvisioningActivated: undefined,
        provisioningDetails: undefined,
        provisioningContentHeight: 300,
        isProvisioningTooltipShown: false
      };
      this.setProvisioningContentHeight = this.setProvisioningContentHeight.bind(this);
      this.showProvisioningTooltip = this.showProvisioningTooltip.bind(this);
      this.hideProvisioningTooltip = this.hideProvisioningTooltip.bind(this);
      this.handleProvisioningStatus = this.handleProvisioningStatus.bind(this);
      this.handleProvisioningDetails = this.handleProvisioningDetails.bind(this);
      SotaDispatcher.dispatch({actionType: 'get-provisioning-status'});
      db.provisioningStatus.addWatch("poll-provisioning-status", _.bind(this.handleProvisioningStatus, this, null));
      db.provisioningDetails.addWatch("poll-provisioning-details", _.bind(this.handleProvisioningDetails, this, null));
    }
    componentDidMount() {
      var that = this;
      window.addEventListener("resize", this.setProvisioningContentHeight);
      setTimeout(function() {
        that.setProvisioningContentHeight();
      }, 1);
    }
    componentWillUnmount() {
      window.removeEventListener("resize", this.setProvisioningContentHeight);
      db.provisioningStatus.removeWatch("poll-provisioning-status");
      db.provisioningDetails.removeWatch("poll-provisioning-details");
      db.provisioningStatus.reset();
      db.provisioningDetails.reset();
    }
    setProvisioningContentHeight() {
      var windowHeight = jQuery(window).height();
      var offsetTop = jQuery('#provisioning').offset().top
      this.setState({
        provisioningContentHeight: windowHeight - offsetTop
      });
    }
    showProvisioningTooltip(e) {
      if(e) e.preventDefault();
      this.setState({isProvisioningTooltipShown: true});
    }
    hideProvisioningTooltip() {
      this.setState({isProvisioningTooltipShown: false});
    }
    handleProvisioningStatus() {
      var provisioningStatus = db.provisioningStatus.deref();
      if(!_.isUndefined(provisioningStatus)) {
        this.setState({isProvisioningActivated: provisioningStatus.active});
      }
    }
    handleProvisioningDetails() {
      var provisioningDetails = db.provisioningDetails.deref();
      if(!_.isUndefined(provisioningDetails)) {
        this.setState({provisioningDetails: provisioningDetails});
      }
    }
    render() {
      return (
        <div id="provisioning" style={{height: this.state.provisioningContentHeight}}>
          {this.props.hasBetaAccess ?
            !_.isUndefined(this.state.isProvisioningActivated) && (!this.state.isProvisioningActivated || !_.isUndefined(this.state.provisioningDetails)) ?
              !this.state.isProvisioningActivated ? 
                <div className="height-100 position-relative text-center">
                  <div className="center-xy padding-15">
                    <div className="font-22">Provisioning not activated.</div>
                    <div className="margin-top-10">
                      <a href="#" className="font-22" onClick={this.showProvisioningTooltip}>
                        <span className="color-main"><strong>What is this?</strong></span>
                      </a>
                    </div>
                  </div>
                  <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
                    {this.state.isProvisioningTooltipShown ? 
                      <ProvisioningTooltip 
                        hideProvisioningTooltip={this.hideProvisioningTooltip}/>
                    : undefined}
                  </VelocityTransitionGroup>
                </div>
              :
                <div className="height-100 position-relative text-center">
                  <div className="center-xy padding-15">
                    <p className="font-22">My personal server name:</p>
                    <pre>{this.state.provisioningDetails.hostName}</pre>
                  </div>
                </div>
            : 
              <div className="height-100 position-relative text-center">
                <div className="center-xy padding-15">
                  <Loader />
                </div>
              </div>
          :
            <NoAccess />
          }
        </div>
      );
    }
  }
  return Provisioning;
});
