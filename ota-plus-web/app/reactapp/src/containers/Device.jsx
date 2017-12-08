import React, { Component, PropTypes } from 'react';
import { observable, extendObservable, observe } from 'mobx';
import { observer } from 'mobx-react';
import { Loader } from '../partials';
import { 
    DeviceTutorial,
    DeviceGuide,
    DeviceHardwarePanel, 
    DevicePropertiesPanel, 
    DeviceSoftwarePanel
} from '../components/device';
import {
    PackagesCreateModal,
    PackagesBlacklistModal
} from '../components/packages';
import _ from 'underscore';

@observer
class Device extends Component {
    @observable packageCreateModalShown = false;
    @observable fileDropped = null;
    @observable packageBlacklistModalShown = false;
    @observable packageBlacklistAction = {};
    @observable uploadToTuf = true;
    @observable hardwareOverlayShown = false;
    @observable hardwareOverlayAnchor = null;
    
    constructor(props) {
        super(props);
        this.showPackageCreateModal = this.showPackageCreateModal.bind(this);
        this.hidePackageCreateModal = this.hidePackageCreateModal.bind(this);
        this.showPackageBlacklistModal = this.showPackageBlacklistModal.bind(this);
        this.hidePackageBlacklistModal = this.hidePackageBlacklistModal.bind(this);
        this.onFileDrop = this.onFileDrop.bind(this);
        this.togglePackageAutoUpdate = this.togglePackageAutoUpdate.bind(this);
        this.toggleTufPackageAutoUpdate = this.toggleTufPackageAutoUpdate.bind(this);
        this.installPackage = this.installPackage.bind(this);
        this.installTufPackage = this.installTufPackage.bind(this);
        this.clearStepsHistory = this.clearStepsHistory.bind(this);
        this.showPackageDetails = this.showPackageDetails.bind(this);
        this.toggleTufUpload = this.toggleTufUpload.bind(this);        
        this.showHardwareOverlay = this.showHardwareOverlay.bind(this);        
        this.hideHardwareOverlay = this.hideHardwareOverlay.bind(this);        
    }
    toggleTufUpload(e) {
        if(e) e.preventDefault();
        this.uploadToTuf = !this.uploadToTuf;
    }
    showPackageCreateModal(files, e) {
        if(e) e.preventDefault();
        this.packageCreateModalShown = true;
        this.fileDropped = (files ? files[0] : null);
    }
    hidePackageCreateModal(e) {
        if(e) e.preventDefault();
        this.packageCreateModalShown = false;
        this.fileDropped = null;
    }
    showPackageBlacklistModal(name, version, mode, e) {
        if(e) e.preventDefault();
        this.packageBlacklistModalShown = true;
        this.packageBlacklistAction = {
            name: name,
            version: version,
            mode: mode
        };
        this.hideHardwareOverlay();
    }
    hidePackageBlacklistModal(e) {
        const { packagesStore } = this.props;
        if(e) e.preventDefault();
        this.packageBlacklistModalShown = false;
        this.packageBlacklistAction = {};
        packagesStore._resetBlacklistActions();
    }
    showHardwareOverlay(e) {
        e.preventDefault();
        e.stopPropagation();
        this.hardwareOverlayShown = true;
        this.hardwareOverlayAnchor = e.currentTarget;
    }
    hideHardwareOverlay() {
        this.hardwareOverlayShown = false;        
    }
    onFileDrop(files) {
        this.showPackageCreateModal(files);
    }
    togglePackageAutoUpdate(packageName, deviceId, isAutoInstallEnabled) {
        const { packagesStore } = this.props;
        if(isAutoInstallEnabled) 
            packagesStore.disableDevicePackageAutoInstall(packageName, deviceId);
        else
            packagesStore.enableDevicePackageAutoInstall(packageName, deviceId);
    }
    toggleTufPackageAutoUpdate(packageName, deviceId, isAutoInstallEnabled) {
        const { packagesStore, hardwareStore } = this.props;
        let activeEcuSerial = hardwareStore.activeEcu.serial;
        if(isAutoInstallEnabled)
            packagesStore.disableTufPackageAutoInstall(
                packageName,
                deviceId, 
                activeEcuSerial
            );
        else
            packagesStore.enableTufPackageAutoInstall(
                packageName, 
                deviceId, 
                activeEcuSerial
            );
    }
    installPackage(data) {
        const { packagesStore, devicesStore } = this.props;
        packagesStore.installPackage(devicesStore.device.uuid, data);
        this.props.showQueueModal();
    }
    installTufPackage(data) {
        const { packagesStore, devicesStore, hardwareStore } = this.props;
        data.hardwareId = hardwareStore.activeEcu.hardwareId;
        devicesStore.createMultiTargetUpdate(data, devicesStore.device.uuid);
        this.props.showQueueModal();
    }
    clearStepsHistory(e) {
        if(e) e.preventDefault();
        const { devicesStore } = this.props;
        devicesStore.clearStepsHistory();
    }
    showPackageDetails(pack, e) {
        if(e) e.preventDefault();
        const { packagesStore } = this.props;
        let isPackageUnmanaged = pack === 'unmanaged';
        if(isPackageUnmanaged) {
            packagesStore.expandedPackage = {
                unmanaged: true
            };
        } else {
            packagesStore.expandedPackage = pack;
            packagesStore.expandedPackage.isInstalled = this.isPackInstalled(pack);
        }
    }
    isPackInstalled(pack) {
        const { devicesStore, hardwareStore } = this.props;
        let installedOnPrimary = false;
        let installedOnSecondary = false;
        let installedOnLegacy = false;
        if(devicesStore.device.isDirector) {
            if(hardwareStore.activeEcu.type === 'primary' && devicesStore._getPrimaryHash() === pack.id.version) {
                installedOnPrimary = true;
            }
            if(hardwareStore.activeEcu.type === 'secondary') {
                if(_.includes(devicesStore._getSecondaryHashes(), pack.id.version)) {
                    installedOnSecondary = true;
                }
            }
        } else {
            installedOnLegacy = pack.attributes.status === 'installed';
        }
        return installedOnPrimary || installedOnSecondary || installedOnLegacy;
    }
    render() {
        const { 
            devicesStore, 
            packagesStore, 
            hardwareStore, 
            selectEcu,
            packagesReady
        } = this.props;
        const device = devicesStore.device;
        return (
            <span>
                {devicesStore.devicesOneFetchAsync.isFetching ?
                    <div className="wrapper-center">
                        <Loader />
                    </div>
                :
                    device.lastSeen && devicesStore.stepsHistory.length === 0 ?
                        <span>
                            <DeviceHardwarePanel 
                                devicesStore={devicesStore}
                                hardwareStore={hardwareStore}
                                packagesStore={packagesStore}
                                selectEcu={selectEcu}
                                showPackageBlacklistModal={this.showPackageBlacklistModal}
                                onFileDrop={this.onFileDrop}
                                hardwareOverlayShown={this.hardwareOverlayShown}
                                hardwareOverlayAnchor={this.hardwareOverlayAnchor}
                                showHardwareOverlay={this.showHardwareOverlay}
                                hideHardwareOverlay={this.hideHardwareOverlay}
                            />
                            <DeviceSoftwarePanel
                                devicesStore={devicesStore}
                                packagesStore={packagesStore}
                                hardwareStore={hardwareStore}
                                togglePackageAutoUpdate={this.togglePackageAutoUpdate}
                                toggleTufPackageAutoUpdate={this.toggleTufPackageAutoUpdate}
                                installPackage={this.installPackage}
                                onFileDrop={this.onFileDrop}
                                showPackageDetails={this.showPackageDetails}
                                packagesReady={packagesReady}
                            />
                            <DevicePropertiesPanel
                                packagesStore={packagesStore}
                                devicesStore={devicesStore}
                                hardwareStore={hardwareStore}
                                showPackageBlacklistModal={this.showPackageBlacklistModal}
                                installPackage={this.installPackage}
                                installTufPackage={this.installTufPackage}
                                packagesReady={packagesReady}
                            />
                        </span>
                    :
                        <DeviceGuide
                            devicesStore={devicesStore}
                            clearStepsHistory={this.clearStepsHistory}
                        />
                }
                <PackagesCreateModal 
                    shown={this.packageCreateModalShown}
                    hide={this.hidePackageCreateModal}
                    packagesStore={packagesStore}
                    hardwareStore={hardwareStore}
                    devicesStore={devicesStore}
                    fileDropped={this.fileDropped}
                    toggleTufUpload={this.toggleTufUpload}
                    uploadToTuf={this.uploadToTuf}
                />
                <PackagesBlacklistModal 
                    shown={this.packageBlacklistModalShown}
                    hide={this.hidePackageBlacklistModal}
                    blacklistAction={this.packageBlacklistAction}
                    packagesStore={packagesStore}
                />
            </span>
        );
    }
}

Device.propTypes = {
    devicesStore: PropTypes.object.isRequired,
    packagesStore: PropTypes.object.isRequired,
    hardwareStore: PropTypes.object.isRequired,
    showQueueModal: PropTypes.func.isRequired,
    selectEcu: PropTypes.func.isRequired,
}

export default Device;