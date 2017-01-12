define(function(require) {
  var React = require('react');
      
  class BillingPremium extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div id="billing-plans-premium" className="billing-plans">
          <div className="billing-plan billing-plan-premium">
            <div className="billing-plan-header">Premium</div>
            <div className="billing-plan-body">
              <div className="text-center margin-top-40">
                <img src="/assets/img/icons/crown.png" style={{width: 120}} alt=""/>

                <div className="margin-top-40">
                  Your subscription will be automatically <br />
                  renewed on <strong>xx.xx.xxxx</strong> and we will <br />
                  withdraw <strong>XX €</strong> from your account.
                </div>
                <div className="margin-top-20">
                  <strong>Account informations</strong><br />
                  Your Credit Card is currently being used for payment.
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return BillingPremium;
});
