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
        this.renameHandler = new AsyncStatusCallbackHandler(props.devicesStore, 'devicesRenameAsync', this.handleResponse.bind(this));
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
        let data = serialize(document.querySelector('#device-rename-form'), { hash: true });
        let device = this.props.devicesStore._getDevice(this.props.deviceId);
        this.props.devicesStore.renameDevice(this.props.deviceId, {
            deviceId: data.deviceName,
            deviceName: data.deviceName,
            deviceType: "Other"
        });
    }
    handleResponse() {
        let data = serialize(document.querySelector('#device-rename-form'), { hash: true });
        this.props.devicesStore._updateDeviceData(this.props.deviceId, data);
        this.props.hide();
    }
    render() {
        const { shown, hide, deviceId, devicesStore } = this.props;
        const device = deviceId ? devicesStore._getDevice(deviceId) : null;
        const form = (
            device ?
                <Form
                    onValid={this.enableButton.bind(this)}
                    onInvalid={this.disableButton.bind(this)}
                    onValidSubmit={this.submitForm.bind(this)}
                    id="device-rename-form">
                    <AsyncResponse 
                        handledStatus="error"
                        action={devicesStore.devicesRenameAsync}
                        errorMsg={(devicesStore.devicesRenameAsync.data ? devicesStore.devicesRenameAsync.data.description : null)}
                    />
                    <div className="row">
                        <div className="col-xs-12">
                            <FormsyText
                                name="deviceName"
                                value={device.deviceName}
                                floatingLabelText="Device name"
                                className="input-wrapper"
                                underlineFocusStyle={!window.atsGarageTheme || window.otaPlusMode ? {borderColor: '#fa9872'} : {}}
                                floatingLabelFocusStyle={!window.atsGarageTheme || window.otaPlusMode ? {color: '#fa9872'} : {}}
                                id="rename-device-new-name"
                                disabled={devicesStore.devicesRenameAsync.isFetching}
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
                                    id="rename-device-cancel">
                                    Cancel
                                </a>
                                <FlatButton
                                    label="Rename device"
                                    type="submit"
                                    className="btn-main"
                                    id="rename-device-confirm"
                                    disabled={this.submitButtonDisabled || devicesStore.devicesRenameAsync.isFetching}
                                />
                            </div>
                        </div>
                    </div>
                </Form>
            : 
                <span/>
        );
        return (
            <Modal 
                title="Rename device"
                className="rename-device-modal"
                content={form}
                shown={shown}
            />
        );
    }
}

RenameModal.propTypes = {
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    deviceId: PropTypes.string,
    devicesStore: PropTypes.object.isRequired
}

export default RenameModal;