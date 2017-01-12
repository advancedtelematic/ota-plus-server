define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      BillingHeader = require('./billing-header'),
      BillingPremium = require('./billing-premium'),
      BillingQuote = require('./billing-quote'),
      BillingPlans = require('./billing-plans'),
      Loader = require('../loader'),
      NoAccess = require('../noaccess');

  class Billing extends React.Component {
    constructor(props) {
      super(props);
      db.user.addWatch("poll-user-billing-page", _.bind(this.forceUpdate, this, null));
    }
    render() {
      const user = db.user.deref();
      return (
        <span>
          <VelocityTransitionGroup enter={{animation: "fadeIn", display: "flex"}} leave={{animation: "fadeOut", display: "flex"}} runOnMount={true}>
            {this.props.hasBetaAccess && !_.isUndefined(user) ?
              <div className="content-wrapper">
                <BillingHeader />
                <div className="billing-content">
                  {user.plan == "premium" ? 
                    <BillingPremium />
                  : 
                    user.plan == "quote" ?
                      <BillingQuote />
                    :
                      <BillingPlans 
                        user={user}/>
                  }
                </div>
              </div>
            : <NoAccess />}
          </VelocityTransitionGroup>
          {_.isUndefined(user) ?
            <Loader />
          : undefined}
        </span>
      );
    }
  }
  return Billing;
});
