import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import Modal from './Modal';
import AsyncResponse from './AsyncResponse';
import { Form } from './Form';
import FormInput from './FormInput';
import serialize from 'form-serialize';
import { AsyncStatusCallbackHandler } from '../utils';
import _ from 'underscore';

@observer
class EditModal extends Component {
    @observable submitButtonDisabled = true;

    constructor(props) {
        super(props);
        this.renameHandler = new AsyncStatusCallbackHandler(props.devicesStore, 'devicesRenameAsync', this.handleRenameResponse.bind(this));
    }
    enableButton() {
        this.submitButtonDisabled = false;
    }
    disableButton() {
        this.submitButtonDisabled = true;
    }
    submitForm(e) {
        if(e) e.preventDefault();
        const formData = serialize(document.querySelector('#edit-name-form'), { hash: true });
        this.props.devicesStore.renameDevice(this.props.device.uuid, {
            deviceName: formData.deviceName,
            deviceType: "Other"
        });
    }
    handleRenameResponse() {
        this.props.hide();
    }
    render() {
        const { devicesStore, shown, hide, modalTitle, device } = this.props;
        const form = (
            <Form                
                onSubmit={this.submitForm.bind(this)}
                id="edit-name-form">
                <AsyncResponse 
                    handledStatus="error"
                    action={devicesStore.devicesRenameAsync}
                    errorMsg={(devicesStore.devicesRenameAsync.data ? devicesStore.devicesRenameAsync.data.description : null)}
                />
                <div className="row">
                    <div className="col-xs-12">
                        <FormInput
                            onValid={this.enableButton.bind(this)}
                            onInvalid={this.disableButton.bind(this)}
                            name="deviceName"
                            className="input-wrapper"
                            isEditable={!devicesStore.devicesRenameAsync.isFetching}
                            title={"Device name"}
                            label={"Device name"}
                            placeholder={"Name"}
                            id="device-name"
                            defaultValue={device.deviceName}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="body-actions">
                            <button
                                disabled={this.submitButtonDisabled || devicesStore.devicesRenameAsync.isFetching}
                                className="btn-primary"
                                id="add"
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
            </Form>
        );
        return (
            <Modal 
                title={modalTitle}
                topActions={
                    <div className="top-actions flex-end">
                        <div className="modal-close" id="close-modal" onClick={hide}>
                            <img src="/assets/img/icons/close.svg" alt="Icon" />
                        </div>
                    </div>
                }
                className="edit-name-modal"
                content={form}
                shown={shown}
            />
        );
    }
}

export default EditModal;