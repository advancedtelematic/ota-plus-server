define(function(require) {
  var React = require('react'),
      SotaDispatcher = require('sota-dispatcher'),
      VelocityTransitionGroup = require('mixins/velocity/velocity-transition-group');
      
  class BillingFree extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div className="billing-plans">
          <div className="billing-plan">
            <div className="billing-plan-header">Current</div>
            <div className="billing-plan-body">
              <ul className="billing-features">
                <li>20 devices</li>
                <li>Community support only</li>
              </ul>
              <div className="billing-price">
                0 €
              </div>
              <hr />
              <div className="text-center">
                The <strong>BASIC</strong> account allows <br />
                up to 20 active devices, with<br />
                community support only.
              </div>
            </div>
          </div>
          <div className="billing-plan billing-plan-premium">
            <div className="billing-plan-header">Premium</div>
            <div className="billing-plan-body">
              <ul className="billing-features">
                <li>Unlimited devices</li>
                <li>Premium support</li>
              </ul>
              <div className="billing-price">
                0.99 €
              </div>
              <hr />
              <div className="lightgrey text-center">
                per device (after the first 20 devices)
              </div>
              <div className="text-center">
                <button className="btn btn-confirm" onClick={this.props.openBillingEditInfoModal}>Upgrade</button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  BillingFree.propTypes = {
    openBillingEditInfoModal: React.PropTypes.func.isRequired
  };

  return BillingFree;
});
