define(function(require) {
  var React = require('react'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      TreeHubTooltip = require('es6!./treehub-tooltip'),
      NoAccess = require('es6!../noaccess');

  class TreeHub extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        treeHubContentHeight: 300,
        isTreeHubTooltipShown: false
      };
      this.setTreeHubContentHeight = this.setTreeHubContentHeight.bind(this);
      this.showTreeHubTooltip = this.showTreeHubTooltip.bind(this);
      this.hideTreeHubTooltip = this.hideTreeHubTooltip.bind(this);
    }
    componentDidMount() {
      var that = this;
      window.addEventListener("resize", this.setTreeHubContentHeight);
      setTimeout(function() {
        that.setTreeHubContentHeight();
      }, 1);
    }
    componentWillUnmount() {
      window.removeEventListener("resize", this.setTreeHubContentHeight);
    }
    setTreeHubContentHeight() {
      var windowHeight = jQuery(window).height();
      var offsetTop = jQuery('#treehub').offset().top
      this.setState({
        treeHubContentHeight: windowHeight - offsetTop
      });
    }
    showTreeHubTooltip(e) {
      if(e) e.preventDefault();
      this.setState({isTreeHubTooltipShown: true});
    }
    hideTreeHubTooltip() {
      this.setState({isTreeHubTooltipShown: false});
    }
    render() {
      return (
        <div id="treehub" style={{height: this.state.treeHubContentHeight}}>
          {this.props.hasBetaAccess ?
            <div className="height-100 position-relative text-center">
              <div className="center-xy padding-15">
                <div className="font-22">TreeHub not activated.</div>
                <div className="margin-top-10">
                  <a href="#" className="font-22" onClick={this.showTreeHubTooltip}>
                    <span className="color-main"><strong>What is this?</strong></span>
                  </a>
                </div>
              </div>
              <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
                {this.state.isTreeHubTooltipShown ?
                  <TreeHubTooltip 
                    hideTreeHubTooltip={this.hideTreeHubTooltip}/>
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
  return TreeHub;
});
