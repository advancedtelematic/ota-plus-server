import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Modal, AsyncResponse } from '../../partials';
import { AsyncStatusCallbackHandler } from '../../utils';
import { Form } from 'formsy-react';
import { FlatButton } from 'material-ui';
import InfoForm from './InfoForm';
import serialize from 'form-serialize';

@observer
class InfoModal extends Component {
    @observable submitButtonDisabled = true;

    constructor(props) {
        super(props);
        this.updateBillingHandler = new AsyncStatusCallbackHandler(props.userStore, 'userBillingUpdateAsync', this.props.hide);
    }
    componentWillUnmount() {
        this.updateBillingHandler();
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
        const { shown, hide, userStore } = this.props;
        const billingInfo = userStore.user.profile && userStore.user.profile.billingInfo ? 
            userStore.user.profile.billingInfo
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
        const form = (
            <Form
                onValid={this.enableButton.bind(this)}
                onInvalid={this.disableButton.bind(this)}
                onValidSubmit={this.submitForm.bind(this)}
                id="billing-update-form">
                <InfoForm 
                    billingInfo={billingInfo}
                />
                <AsyncResponse 
                    handledStatus="error"
                    action={userStore.userBillingUpdateAsync}
                    errorMsg={(userStore.userBillingUpdateAsync.data ? userStore.userBillingUpdateAsync.data.description : null)}
                />
                <div className="row">
                    <div className="col-xs-12">
                        <div className="body-actions">
                            <a href="#"
                                onClick={hide}
                                className="link-cancel">
                                Cancel
                            </a>
                            <FlatButton
                                label="Submit"
                                type="submit"
                                className="btn-main"
                                disabled={this.submitButtonDisabled || userStore.userBillingUpdateAsync.isFetching}
                            />
                        </div>
                    </div>
                </div>
            </Form>
        );
        return (
            <Modal 
                title="Fill billing information"
                content={form}
                shown={shown}
            />
        );
    }
}

InfoModal.propTypes = {
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    userStore: PropTypes.object.isRequired
}

export default InfoModal;