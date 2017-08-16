import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Modal, AsyncResponse } from '../../partials';
import { Form } from 'formsy-react';
import { FormsyText } from 'formsy-material-ui/lib';
import { FlatButton } from 'material-ui';
import serialize from 'form-serialize';
import { AsyncStatusCallbackHandler } from '../../utils';

@observer
class RenameModal extends Component {
    @observable submitButtonDisabled = true;

    constructor(props) {
        super(props);
        this.renameHandler = new AsyncStatusCallbackHandler(props.campaignsStore, 'campaignsRenameAsync', this.handleResponse.bind(this));
    }
    componentWillUnmount() {
        this.renameHandler();
    }
    enableButton() {
        this.submitButtonDisabled = false;
    }
    disableButton() {
        this.submitButtonDisabled = true;
    }
    submitForm() {
        let data = serialize(document.querySelector('#campaign-rename-form'), { hash: true });
        let campaign = this.props.campaignsStore._getCampaign(this.props.campaignId);
        this.props.campaignsStore.renameCampaign(this.props.campaignId, data);
    }
    handleResponse() {
        let data = serialize(document.querySelector('#campaign-rename-form'), { hash: true });
        let campaign = this.props.campaignsStore._getCampaign(this.props.campaignId);
        this.props.campaignsStore._updateTufCampaignData(this.props.campaignId, data);

        this.props.hide();
    }
    render() {
        const { shown, hide, campaignsStore, campaignId } = this.props;
        const campaign = campaignId ? campaignsStore._getCampaign(campaignId) : null;
        const form = (
            campaign ?
                <Form
                    onValid={this.enableButton.bind(this)}
                    onInvalid={this.disableButton.bind(this)}
                    onValidSubmit={this.submitForm.bind(this)}
                    id="campaign-rename-form">
                    <AsyncResponse 
                        handledStatus="error"
                        action={campaignsStore.campaignsRenameAsync}
                        errorMsg={(campaignsStore.campaignsRenameAsync.data ? campaignsStore.campaignsRenameAsync.data.description : null)}
                    />
                    <div className="row">
                        <div className="col-xs-12">
                            <FormsyText
                                name="name"
                                value={campaign.name}
                                floatingLabelText="Campaign name"
                                className="input-wrapper"
                                updateImmediately
                                required
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="body-actions">
                                <a href="#"
                                    onClick={hide}
                                    className="link-cancel">
                                    Cancel
                                </a>
                                <FlatButton
                                    label="Rename campaign"
                                    type="submit"
                                    className="btn-main"
                                    disabled={this.submitButtonDisabled}
                                />
                            </div>
                        </div>
                    </div>
                </Form>
            :
                <span />
        );
        return (
            <Modal 
                title="Rename campaign"
                content={form}
                shown={shown}
                className="rename-campaign-modal"
            />
        );
    }
}

RenameModal.propTypes = {
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    campaignId: PropTypes.string,
    campaignsStore: PropTypes.object.isRequired
}

export default RenameModal;