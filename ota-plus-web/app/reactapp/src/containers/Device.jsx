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
    @observable packageProperties = {};
    @observable expandedVersion = null;
    @observable uploadToTuf = false;
    @observable activeEcu = {
        ecu: null,
        type: null
    };
    @observable multiTargetUpdateStarted = false;

    constructor(props) {
        super(props);
        this.showPackageCreateModal = this.showPackageCreateModal.bind(this);
        this.hidePackageCreateModal = this.hidePackageCreateModal.bind(this);
        this.showPackageBlacklistModal = this.showPackageBlacklistModal.bind(this);
        this.hidePackageBlacklistModal = this.hidePackageBlacklistModal.bind(this);
        this.onFileDrop = this.onFileDrop.bind(this);
        this.togglePackageAutoUpdate = this.togglePackageAutoUpdate.bind(this);
        this.installPackage = this.installPackage.bind(this);
        this.multiTargetUpdate = this.multiTargetUpdate.bind(this);
        this.selectEcu = this.selectEcu.bind(this);
        this.cancelInstallation = this.cancelInstallation.bind(this);
        this.clearStepsHistory = this.clearStepsHistory.bind(this);
        this.loadPackageVersionProperties = this.loadPackageVersionProperties.bind(this);
        this.toggleTufUpload = this.toggleTufUpload.bind(this);        
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
    }
    hidePackageBlacklistModal(e) {
        if(e) e.preventDefault();
        this.packageBlacklistModalShown = false;
        this.packageBlacklistAction = {};
        this.props.packagesStore._resetBlacklistActions();
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
    installPackage(data) {
        this.props.packagesStore.installPackage(this.props.devicesStore.device.uuid, data);
        this.props.showQueueModal();
    }
    multiTargetUpdate(data) {
        data.hardwareId = this.activeEcu;
        this.props.devicesStore.createMultiTargetUpdate(data, this.props.devicesStore.device.uuid);
        this.props.showQueueModal();
    }
    selectEcu(ecu, installedHash, ecuType, e) {
        if(e) e.preventDefault();
        this.activeEcu = {
            ecu: ecu,
            type: ecuType
        };
        this.expandedVersion = this.props.packagesStore._getExpandedPackage(installedHash);
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
            this.expandedVersion = {
                unmanaged: true,
                isInstalled: true
            };
        } else {
            let versionUuid = version.uuid;
            if(e) e.preventDefault();
            this.expandedVersion = version;
            this.expandedVersion.isInstalled = this.isVersionInstalled(version);
        }
    }
    isVersionInstalled(version) {
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
                            />
                            <DeviceSoftwarePanel
                                devicesStore={devicesStore}
                                packagesStore={packagesStore}
                                hardwareStore={hardwareStore}
                                device={device}
                                togglePackageAutoUpdate={this.togglePackageAutoUpdate}
                                installPackage={this.installPackage}
                                onFileDrop={this.onFileDrop}
                                expandedVersion={this.expandedVersion}
                                loadPackageVersionProperties={this.loadPackageVersionProperties}
                                activeEcu={this.activeEcu}
                            />
                            <DevicePropertiesPanel
                                packagesStore={packagesStore}
                                devicesStore={devicesStore}
                                showPackageBlacklistModal={this.showPackageBlacklistModal}
                                onFileDrop={this.onFileDrop}
                                togglePackageAutoUpdate={this.togglePackageAutoUpdate}
                                expandedVersion={this.expandedVersion}
                                installPackage={this.installPackage}
                                multiTargetUpdate={this.multiTargetUpdate}
                                device={device}
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