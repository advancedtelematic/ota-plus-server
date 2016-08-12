define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      SotaDispatcher = require('sota-dispatcher'),
      ComponentsList = require('./components-list'),
      ComponentsOverlay = require('./components-overlay'),
      Loader = require('../loader'),
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
        componentsListHeight: '400px'
      };
      this.showDetails = this.showDetails.bind(this);
      this.closeDetails = this.closeDetails.bind(this);
      this.setComponentsListHeight = this.setComponentsListHeight.bind(this);
      SotaDispatcher.dispatch({actionType: 'get-components'});
    }
    componentDidMount() {
      window.addEventListener("resize", this.setComponentsListHeight);
      this.setComponentsListHeight();
    }
    componentWillUnmount() {
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
    render() {
      console.log(this.state.componentsListHeight);
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
        </div>
      );
    }
  };

  return Components;
});
