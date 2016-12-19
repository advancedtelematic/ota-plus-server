define(function(require) {
  var React = require('react'),
      SotaDispatcher = require('sota-dispatcher'),
      db = require('stores/db'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      TreeHubTooltip = require('./treehub-tooltip'),
      NoAccess = require('../noaccess'),
      Loader = require('../loader');

  class TreeHub extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        features: undefined,
        treehubJson: undefined,
        treeHubContentHeight: 300,
        isTreeHubTooltipShown: false
      };
      this.setTreeHubContentHeight = this.setTreeHubContentHeight.bind(this);
      this.showTreeHubTooltip = this.showTreeHubTooltip.bind(this);
      this.hideTreeHubTooltip = this.hideTreeHubTooltip.bind(this);
      this.handleFeatures = this.handleFeatures.bind(this);
      this.handleTreehubJson = this.handleTreehubJson.bind(this);
      SotaDispatcher.dispatch({actionType: 'get-features'});
      SotaDispatcher.dispatch({actionType: 'get-treehub-json'});
      db.features.addWatch("poll-features", _.bind(this.handleFeatures, this, null));
      db.treehubJson.addWatch("poll-treehub-json", _.bind(this.handleTreehubJson, this, null));
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
      db.features.removeWatch("poll-features");
      db.treehubJson.removeWatch("poll-treehub-json");
      db.features.reset();
      db.treehubJson.reset();
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
    handleFeatures() {
      var features = db.features.deref();
      if(!_.isUndefined(features)) {
        this.setState({features: features});
      }
    }
    handleTreehubJson() {
      var treehubJson = db.treehubJson.deref();
      if(!_.isUndefined(treehubJson)) {
        this.setState({treehubJson: treehubJson});
      }
    }
    render() {    
      return (
        <div id="treehub" style={{height: this.state.treeHubContentHeight}}>
          {this.props.hasBetaAccess ?
            !_.isUndefined(this.state.features) && (this.state.features.indexOf('ostreehub') < 0 || !_.isUndefined(this.state.treehubJson)) ?
              this.state.features.indexOf('treehub') < 0 ?
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
                <div className="height-100 position-relative text-center">
                  <div className="center-xy padding-15">
                    <div className="font-20">
                      Download my TreeHub configuration file.
                    </div>
                    <div className="margin-top-20">
                      <a href={"data:text/json;charset=utf-8,"+ encodeURIComponent(JSON.stringify(this.state.treehubJson))} download="treehub.json" className="btn btn-confirm">Download</a>
                    </div>
                  </div>
                </div>
            : 
              <Loader />
          :  
            <NoAccess />
          }
        </div>
      );
    }
  }
  return TreeHub;
});
