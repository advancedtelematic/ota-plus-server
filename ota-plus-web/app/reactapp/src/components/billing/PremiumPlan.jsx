import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import InfoForm from './InfoForm';
import { Form } from 'formsy-react';
import { FlatButton } from 'material-ui';

@observer
class PremiumPlan extends Component {
    constructor(props) {
        super(props);
        this.submitForm = this.submitForm.bind(this);
    }
    submitForm() {
        
    }
    render() {
        const { userStore } = this.props;
        const billingInfo = userStore.user.profile.billingInfo ||
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
            <div id="billing-plans-premium" className="billing-plans">
                <div className="billing-plan billing-plan-premium">
                    <div className="billing-plan-header">Premium</div>
                    <div className="billing-plan-body">
                        <div className="text-center">
                            <br /><br />
                            <img src="/assets/img/icons/crown.png" style={{width: 120}} alt=""/><br /><br />
                            Thank you for upgrading to Premium! <br /><br />
                            Your account will be billed monthly based on your usage.
                        </div>
                    </div>
                </div>
                <div className="billing-plan billing-plan-premium-form">
                    <div className="billing-plan-header">Billing information</div>
                    <div className="billing-plan-body">
                        <Form
                            onValidSubmit={this.submitForm}>
                            <InfoForm 
                                billingInfo={billingInfo}
                            />
                            <FlatButton
                                label="Update details"
                                type="submit"
                                className="btn-main"
                            />
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}

PremiumPlan.propTypes = {
    userStore: PropTypes.object.isRequired
}

export default PremiumPlan;