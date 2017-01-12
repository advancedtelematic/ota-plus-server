define(function(require) {
  var React = require('react');
      
  class BillingPlans extends React.Component {
    constructor(props) {
      super(props);
    }
    handleSubmit() {
      e
    }
    render() {
      return (
        <div className="billing-plans">
          <div className="billing-plan">
            <div className="billing-plan-header">Current</div>
            <div className="billing-plan-body">
              <ul className="billing-features">
                <li>10 devices</li>
                <li>No support</li>
                <li>Limited campaigns</li>
              </ul>
              <div className="billing-price">
                0 €
              </div>
              <hr />
              <div className="text-center">
                The <strong>BASIC</strong> account provides <br />
                only an update for 10 devices <br />
                and no additional services.
              </div>
            </div>
          </div>
          <div className="billing-plan billing-plan-premium">
            <div className="billing-plan-header">Premium</div>
            <div className="billing-plan-body">
              <ul className="billing-features">
                <li>Unlimited devices</li>
                <li>Unlimited packages</li>
                <li>Unlimited campaigns</li>
              </ul>
              <div className="billing-price">
                0,99 €
              </div>
              <hr />
              <div className="lightgrey text-center">
                per device
              </div>
              <div className="text-center">
                <button className="btn btn-confirm" onClick={this.handleSubmit.bind(this)}>Upgrade</button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return BillingPlans;
});
