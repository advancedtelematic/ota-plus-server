import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Modal, AsyncResponse } from '../../partials';
import { AsyncStatusCallbackHandler } from '../../utils';
import { Form } from 'formsy-react';
import { FormsyText } from 'formsy-material-ui/lib';
import { FlatButton } from 'material-ui';
import serialize from 'form-serialize';

@observer
class CreateModal extends Component {
    @observable submitButtonDisabled = true;

    constructor(props) {
        super(props);
        this.createHandler = new AsyncStatusCallbackHandler(props.campaignsStore, 'campaignsCreateAsync', this.handleResponse.bind(this));
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
        this.props.campaignsStore.createCampaign(
            serialize(document.querySelector('#campaign-create-form'), { hash: true })
        );
    }
    handleResponse() {
        const id = this.props.campaignsStore.campaignsCreateAsync.data;
        this.props.hide(id);
    }
    render() {
        const { shown, hide, campaignsStore } = this.props;
        const form = (
            <Form
                onValid={this.enableButton.bind(this)}
                onInvalid={this.disableButton.bind(this)}
                onValidSubmit={this.submitForm.bind(this)}
                id="campaign-create-form">
                <AsyncResponse 
                    handledStatus="error"
                    action={campaignsStore.campaignsCreateAsync}
                    errorMsg={(campaignsStore.campaignsCreateAsync.data ? campaignsStore.campaignsCreateAsync.data.description : null)}
                />
                <div className="row">
                    <div className="col-xs-12">
                        <FormsyText
                            name="name"
                            floatingLabelText="Campaign name"
                            className="input-wrapper"
                            underlineFocusStyle={!window.atsGarageTheme || window.otaPlusMode ? {borderColor: '#fa9872'} : {}}
                            floatingLabelFocusStyle={!window.atsGarageTheme || window.otaPlusMode ? {color: '#fa9872'} : {}}
                            id="add-new-campaign-name"
                            updateImmediately
                            required
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="body-actions">
                            <a href="#"
                                onClick={hide.bind(this, null)}
                                className="link-cancel"
                                id="add-new-campaign-cancel">
                                Cancel
                            </a>
                            <FlatButton
                                label="Add campaign"
                                type="submit"
                                className="btn-main"
                                id="add-new-campaign-confirm"
                                disabled={this.submitButtonDisabled || campaignsStore.campaignsCreateAsync.isFetching}
                            />
                        </div>
                    </div>
                </div>
            </Form>
        );
        return (
            <Modal 
                title="Add new campaign"
                content={form}
                shown={shown}
                className="create-campaign-modal"
            />
        );
    }
}

CreateModal.propTypes = {
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    campaignsStore: PropTypes.object.isRequired
}

export default CreateModal;