import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'underscore';
import { Header as BaseHeader, Loader } from '../../partials';
import { FadeAnimation, AsyncStatusCallbackHandler } from '../../utils';

@observer
class Header extends Component {
    @observable renameDisabled = true;
    @observable oldDeviceName = '';
    @observable newDeviceName = '';
    @observable newDeviceNameLength = 0;

    constructor(props) {
        super(props);
        this.enableDeviceRename = this.enableDeviceRename.bind(this);
        this.cancelDeviceRename = this.cancelDeviceRename.bind(this);
        this.renameDevice = this.renameDevice.bind(this);
        this.focusTextInput = this.focusTextInput.bind(this);
        this.userTypesName = this.userTypesName.bind(this);
        this.keyPressed = this.keyPressed.bind(this);
        this.renameHandler = new AsyncStatusCallbackHandler(props.devicesStore, 'devicesRenameAsync', this.handleResponse.bind(this));
    }
    componentWillReceiveProps(nextProps) {
        const { device } = nextProps.devicesStore;
        if(!_.isEmpty(device)) {
            this.renameDisabled = true;
            this.oldDeviceName = device.deviceName;
            this.newDeviceName = device.deviceName;
            this.newDeviceNameLength = device.deviceName.length;
        }
    }
    componentWillUnmount() {
        this.renameHandler();
    }
    backButtonAction() {
        window.history.go(-1);
    }
    enableDeviceRename() {
        this.renameDisabled = false;
        this.focusTextInput();
    }
    cancelDeviceRename() {
        const { device } = this.props.devicesStore;
        this.renameDisabled = true; 
        this.newDeviceName = this.oldDeviceName;
        this.newDeviceNameLength = this.oldDeviceName.length;
        this.focusTextInput();
    }
    userTypesName(e) {
        this.newDeviceName = e.target.value;
        this.newDeviceNameLength = e.target.value.length;
    }
    keyPressed(e) {
        if(e.key === 'Enter') {
            this.renameDevice();
        }
    }
    renameDevice() {
        const { device } = this.props.devicesStore;
        this.props.devicesStore.renameDevice(device.uuid, {
            deviceId: this.newDeviceName,
            deviceName: this.newDeviceName,
            deviceType: "Other"
        });
    }
    handleResponse() {
        this.renameDisabled = true;
        this.oldDeviceName = this.newDeviceName;
        this.focusTextInput();
    }
    focusTextInput() {
        if (this.renameDisabled) {
            this.deviceNameInput.setAttribute('disabled','true');
        } else {
            this.deviceNameInput.removeAttribute('disabled');
            this.deviceNameInput.focus();
        }
    }
    render() {
        const { devicesStore, showQueueModal, queueButtonRef } = this.props;
        const { device } = devicesStore;
        const lastSeenDate = new Date(device.lastSeen);
        const createdDate = new Date(device.createdAt);
        const activatedDate = new Date(device.activatedAt);
        let deviceStatus = 'Status unknown';
        switch(device.deviceStatus) {
            case 'UpToDate':
                deviceStatus = 'Device synchronized';
            break;
            case 'Outdated':
                deviceStatus = 'Device unsynchronized';
            break;
            case 'Error':
                deviceStatus = 'Installation error';
            break;
            default:
            break;
        }
        return (
            <BaseHeader
                title={
                    <FadeAnimation>
                        {!devicesStore.devicesOneFetchAsync.isFetching ?
                            <span id="device-name" className="device-name">
                                <input type="text"
                                   ref={(input) => {this.deviceNameInput = input}}
                                   size={this.newDeviceName.length + 5}
                                   maxLength={100}
                                   disabled
                                   onKeyPress={this.keyPressed}
                                   value={this.newDeviceName} onChange={this.userTypesName} />

                                {this.renameDisabled ?
                                    <i className="fa fa-pencil" aria-hidden="true" onClick={this.enableDeviceRename} />
                                :
                                    <div className="icons">
                                        {this.newDeviceNameLength ?
                                            <i className="fa fa-check-square" aria-hidden="true" onClick={this.renameDevice} />
                                        :
                                            null
                                        }
                                        <i className="fa fa-window-close" aria-hidden="true" onClick={this.cancelDeviceRename} />
                                    </div>
                                }
                            </span>
                        :
                            null
                        }
                    </FadeAnimation>
                }
                backButtonShown={true}
                backButtonAction={this.backButtonAction}>
                <FadeAnimation>
                    {!devicesStore.devicesOneFetchAsync.isFetching ?
                        <span className="pull-right">
                            <button className="queue-button" id="queue-button" onClick={showQueueModal} ref={queueButtonRef}>
                                <div className={"status status-" + device.deviceStatus} id={"status=" + device.deviceStatus}></div>
                            </button>
                            <div className="dates">
                                <div className="date director">
                                    { device.isDirector ? 
                                        <img src="/assets/img/icons/white/director-device-icon.png" alt="Director" id="director-device-icon" />
                                    :
                                        null
                                    }
                                </div>                               
                                <div className="date" id="created-info">
                                    <span className="date-label">Created</span>
                                    <div className="date-desc">
                                        {createdDate.toDateString() + ' ' + createdDate.toLocaleTimeString()}
                                    </div>
                                </div>
                                <div className="date" id="activated-info">
                                    <span className="date-label">Activated</span>
                                    <div className="date-desc">
                                        {device.activatedAt !== null ?
                                            <span>
                                                {activatedDate.toDateString() + ' ' + activatedDate.toLocaleTimeString()}
                                            </span>
                                        :
                                            <span>
                                                Device not activated
                                            </span>
                                        }
                                    </div>
                                </div>
                                <div className="date" id="last-seen-online-info">
                                    <span className="date-label">Last seen online</span>
                                    <div className="date-desc">
                                        {deviceStatus !== 'Status unknown' ?
                                            <span>{lastSeenDate.toDateString() + ' ' + lastSeenDate.toLocaleTimeString()}</span>
                                        :
                                            <span>Never seen online</span>
                                        }
                                    </div>
                                </div>
                            </div>
                        </span>
                    :
                        null
                    }
                </FadeAnimation>
            </BaseHeader>
        );
    }
}

Header.propTypes = {
    devicesStore: PropTypes.object.isRequired,
    showQueueModal: PropTypes.func.isRequired,
    queueButtonRef: PropTypes.func.isRequired,
}

export default Header;