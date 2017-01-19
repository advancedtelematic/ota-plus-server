define(function(require) {
  var React = require('react');
      
  class BillingQuote extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div id="billing-plans-quote" className="billing-plans">
          <div className="billing-plan billing-plan-premium">
            <div className="billing-plan-header">Premium</div>
            <div className="billing-plan-body">
              <div className="text-center margin-top-40">
                <img src="/assets/img/icons/crown.png" style={{width: 120}} alt=""/>

                <div className="margin-top-40">
                  Request received
                </div>
                <div className="margin-top-20">
                  Thank you for your interest in a <strong>PREMIUM</strong> <br />
                  subscription. We will be in touch shortly with <br />
                  a quote/purchase order to sign.
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return BillingQuote;
});
