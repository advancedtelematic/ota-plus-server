import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Modal, AsyncResponse } from '../../../partials';
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
                onValid={this.enableButton.bind(this)}
                onInvalid={this.disableButton.bind(this)}
                onValidSubmit={this.submitForm.bind(this)}
                id="provisioning-key-create-form">
                <AsyncResponse 
                    handledStatus="error"
                    action={provisioningStore.provisioningKeyCreateAsync}
                    errorMsg={(provisioningStore.provisioningKeyCreateAsync.data ? provisioningStore.provisioningKeyCreateAsync.data.description : null)}
                />
                <div className="row">
                    <div className="col-xs-12">
                        <FormsyText
                            name="description"
                            floatingLabelText="Description"
                            className="input-wrapper"
                            id="add-new-key-description"
                            underlineFocusStyle={!window.atsGarageTheme || window.otaPlusMode ? {borderColor: '#fa9872'} : ''}
                            floatingLabelFocusStyle={!window.atsGarageTheme || window.otaPlusMode ? {color: '#fa9872'} : ''}
                            disabled={provisioningStore.provisioningKeyCreateAsync.isFetching}
                            updateImmediately
                            required
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
                            <FlatButton
                                label="Add key"
                                type="submit"
                                className="btn-main"
                                id="add-new-key-confirm﻿"
                                disabled={this.submitButtonDisabled || provisioningStore.provisioningKeyCreateAsync.isFetching}
                            />
                        </div>
                    </div>
                </div>
            </Form>
        );
        return (
            <Modal 
                title="Add new key"
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