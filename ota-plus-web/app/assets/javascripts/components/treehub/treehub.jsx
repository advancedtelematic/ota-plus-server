define(function(require) {
  var React = require('react'),
      Router = require('react-router'),
      Link = Router.Link,
      SotaDispatcher = require('sota-dispatcher'),
      db = require('stores/db'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      ModalTooltip = require('../modal-tooltip'),
      TreehubHeader = require('./treehub-header'),
      NoAccess = require('../noaccess'),
      Loader = require('../loader');

  class Treehub extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        features: undefined,
        treehubJson: undefined,
        contentHeight: 300,
        isTreehubTooltipShown: false
      };
      this.setContentHeight = this.setContentHeight.bind(this);
      this.showTreehubTooltip = this.showTreehubTooltip.bind(this);
      this.hideTreehubTooltip = this.hideTreehubTooltip.bind(this);
      this.activateTreehub = this.activateTreehub.bind(this);
      this.handleFeatures = this.handleFeatures.bind(this);
      this.handleTreehubJson = this.handleTreehubJson.bind(this);
      SotaDispatcher.dispatch({actionType: 'get-features'});
      SotaDispatcher.dispatch({actionType: 'get-treehub-json'});
      db.features.addWatch("poll-features", _.bind(this.handleFeatures, this, null));
      db.treehubJson.addWatch("poll-treehub-json", _.bind(this.handleTreehubJson, this, null));
    }
    componentDidMount() {
      window.addEventListener("resize", this.setContentHeight);
      this.setContentHeight();
    }
    componentDidUpdate(prevProps, prevState) {
      if(prevProps.hasBetaAccess !== this.props.hasBetaAccess) {
        this.setContentHeight();
      }
    }
    componentWillUnmount() {
      window.removeEventListener("resize", this.setContentHeight);
      db.features.removeWatch("poll-features");
      db.treehubJson.removeWatch("poll-treehub-json");
      db.features.reset();
      db.treehubJson.reset();
    }
    setContentHeight() {    
      if(this.props.hasBetaAccess) {
        var windowHeight = jQuery(window).height();
        this.setState({
          contentHeight: windowHeight - jQuery('.grey-header').offset().top - jQuery('.grey-header').outerHeight()
        });
      }
    }
    showTreehubTooltip(e) {
      if(e) e.preventDefault();
      this.setState({isTreehubTooltipShown: true});
    }
    hideTreehubTooltip(e) {
      if(e) e.preventDefault();
      this.setState({isTreehubTooltipShown: false});
    }
    activateTreehub() {
      SotaDispatcher.dispatch({
        actionType: 'enable-treehub-feature'
      });
      this.hideTreehubTooltip();
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
      var tooltipContent = (
        <div className="text-center">
          With ATS Garage, OSTree, and Treehub, you can have incredibly fast 
          and efficient atomic differential updates to your embedded devices
          --it's like Git (and GitHub) for your embedded filesystems. You even 
          get versioning on the device, so you can instantly switch between
          different firmware releases without having to re-flash or re-download anything.
          <br /><br />
          Sound exciting? Click the switch to enable, and then start reading 
          the docs to learn how to <strong>integrate Treehub into your existing 
          OpenEmbedded/Yocto project </strong>, or how to <strong>start a new project from scratch on a Raspberry Pi</strong>.
        </div>
      );
    
      return (
        this.props.hasBetaAccess ?
          <div>
            <TreehubHeader />
            <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
              {!_.isUndefined(this.state.features) && (this.state.features.indexOf('treehub') < 0 || !_.isUndefined(this.state.treehubJson)) ?
                this.state.features.indexOf('treehub') < 0 ?
                  <div className="treehub-disabled" style={{height: this.state.contentHeight}}>
                    <div className="center-xy padding-15">
                      <div className="font-22">Treehub not activated.</div>
                      <div className="margin-top-10">
                        <a href="#" className="font-18" onClick={this.showTreehubTooltip}>
                          <span className="color-main"><strong>What is this?</strong></span>
                        </a>
                      </div>
                    </div>
                  </div>
                : 
                  <div className="treehub-enabled" style={{height: this.state.contentHeight}}>
                    <div className="center-xy text-center padding-15">
                      <span className="font-22"><strong>Welcome to TreeHub,</strong></span><br />
                      the future of embedded device version management.<br />
                      The first thing you'll need to do is add OSTree support into your project.<br /><br />
                      Download your credentials and start pushing your images to TreeHub.
                      <div className="margin-top-20">
                        <a href={"data:text/json;charset=utf-8,"+ encodeURIComponent(JSON.stringify(this.state.treehubJson))} download="treehub.json" className="btn btn-confirm">Download</a>
                      </div>
                      
                      <div className="margin-top-40">
                        <div className="panel panel-grey">
                          <div className="panel-heading">
                            <img src="/assets/img/icons/white/treehub_leaf.png" alt=""/>
                          </div>
                          <div className="panel-body">
                            I'm new to Yocto/Open Embedded. <br />
                            Show me how to start a project <br />
                            from scratch.
                            <a href="http://docs.atsgarage.com/ostree/starting-a-new-ostreeenabled-yocto-project.html" className="btn btn-confirm btn-small">Start</a>
                          </div>
                        </div>
                        <div className="panel panel-grey">
                          <div className="panel-heading">
                            <img src="/assets/img/icons/white/treehub_tree.png" alt=""/>
                          </div>
                          <div className="panel-body">
                            I have an existing Yocto project <br />
                            that I want to OTA-enable.
                            <a href="http://docs.atsgarage.com/ostree/adding-ostree-to-your-existing-yocto-project.html" className="btn btn-confirm btn-small">Start</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              : 
                <div className="treehub-disabled" style={{height: this.state.contentHeight}}>
                  <div className="center-xy padding-15">
                    <Loader />
                  </div>
                </div>
              }
            </VelocityTransitionGroup>
            <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
              {this.state.isTreehubTooltipShown ?
                <ModalTooltip 
                  title="TreeHub"
                  body={tooltipContent}
                  isCloseButtonShown={true}
                  closeButtonLabel="Later"
                  closeButtonAction={this.hideTreehubTooltip}
                  confirmButtonLabel="Get started now!"
                  confirmButtonAction={this.activateTreehub}/>
              : undefined}
            </VelocityTransitionGroup>
          </div>
        :
          <NoAccess />
      );
    }
  }
  return Treehub;
});
