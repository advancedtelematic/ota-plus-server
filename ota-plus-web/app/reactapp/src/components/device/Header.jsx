import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'underscore';
import { Header as BaseHeader, Loader, ConfirmationModal } from '../../partials';
import { FadeAnimation, AsyncStatusCallbackHandler } from '../../utils';
import NetworkInfo from './NetworkInfo';

@observer
class Header extends Component {
    @observable renameDisabled = true;
    @observable oldDeviceName = '';
    @observable newDeviceName = '';
    @observable newDeviceNameLength = 0;
    @observable deleteConfirmationShown = false;

    constructor(props) {
        super(props);
        this.enableDeviceRename = this.enableDeviceRename.bind(this);
        this.cancelDeviceRename = this.cancelDeviceRename.bind(this);
        this.renameDevice = this.renameDevice.bind(this);
        this.focusTextInput = this.focusTextInput.bind(this);
        this.userTypesName = this.userTypesName.bind(this);
        this.keyPressed = this.keyPressed.bind(this);
        this.deleteDevice = this.deleteDevice.bind(this);
        this.showDeleteConfirmation = this.showDeleteConfirmation.bind(this);
        this.hideDeleteConfirmation = this.hideDeleteConfirmation.bind(this);
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
    showDeleteConfirmation() {
        this.deleteConfirmationShown = true;
    }
    hideDeleteConfirmation() {
        this.deleteConfirmationShown = false;
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
    deleteDevice(e) {
        if(e) e.preventDefault();
        this.props.devicesStore.deleteDevice(this.props.devicesStore.device.uuid).then(() => {
            this.context.router.push('/devices');
        });
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
                            <div id="device-name" className="page-header__device-name">

                                <div className="rename-box">
                                    <div onClick={this.enableDeviceRename}
                                        ref={(clickableArea) => {this.clickableArea = clickableArea}}
                                        className="rename-box__clickable-area">
                                    </div>

                                    <input 
                                        className="rename-box__input"
                                        type="text"
                                        ref={(input) => {this.deviceNameInput = input}}
                                        disabled
                                        onKeyPress={this.keyPressed}
                                        value={this.newDeviceName} onChange={this.userTypesName} 
                                    />

                                    <div className="rename-box__actions">
                                        {this.renameDisabled ?
                                            <img src="/assets/img/icons/white/Rename.svg" className="rename-box__icon rename-box__icon--edit" alt="Icon" />
                                        :
                                            <span className="rename-box__user-actions">
                                                {this.newDeviceNameLength ?
                                                    <img src="/assets/img/icons/white/Tick.svg" className="rename-box__icon rename-box__icon--save" alt="Icon" onClick={this.renameDevice} />
                                                :
                                                    null
                                                }
                                                <img src="/assets/img/icons/white/X.svg" alt="Icon" className="rename-box__icon rename-box__icon--cancel" onClick={this.cancelDeviceRename} />
                                            </span>
                                        }
                                    </div>
                                </div>
                                
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
                            <div className="page-header__device-report">
                                <div className="page-header__device-report-items">
                                    <NetworkInfo
                                        data={devicesStore.deviceNetworkInfo}
                                    />
                                    <div className="page-header__device-report-item" id="created-info">
                                        <span className="page-header__device-report-label">Created</span>
                                        <div className="page-header__device-report-desc">
                                            {createdDate.toDateString() + ' ' + createdDate.toLocaleTimeString()}
                                        </div>
                                    </div>
                                    <div className="page-header__device-report-item" id="activated-info">
                                        <span className="page-header__device-report-label">Activated</span>
                                        <div className="page-header__device-report-desc">
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
                                    <div className="page-header__device-report-item page-header__device-report-item--last-seen" id="last-seen-online-info">
                                        <span className="page-header__device-report-label">Last seen online</span>
                                        <div className="page-header__device-report-desc">
                                            {deviceStatus !== 'Status unknown' ?
                                                <span>{lastSeenDate.toDateString() + ' ' + lastSeenDate.toLocaleTimeString()}</span>
                                            :
                                                <span>Never seen online</span>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="page-header__actions">
                                    <button className="page-header__queue-action" id="queue-button" onClick={showQueueModal} ref={queueButtonRef}></button>
                                </div>
                            </div>
                            {this.deleteConfirmationShown ?
                                <ConfirmationModal
                                    modalTitle={
                                        <div className="text-red">
                                            Delete device
                                        </div>
                                    }
                                    shown={this.deleteConfirmationShown}
                                    hide={this.hideDeleteConfirmation}
                                    deleteItem={this.deleteDevice}
                                    topText={
                                        <div className="delete-modal-top-text">
                                            Remove <b>{device.deviceName}</b> permanently?
                                        </div>
                                    }
                                    bottomText={
                                        <div className="delete-modal-bottom-text">
                                            If the device is part of any active campaigns, it won't get the updates.
                                        </div>
                                    }
                                />
                            :
                                null
                            }
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

Header.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default Header;