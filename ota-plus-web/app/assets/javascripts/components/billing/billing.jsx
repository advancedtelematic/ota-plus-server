define(function(require) {
  var React = require('react'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      BillingHeader = require('./billing-header'),
      BillingPlans = require('./billing-plans')
      NoAccess = require('../noaccess');

  class Billing extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        this.props.hasBetaAccess ?
          <div id="billing">
            <BillingHeader />
            <div className="billing-content">
              <BillingPlans />
            </div>
          </div>
        :
          <NoAccess />
      );
    }
  }
  return Billing;
});
