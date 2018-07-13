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
class EditCampaignModal extends Component {
    @observable submitButtonDisabled = true;

    constructor(props) {
        super(props);
        this.renameHandler = new AsyncStatusCallbackHandler(props.campaignsStore, 'campaignsRenameAsync', this.handleRenameResponse.bind(this));
    }
    enableButton() {
        this.submitButtonDisabled = false;
    }
    disableButton() {
        this.submitButtonDisabled = true;
    }
    submitForm(e) {
        if(e) e.preventDefault();
        const { campaign } = this.props.campaignsStore;
        const formData = serialize(document.querySelector('#edit-name-form'), { hash: true });
        this.props.campaignsStore.renameCampaign(campaign.id, { name: formData.campaignName })
    }
    handleRenameResponse() {
        this.props.hide();
    }
    render() {
        const { campaignsStore, shown, hide, modalTitle, defaultValue } = this.props;
        const form = (
            <Form
                onSubmit={this.submitForm.bind(this)}
                id="edit-name-form">
                <AsyncResponse
                    handledStatus="error"
                    action={campaignsStore.campaignsRenameAsync}
                    errorMsg={(campaignsStore.campaignsRenameAsync.data ? campaignsStore.campaignsRenameAsync.data.description : null)}
                />
                <div className="row">
                    <div className="col-xs-12">
                        <FormInput
                            onValid={this.enableButton.bind(this)}
                            onInvalid={this.disableButton.bind(this)}
                            name="campaignName"
                            className="input-wrapper"
                            isEditable={!campaignsStore.campaignsRenameAsync.isFetching}
                            title={"Campaign name"}
                            label={"Campaign name"}
                            placeholder={"Name"}
                            id="campaign-name"
                            defaultValue={defaultValue}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="body-actions">
                            <button
                                disabled={this.submitButtonDisabled || campaignsStore.campaignsRenameAsync.isFetching}
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

export default EditCampaignModal;