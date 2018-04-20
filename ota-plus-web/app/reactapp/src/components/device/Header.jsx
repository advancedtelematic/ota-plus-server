import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'underscore';
import { Header as BaseHeader, Loader } from '../../partials';
import { FadeAnimation, AsyncStatusCallbackHandler } from '../../utils';
import NetworkInfo from './NetworkInfo';

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
        const device = nextProps.device;
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
    enableDeviceRename(e) {
        if (this.renameDisabled) {
            this.renameDisabled = false;
            this.focusTextInput();
            e.target.classList.add('hide')
        }
    }
    cancelDeviceRename() {
        this.renameDisabled = true; 
        this.newDeviceName = this.oldDeviceName;
        this.newDeviceNameLength = this.oldDeviceName.length;
        this.focusTextInput();
        this.clickableArea.classList.remove('hide');
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
        const { devicesStore, device } = this.props;
        this.clickableArea.classList.remove('hide');
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
        const { devicesStore, device, showQueueModal, queueButtonRef, backButtonAction } = this.props;
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
                            <div id="device-name" className="device-name">

                                <div onClick={this.enableDeviceRename}
                                    ref={(clickableArea) => {this.clickableArea = clickableArea}}
                                    className="clickable-area"
                                    style={{width: '85%', height: '50px', position: 'absolute'}}/>

                                <input type="text"
                                ref={(input) => {this.deviceNameInput = input}}
                                disabled
                                onKeyPress={this.keyPressed}
                                value={this.newDeviceName} onChange={this.userTypesName} />

                                {this.renameDisabled ?
                                    <img src="/assets/img/icons/white/Rename.svg" className="edit" alt="Icon" style={{cursor: 'auto'}} />
                                :
                                    <div className="icons">
                                        {this.newDeviceNameLength ?
                                            <img src="/assets/img/icons/white/Tick.svg" className="rename" alt="Icon" onClick={this.renameDevice} />
                                        :
                                            null
                                        }
                                        <img src="/assets/img/icons/white/X.svg" alt="Icon" className="cancel" onClick={this.cancelDeviceRename} />
                                    </div>
                                }
                            </div>
                        :
                            null
                        }
                    </FadeAnimation>
                }
                device={device}
                backButtonShown={true}
                backButtonAction={backButtonAction}>
                <FadeAnimation>
                    {!devicesStore.devicesOneFetchAsync.isFetching ?
                        <span>
                            <div className="device-info-container">
                                <div className="device-info-items">
                                    <NetworkInfo
                                        data={devicesStore.deviceNetworkInfo}
                                    />
                                    <div className="device-info-item" id="created-info">
                                        <span className="device-info-label">Created</span>
                                        <div className="device-info-desc">
                                            {createdDate.toDateString() + ' ' + createdDate.toLocaleTimeString()}
                                        </div>
                                    </div>
                                    <div className="device-info-item" id="activated-info">
                                        <span className="device-info-label">Activated</span>
                                        <div className="device-info-desc">
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
                                    <div className="device-info-item last-seen" id="last-seen-online-info">
                                        <span className="device-info-label">Last seen online</span>
                                        <div className="device-info-desc">
                                            {deviceStatus !== 'Status unknown' ?
                                                <span>{lastSeenDate.toDateString() + ' ' + lastSeenDate.toLocaleTimeString()}</span>
                                            :
                                                <span>Never seen online</span>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="action-buttons">
                                    <button className="queue-button" id="queue-button" onClick={showQueueModal} ref={queueButtonRef}>
                                    </button>
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