import React, { Component, PropTypes } from 'react';
import { observable, observe } from 'mobx';
import { observer, inject } from 'mobx-react';
import { browserHistory } from 'react-router';
import _ from 'underscore';
import { MetaData, FadeAnimation } from '../utils';
import { Header } from '../partials';
import { DeviceContainer } from '../containers';
import { DeviceHeader, DeviceQueueModal, DeviceSequencerModal } from '../components/device';

const title = "Device";

@inject("stores")
@observer
class Device extends Component {
    queueAnchorEl = null;
    @observable sequencerShown = false;
    @observable queueModalShown = false;
    @observable triggerPackages = false;
    @observable activeTabId = 0;
    @observable expandedPackageName = null;

    constructor(props) {
        super(props);
        this.cancelMtuUpdate = this.cancelMtuUpdate.bind(this);
        this.selectEcu = this.selectEcu.bind(this);
        this.showSequencer = this.showSequencer.bind(this);
        this.hideSequencer = this.hideSequencer.bind(this);
        this.showQueueModal = this.showQueueModal.bind(this);
        this.hideQueueModal = this.hideQueueModal.bind(this);
        this.setQueueModalActiveTabId = this.setQueueModalActiveTabId.bind(this);
        this.installPackage = this.installPackage.bind(this);
        this.togglePackageAutoUpdate = this.togglePackageAutoUpdate.bind(this);
        this.togglePackage = this.togglePackage.bind(this);
    }
    componentWillMount() {
        const { packagesStore, devicesStore } = this.props.stores;
        packagesStore.page = 'device';
        devicesStore.fetchDevice(this.props.params.id);
        packagesStore.fetchPackages();
        devicesStore.fetchDeviceNetworkInfo(this.props.params.id);
        devicesStore.fetchMultiTargetUpdates(this.props.params.id);    
    }
    componentWillUnmount() {
        const { packagesStore, devicesStore, hardwareStore } = this.props.stores;
        devicesStore._reset();
        packagesStore._reset();
        hardwareStore._reset();
    }
    showSequencer(e) {
        if(e) e.preventDefault();
        this.hideQueueModal();
        this.sequencerShown = true;
    }
    hideSequencer(e) {
        if(e) e.preventDefault();
        this.sequencerShown = false;
    }
    showQueueModal() {
        this.queueModalShown = true;
    }
    hideQueueModal() {
        this.queueModalShown = false;
        this.setQueueModalActiveTabId(0);
    }
    setQueueModalActiveTabId(tabId) {
        const { packagesStore, devicesStore } = this.props.stores;
        this.activeTabId = tabId;
        if(tabId === 1) {
            packagesStore.fetchPackagesHistory(devicesStore.device.uuid, packagesStore.packagesHistoryFilter);
        }
    }
    cancelMtuUpdate(updateId) {
        const { devicesStore } = this.props.stores;
        let deviceId = this.props.params.id;
        let data = {
            update: updateId,
            device: deviceId
        };
        devicesStore.cancelMtuUpdate(data);
    }
    selectEcu(hardwareId, serial, filepath, type, e) {
        if(e) e.preventDefault();
        const { packagesStore, devicesStore, hardwareStore } = this.props.stores;
        hardwareStore.activeEcu = {
            hardwareId: hardwareId,
            serial: serial,
            type: type
        };
        let expandedPackage = packagesStore._getInstalledPackage(filepath, hardwareId);
        if(!expandedPackage) {
            packagesStore.expandedPackage = {
                unmanaged: true
            };
            this.expandedPackageName = null;
        } else {
            packagesStore.expandedPackage = expandedPackage;
            this.expandedPackageName = expandedPackage.id.name;
        }
        packagesStore.fetchAutoInstalledPackages(devicesStore.device.uuid, serial);
        this.triggerPackages = true;
    }
    installPackage(data) {
        const { packagesStore, devicesStore, hardwareStore } = this.props.stores;
        data.hardwareId = hardwareStore.activeEcu.hardwareId;
        devicesStore.createMultiTargetUpdate(data, devicesStore.device.uuid);
        this.showQueueModal();
    }
    togglePackageAutoUpdate(packageName, deviceId, isAutoInstallEnabled, e) {
        if(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const { packagesStore, hardwareStore } = this.props.stores;
        let activeEcuSerial = hardwareStore.activeEcu.serial;
        if(isAutoInstallEnabled)
            packagesStore.disablePackageAutoInstall(
                packageName,
                deviceId, 
                activeEcuSerial
            );
        else
            packagesStore.enablePackageAutoInstall(
                packageName, 
                deviceId, 
                activeEcuSerial
            );
    }
    togglePackage(packageName) {
        this.expandedPackageName = (this.expandedPackageName !== packageName ? packageName : null);
    }
    render() {
        return (
            <FadeAnimation>
                <span>
                    <DeviceHeader
                        showQueueModal={this.showQueueModal}
                        queueButtonRef={el => this.queueAnchorEl = el}
                    />
                    <MetaData 
                        title={title}>
                        <DeviceContainer 
                            selectEcu={this.selectEcu}
                            installPackage={this.installPackage}
                            triggerPackages={this.triggerPackages}
                            togglePackageAutoUpdate={this.togglePackageAutoUpdate}
                            expandedPackageName={this.expandedPackageName}
                            togglePackage={this.togglePackage}
                        />
                    </MetaData>
                    <DeviceQueueModal
                        shown={this.queueModalShown}
                        hide={this.hideQueueModal}
                        cancelMtuUpdate={this.cancelMtuUpdate}
                        activeTabId={this.activeTabId}
                        setQueueModalActiveTabId={this.setQueueModalActiveTabId}
                        anchorEl={this.queueAnchorEl}
                        showSequencer={this.showSequencer}
                    />
                    {this.sequencerShown ?
                        <DeviceSequencerModal 
                            shown={this.sequencerShown}
                            hide={this.hideSequencer}
                        />
                    :
                        null
                    }
                </span>
            </FadeAnimation>
        );
    }
}

Device.propTypes = {
    stores: PropTypes.object,
}

export default Device;