import React, { Component, PropTypes } from 'react';
import { observable, extendObservable, observe } from 'mobx';
import { observer } from 'mobx-react';
import { Loader } from '../partials';
import { 
    DeviceHardwarePanel,
    DevicePropertiesPanel, 
    DeviceSoftwarePanel,
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
    @observable hardwareOverlayShown = false;
    @observable hardwareOverlayAnchor = null;
    
    constructor(props) {
        super(props);
        this.showPackageCreateModal = this.showPackageCreateModal.bind(this);
        this.hidePackageCreateModal = this.hidePackageCreateModal.bind(this);
        this.showPackageBlacklistModal = this.showPackageBlacklistModal.bind(this);
        this.hidePackageBlacklistModal = this.hidePackageBlacklistModal.bind(this);
        this.onFileDrop = this.onFileDrop.bind(this);
        this.toggleTufPackageAutoUpdate = this.toggleTufPackageAutoUpdate.bind(this);
        this.installTufPackage = this.installTufPackage.bind(this);
        this.showPackageDetails = this.showPackageDetails.bind(this);
        this.showHardwareOverlay = this.showHardwareOverlay.bind(this);        
        this.hideHardwareOverlay = this.hideHardwareOverlay.bind(this);        
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
    toggleTufPackageAutoUpdate(packageName, deviceId, isAutoInstallEnabled) {
        const { packagesStore, hardwareStore } = this.props;
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
        }
    }
    render() {
        const { 
            devicesStore, 
            packagesStore, 
            hardwareStore,
            campaignsStore,
            selectEcu,
            packagesReady,
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
                                toggleTufPackageAutoUpdate={this.toggleTufPackageAutoUpdate}
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
                                installTufPackage={this.installTufPackage}
                                packagesReady={packagesReady}
                            />
                        </span>
                    :
                        <div className="wrapper-center">
                            <div className="device-offline">
                                <div className="title">
                                    Device never seen online.
                                </div>
                            </div>
                        </div>
                }
                {this.packageCreateModalShown ?
                    <PackagesCreateModal 
                        shown={this.packageCreateModalShown}
                        hide={this.hidePackageCreateModal}
                        packagesStore={packagesStore}
                        hardwareStore={hardwareStore}
                        devicesStore={devicesStore}
                        fileDropped={this.fileDropped}
                    />
                :
                    null
                }
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