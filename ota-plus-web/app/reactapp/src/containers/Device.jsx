import React, { Component, PropTypes } from 'react';
import { observable, extendObservable, observe } from 'mobx';
import { observer } from 'mobx-react';
import { Loader } from '../partials';
import { 
    DeviceHardwarePanel,
    DevicePropertiesPanel, 
    DeviceSoftwarePanel,
    DeviceSequencerModal
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
    @observable sequencerShown = false;
    
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
        this.showPackageDetails = this.showPackageDetails.bind(this);
        this.toggleTufUpload = this.toggleTufUpload.bind(this);        
        this.showHardwareOverlay = this.showHardwareOverlay.bind(this);        
        this.hideHardwareOverlay = this.hideHardwareOverlay.bind(this);        
        this.showSequencer = this.showSequencer.bind(this);
        this.hideSequencer = this.hideSequencer.bind(this);
    }
    showSequencer(e) {
        if(e) e.preventDefault();
        this.sequencerShown = true;
    }
    hideSequencer(e) {
        if(e) e.preventDefault();
        this.sequencerShown = false;
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
            if(hardwareStore.activeEcu.type === 'primary' && devicesStore._getPrimaryFilepath() === pack.imageName) {
                installedOnPrimary = true;
            }
            if(hardwareStore.activeEcu.type === 'secondary') {
                let serial = hardwareStore.activeEcu.serial;
                if(_.includes(devicesStore._getSecondaryFilepathsBySerial(serial), pack.imageName)) {
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
            campaignsStore,
            selectEcu,
            packagesReady,
            alphaPlusEnabled
        } = this.props;
        const device = devicesStore.device;
        return (
            <span>
                {devicesStore.devicesOneFetchAsync.isFetching ?
                    <div className="wrapper-center">
                        <Loader />
                    </div>
                :
                    device.lastSeen ?
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
                                campaignsStore={campaignsStore}
                                hardwareStore={hardwareStore}
                                showPackageBlacklistModal={this.showPackageBlacklistModal}
                                installPackage={this.installPackage}
                                installTufPackage={this.installTufPackage}
                                packagesReady={packagesReady}
                                showSequencer={this.showSequencer}
                                alphaPlusEnabled={alphaPlusEnabled}
                            />
                        </span>
                    :
                        <div className="wrapper-center wrapper-responsive">
                            <div className="guide-install-device">
                                <div className="title">
                                    Device never seen online.
                                </div>
                            </div>
                        </div>
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
                {this.sequencerShown ?
                    <DeviceSequencerModal 
                        shown={this.sequencerShown}
                        hide={this.hideSequencer}
                        campaignsStore={campaignsStore}
                        devicesStore={devicesStore}
                    />
                :
                    null
                }
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