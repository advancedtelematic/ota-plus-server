define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      BillingHeader = require('./billing-header'),
      BillingPremium = require('./billing-premium'),
      BillingQuote = require('./billing-quote'),
      BillingPlans = require('./billing-plans'),
      NoAccess = require('../noaccess');

  class Billing extends React.Component {
    constructor(props) {
      super(props);
      db.user.addWatch("poll-user-billing-page", _.bind(this.forceUpdate, this, null));
    }
    render() {
      const user = db.user.deref();
      return (
        this.props.hasBetaAccess && !_.isUndefined(user) ?
          <div id="billing">
            <BillingHeader />
            <div className="billing-content">
              {user.plan == "premium" ? 
                <BillingPremium />
              : 
                user.plan == "quote" ?
                  <BillingQuote />
                :
                  <BillingPlans />
              }
            </div>
          </div>
        :
          <NoAccess />
      );
    }
  }
  return Billing;
});
