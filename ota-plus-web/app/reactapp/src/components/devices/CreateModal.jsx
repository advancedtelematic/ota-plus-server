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
        this.createHandler = new AsyncStatusCallbackHandler(props.devicesStore, 'devicesCreateAsync', this.handleResponse.bind(this));
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
        let data = serialize(document.querySelector('#device-create-form'), { hash: true });
        data.deviceId = data.deviceName;
        data.deviceType = "Other";
        this.props.devicesStore.createDevice(data);
    }
    handleResponse() {
        let id = this.props.devicesStore.devicesCreateAsync.data;
        this.context.router.push(`/device/${id}`);
    }
    render() {
        const { shown, hide, devicesStore } = this.props;
        const form = (
            <Form
                onValid={this.enableButton.bind(this)}
                onInvalid={this.disableButton.bind(this)}
                onValidSubmit={this.submitForm.bind(this)}
                id="device-create-form">
                <AsyncResponse 
                    handledStatus="error"
                    action={devicesStore.devicesCreateAsync}
                    errorMsg={(devicesStore.devicesCreateAsync.data ? devicesStore.devicesCreateAsync.data.description : null)}
                />
                <div className="row">
                    <div className="col-xs-12">
                        <FormsyText
                            name="deviceName"
                            id="new-device-name"
                            floatingLabelText="Device name"
                            underlineFocusStyle={!window.atsGarageTheme || window.otaPlusMode ? {borderColor: '#fa9872'} : {}}
                            floatingLabelFocusStyle={!window.atsGarageTheme || window.otaPlusMode ? {color: '#fa9872'} : {}}
                            className="input-wrapper"
                            disabled={devicesStore.devicesCreateAsync.isFetching}
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
                                className="link-cancel"
                                id="add-new-device-cancel">
                                Cancel
                            </a>
                            <FlatButton
                                label="Add device"
                                type="submit"
                                className="btn-main"
                                id="add-new-device-confirm"
                                disabled={this.submitButtonDisabled || devicesStore.devicesCreateAsync.isFetching}
                            />
                        </div>
                    </div>
                </div>
            </Form>
        );
        return (
            <Modal 
                title="Add new device"
                className="create-device-modal"
                content={form}
                shown={shown}
            />
        );
    }
}

CreateModal.contextTypes = {
    router: React.PropTypes.object.isRequired
}

CreateModal.propTypes = {
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    devicesStore: PropTypes.object.isRequired
}

export default CreateModal;