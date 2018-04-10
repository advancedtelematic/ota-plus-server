import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Modal, AsyncResponse, FormInput } from '../../../partials';
import { AsyncStatusCallbackHandler } from '../../../utils';
import { Form } from 'formsy-react';
import { FormsyText, FormsyDate } from 'formsy-material-ui/lib';
import { FlatButton } from 'material-ui';
import serialize from 'form-serialize';
import moment from 'moment';

@observer
class CreateModal extends Component {
    @observable submitButtonDisabled = true;

    constructor(props) {
        super(props);
        this.createHandler = new AsyncStatusCallbackHandler(props.provisioningStore, 'provisioningKeyCreateAsync', props.hide);
    }
    componentWillUnmount() {
        this.createHandler();
    }
    enableButton() {
        this.submitButtonDisabled = false;
    }
    disableButton() {
        this.submitButtonDisabled = true;
    }
    submitForm() {
        let data = serialize(document.querySelector('#provisioning-key-create-form'), { hash: true });
        this.props.provisioningStore.createProvisioningKey(data);
    }
    render() {
        const { shown, hide, provisioningStore } = this.props;
        const form = (
            <Form
                onValidSubmit={this.submitForm.bind(this)}
                id="provisioning-key-create-form">
                <AsyncResponse 
                    handledStatus="error"
                    action={provisioningStore.provisioningKeyCreateAsync}
                    errorMsg={(provisioningStore.provisioningKeyCreateAsync.data ? provisioningStore.provisioningKeyCreateAsync.data.description : null)}
                />
                <div className="row">
                    <div className="col-xs-12">
                        <FormInput
                            onValid={this.enableButton.bind(this)}
                            onInvalid={this.disableButton.bind(this)}
                            name="description"
                            className="input-wrapper"
                            isEditable={!provisioningStore.provisioningKeyCreateAsync.isFetching}
                            title={"Description"}
                            label={"Description"}
                            placeholder={"Description"}
                            id="add-new-key-description"
                        />
                    </div>
                    <div className="col-xs-12">
                        <FormsyDate
                            name="until"
                            floatingLabelText="Valid until"
                            className="input-wrapper date-wrapper"
                            id="add-new-key-valid-until﻿"
                            disabled={provisioningStore.provisioningKeyCreateAsync.isFetching}
                            minDate={moment().toDate()}
                            maxDate={moment().add(4, 'year').toDate()}
                            defaultDate={moment().add(1, 'year').toDate()}
                            okLabel={"Save"}
                            required
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="body-actions">
                            <a href="#"
                                onClick={hide}
                                className="link-cancel"
                                id="add-new-key-cancel">
                                Cancel
                            </a>
                            <button
                                disabled={this.submitButtonDisabled || provisioningStore.provisioningKeyCreateAsync.isFetching}
                                className="btn-primary"
                                id="add-new-key-confirm﻿"
                            >
                                Add key
                            </button>
                        </div>
                    </div>
                </div>
            </Form>
        );
        return (
            <Modal 
                title={
                    <div className="heading">
                        <div className="internal">
                            Add new key
                            <div className="top-actions flex-end">
                                <div className="modal-close" onClick={hide}>
                                    <img src="/assets/img/icons/close.svg" alt="Icon" />
                                </div>
                            </div>
                        </div>
                    </div>
                }
                className="create-provisioning-key-modal"
                content={form}
                shown={shown}
            />
        );
    }
}

CreateModal.propTypes = {
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    provisioningStore: PropTypes.object.isRequired
}

export default CreateModal;