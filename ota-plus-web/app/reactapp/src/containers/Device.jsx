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
    @observable expandedPack = null;
    @observable uploadToTuf = true;
    @observable activeEcu = {
        hardwareId: null,
        serial: null,
        type: null,
    };
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
        this.multiTargetUpdate = this.multiTargetUpdate.bind(this);
        this.selectEcu = this.selectEcu.bind(this);
        this.cancelInstallation = this.cancelInstallation.bind(this);
        this.clearStepsHistory = this.clearStepsHistory.bind(this);
        this.loadPackageVersionProperties = this.loadPackageVersionProperties.bind(this);
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
        if(e) e.preventDefault();
        this.packageBlacklistModalShown = false;
        this.packageBlacklistAction = {};
        this.props.packagesStore._resetBlacklistActions();
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
        if(isAutoInstallEnabled) 
            this.props.packagesStore.disableDevicePackageAutoInstall(packageName, deviceId);
        else
            this.props.packagesStore.enableDevicePackageAutoInstall(packageName, deviceId);
    }
    toggleTufPackageAutoUpdate(packageName, deviceId, isAutoInstallEnabled) {
        if(isAutoInstallEnabled)
            this.props.packagesStore.disableTufPackageAutoInstall(packageName, deviceId, this.activeEcu.serial);
        else
            this.props.packagesStore.enableTufPackageAutoInstall(packageName, deviceId, this.activeEcu.serial);
    }
    installPackage(data) {
        this.props.packagesStore.installPackage(this.props.devicesStore.device.uuid, data);
        this.props.showQueueModal();
    }
    multiTargetUpdate(data) {
        data.hardwareId = this.activeEcu.hardwareId;
        this.props.devicesStore.createMultiTargetUpdate(data, this.props.devicesStore.device.uuid);
        this.props.showQueueModal();
        this.props.packagesStore._addQueuedTufPackage(data);
    }
    selectEcu(hardwareId, serial, installedHash, ecuType, e) {
        if(e) e.preventDefault();
        this.activeEcu = {
            hardwareId: hardwareId,
            serial: serial,
            type: ecuType
        };
        this.expandedPack = this.props.packagesStore._getInstalledPackage(installedHash);
        this.props.packagesStore.fetchDirectorDeviceAutoInstalledPackages(this.props.devicesStore.device.uuid, serial);
        this.props.packagesStore._setQueuedTufPackages(this.props.devicesStore.multiTargetUpdates[this.props.devicesStore.device.uuid], serial);
    }
    cancelInstallation(requestId) {
        this.props.packagesStore.cancelInstallation(this.props.devicesStore.device.uuid, requestId);
    }
    clearStepsHistory(e) {
        if(e) e.preventDefault();
        this.props.devicesStore.clearStepsHistory();
    }
    loadPackageVersionProperties(version, e) {
        if(version === 'unmanaged') {
            this.expandedPack = {
                unmanaged: true,
                isInstalled: true
            };
        } else {
            let versionUuid = version.uuid;
            if(e) e.preventDefault();
            this.expandedPack = version;
            this.expandedPack.isInstalled = this.isPackInstalled(version);
        }
    }
    isPackInstalled(version) {
        const { devicesStore } = this.props;
        let installedOnPrimary = false;
        let installedOnSecondary = false;
        let installedOnLegacy = false;
        if(devicesStore.device.isDirector) {
            if(this.activeEcu.type === 'primary' && devicesStore._getPrimaryHash() === version.id.version) {
                installedOnPrimary = true;
            }
            if(this.activeEcu.type === 'secondary') {
                if(_.includes(devicesStore._getSecondaryHashes(), version.id.version)) {
                    installedOnSecondary = true;
                }
            }
        }
        installedOnLegacy = version.attributes.status === 'installed';
        return installedOnPrimary || installedOnSecondary || installedOnLegacy;
    }
    render() {
        const { devicesStore, packagesStore, hardwareStore } = this.props;
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
                                device={device}                                
                                activeEcu={this.activeEcu}
                                selectEcu={this.selectEcu}
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
                                device={device}
                                togglePackageAutoUpdate={this.togglePackageAutoUpdate}
                                toggleTufPackageAutoUpdate={this.toggleTufPackageAutoUpdate}
                                installPackage={this.installPackage}
                                onFileDrop={this.onFileDrop}
                                expandedPack={this.expandedPack}
                                loadPackageVersionProperties={this.loadPackageVersionProperties}
                                activeEcu={this.activeEcu}
                            />
                            <DevicePropertiesPanel
                                packagesStore={packagesStore}
                                devicesStore={devicesStore}
                                showPackageBlacklistModal={this.showPackageBlacklistModal}
                                expandedPack={this.expandedPack}
                                installPackage={this.installPackage}
                                multiTargetUpdate={this.multiTargetUpdate}
                                device={device}
                                activeEcu={this.activeEcu}
                            />
                        </span>
                    :
                        <DeviceGuide
                            device={device}
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
    showQueueModal: PropTypes.func.isRequired
}

export default Device;