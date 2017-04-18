import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Form } from 'formsy-react';
import { FlatButton } from 'material-ui';
import InfoForm from './InfoForm';
import { AsyncResponse } from '../../../partials';
import { resetAsync } from '../../../utils/Common';
import serialize from 'form-serialize';

@observer
class PremiumPlan extends Component {
    @observable submitButtonDisabled = false;

    constructor(props) {
        super(props);
        this.submitForm = this.submitForm.bind(this);
        this.enableButton = this.enableButton.bind(this);
        this.disableButton = this.disableButton.bind(this);
    }
    componentWillUnmount() {
        resetAsync(this.props.userStore.userBillingUpdateAsync);
    }
    enableButton() {
        this.submitButtonDisabled = false;
    }
    disableButton() {
        this.submitButtonDisabled = true;
    }
    submitForm() {
        let data = serialize(document.querySelector('#billing-update-form'), { hash: true });
        this.props.userStore.updateBilling(data, "quote");
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
                    <div className="billing-plan-header">Details</div>
                    <div className="billing-plan-body">
                        <Form
                            onValid={this.enableButton}
                            onInvalid={this.disableButton}
                            onValidSubmit={this.submitForm}
                            id="billing-update-form">
                            <AsyncResponse
                                handledStatus="all"
                                action={userStore.userBillingUpdateAsync}
                                successMsg="Billing details updated."
                                errorMsg={(userStore.userBillingUpdateAsync.data ? userStore.userBillingUpdateAsync.data.description : "An error occured. Please try again.")}
                            />
                            <InfoForm 
                                billingInfo={billingInfo}
                            />
                            <FlatButton
                                label="Update details"
                                type="submit"
                                className="btn-main"
                                disabled={this.submitButtonDisabled || userStore.userBillingUpdateAsync.isFetching}
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