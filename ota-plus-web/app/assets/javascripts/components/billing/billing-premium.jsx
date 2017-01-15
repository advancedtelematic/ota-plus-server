define(function(require) {
  var React = require('react'),
      serializeForm = require('mixins/serialize-form'),
      SotaDispatcher = require('sota-dispatcher'),
      BillingEditInfoForm = require('./billing-edit-info-form'),
      Responses = require('../responses');
      
  class BillingPremium extends React.Component {
    constructor(props) {
      super(props);
    }
    handleSubmit(e) {
      e.preventDefault();
      var data = serializeForm(this.refs.form);
      SotaDispatcher.dispatch({
        actionType: 'update-user-billing',
        data: data
      });
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
          <div className="billing-plan billing-plan-premium-form">
            <div className="billing-plan-header">Billing information</div>
            <div className="billing-plan-body">
              <form ref='form' onSubmit={this.handleSubmit.bind(this)}>
                <Responses 
                  action="update-user-billing" 
                  successText="Billing info has been updated." 
                  errorText="Error occured during billing info updating."/>
                <BillingEditInfoForm 
                  billingInfo={this.props.billingInfo}/>
                <button type="submit" className="btn btn-confirm pull-right">Submit</button>
              </form>
            </div>
          </div>
        </div>
      );
    }
  };

  BillingPremium.propTypes = {
    billingInfo: React.PropTypes.object.isRequired
  };

  return BillingPremium;
});
