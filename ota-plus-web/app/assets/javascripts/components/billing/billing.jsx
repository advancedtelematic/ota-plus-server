define(function(require) {
  var React = require('react'),
      db = require('stores/db'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group'),
      BillingHeader = require('./billing-header'),
      BillingPremium = require('./billing-premium'),
      BillingQuote = require('./billing-quote'),
      BillingFree = require('./billing-free'),
      BillingEditInfoModal = require('./billing-edit-info-modal'),
      Loader = require('../loader'),
      NoAccess = require('../noaccess');

  class Billing extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isBillingEditInfoModalShown: false
      };
      this.openBillingEditInfoModal = this.openBillingEditInfoModal.bind(this);
      this.closeBillingEditInfoModal = this.closeBillingEditInfoModal.bind(this);
      db.user.addWatch("poll-user-billing-page", _.bind(this.forceUpdate, this, null));
    }
    componentWillUnmount() {
      db.user.removeWatch("poll-user-billing-page");
    }
    openBillingEditInfoModal(e) {
      if(e) e.preventDefault();
      this.setState({isBillingEditInfoModalShown: true});
    }
    closeBillingEditInfoModal(e) {
      if(e) e.preventDefault();
      this.setState({isBillingEditInfoModalShown: false});
    }
    render() {
      const user = db.user.deref();
      const billingInfo = !_.isUndefined(user) && !_.isUndefined(user.profile) && _.isObject(user.profile.billingInfo) ? 
        user.profile.billingInfo 
      : 
        {
          company: null,
          lastname: null,
          firstname: null,
          email: null,
          address: null,
          postal_code: null,
          city: null,
          country: null,
          vat_number: null
        };
      return (
        <span>
          <VelocityTransitionGroup enter={{animation: "fadeIn", display: "flex"}} leave={{animation: "fadeOut", display: "flex"}} runOnMount={true}>
            {this.props.hasBetaAccess && !_.isUndefined(user) ?
              <div className="content-wrapper">
                <BillingHeader />
                <div className="billing-content">
                  {user.profile.plan == "premium" ? 
                    <BillingPremium 
                      billingInfo={billingInfo}/>
                  : 
                    user.profile.plan == "quote" ?
                      <BillingQuote />
                    :
                      <BillingFree 
                        openBillingEditInfoModal={this.openBillingEditInfoModal}/>
                  }
                </div>
              </div>
            : <NoAccess />}
          </VelocityTransitionGroup>
          {_.isUndefined(user) ?
            <Loader />
          : undefined}
          <VelocityTransitionGroup enter={{animation: "fadeIn"}} leave={{animation: "fadeOut"}}>
            {this.state.isBillingEditInfoModalShown ?
              <BillingEditInfoModal
                closeModal={this.closeBillingEditInfoModal}
                billingInfo={billingInfo}/>
            : undefined}
          </VelocityTransitionGroup>
        </span>
      );
    }
  }
  return Billing;
});
