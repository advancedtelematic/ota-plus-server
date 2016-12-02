define(function(require) {
  var React = require('react'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      ProvisioningTooltip = require('es6!./provisioning-tooltip'),
      NoAccess = require('es6!../noaccess');

  class Provisioning extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        provisioningContentHeight: 300,
        isProvisioningTooltipShown: false
      };
      this.setProvisioningContentHeight = this.setProvisioningContentHeight.bind(this);
      this.showProvisioningTooltip = this.showProvisioningTooltip.bind(this);
      this.hideProvisioningTooltip = this.hideProvisioningTooltip.bind(this);
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
    render() {
      return (
        <div id="provisioning" style={{height: this.state.provisioningContentHeight}}>
          {this.props.hasBetaAccess ?
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
            <NoAccess />
          }
        </div>
      );
    }
  }
  return Provisioning;
});
