define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      ComponentsList = require('es6!./components-list'),
      ComponentsOverlay = require('es6!./components-overlay'),
      Loader = require('es6!../loader'),
      VelocityUI = require('velocity-ui'),
      VelocityHelpers = require('mixins/velocity/velocity-helpers'),
      VelocityComponent = require('mixins/velocity/velocity-component'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group');

  class Components extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        detailsShown: false,
        detailsId: null,
        isComponentsListEmpty: null,
        componentsListHeight: '400px'
      };
      this.showDetails = this.showDetails.bind(this);
      this.closeDetails = this.closeDetails.bind(this);
      this.setComponentsListHeight = this.setComponentsListHeight.bind(this);
      this.checkPostStatus = this.checkPostStatus.bind(this);
      db.components.addWatch("poll-components-list", _.bind(this.forceUpdate, this, null));
      db.postStatus.addWatch("poll-components-list-post-status", _.bind(this.checkPostStatus, this, null));
      SotaDispatcher.dispatch({actionType: 'get-components', device: this.props.deviceId});
    }
    componentDidMount() {
      window.addEventListener("resize", this.setComponentsListHeight);
      this.setComponentsListHeight();
    }
    componentWillUnmount() {
      db.components.reset();
      db.components.removeWatch("poll-components-list");
      db.postStatus.removeWatch("poll-components-list-post-status");
      window.removeEventListener("resize", this.setComponentsListHeight);
    }
    setComponentsListHeight() {
      var windowHeight = jQuery(window).height();
      var offsetTop = jQuery('#components').offset().top;
      this.setState({
        componentsListHeight: windowHeight - offsetTop
      });
    }
    showDetails(id) {
      this.setState({
        detailsShown: (this.state.detailsId !== id ? true : true),
        detailsId: (this.state.detailsId !== id ? id : this.state.detailsId)
      });
    }
    closeDetails() {
      this.setState({
        detailsShown: false,
        detailsId: null
      });
    }
    checkPostStatus() {
      var postStatus = db.postStatus.deref()['get-components'];
      if(!_.isUndefined(db.postStatus.deref()['get-components'])) {
        if(postStatus.code == '404')
          this.setState({isComponentsListEmpty: true});
      }
    }
    render() {
      function animateLeftPosition(left, opacity, action) {
        return VelocityHelpers.registerEffect("transition."+action, {
          defaultDuration: 400,
          calls: [
            [{
              opacity: opacity,
              left: left,
            }]
          ],
        });
      }
      return (
        <div id="components" style={{height: this.state.componentsListHeight}}>
          {this.state.isComponentsListEmpty === null ?
            <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
              {!_.isUndefined(db.components.deref()) ? 
                <div>
                  <ComponentsList
                    data={db.components.deref()}
                    showDetails={this.showDetails}
                    closeDetails={this.closeDetails}
                    id={this.state.detailsId}
                    height={this.state.componentsListHeight}/>
          
                  <VelocityComponent animation={this.state.detailsShown ? 'fadeIn' : 'fadeOut'}>
                    <ComponentsOverlay
                      data={db.components.deref()}
                      id={this.state.detailsId}
                      closeDetails={this.closeDetails}/>
                  </VelocityComponent>
                </div> 
              : undefined}
              {_.isUndefined(db.components.deref()) ? 
                <Loader />
              : undefined}
            </VelocityTransitionGroup>
          : 
            <div className="padding-15">
              <i className="fa fa-exclamation-triangle"></i> &nbsp;
              There are no components for this device
            </div>
          }
        </div>
      );
    }
  };

  return Components;
});
