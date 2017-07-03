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
    @observable packageVersion = { uuid: 1 };
    @observable uploadToTuf = false;
    @observable activeEcu = 'raspberrypi3';
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
        this.cancelInstallation = this.cancelInstallation.bind(this);
        this.clearStepsHistory = this.clearStepsHistory.bind(this);
        this.loadPackageVersionProperties = this.loadPackageVersionProperties.bind(this);
        this.toggleTufUpload = this.toggleTufUpload.bind(this);

        this.packageVersionChangeHandler = observe(props.devicesStore, (change) => {
            if(change.name === 'devicesOneFetchAsync' && change.object[change.name].isFetching === false) {
                if(props.devicesStore.device.isDirector) {
                    extendObservable(this.packageVersion, {
                        uuid: _.first(props.devicesStore.device.directorAttributes).image.hash.sha256,
                        version: _.first(props.devicesStore.device.directorAttributes).image.hash.sha256,
                        isInstalled: true,
                    });
                }
            }
        });
    }
    toggleTufUpload(e) {
        if(e) e.preventDefault();
        this.uploadToTuf = !this.uploadToTuf;
    }
    componentWillUnmount() {
        this.packageVersionChangeHandler();
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
    cancelInstallation(requestId) {
        this.props.packagesStore.cancelInstallation(this.props.devicesStore.device.uuid, requestId);
    }
    clearStepsHistory(e) {
        if(e) e.preventDefault();
        this.props.devicesStore.clearStepsHistory();
    }
    loadPackageVersionProperties(version, e) {
        let versionUuid = version.uuid;
        if(e) e.preventDefault();
        extendObservable(this.packageVersion, {
            uuid: versionUuid,
            version: version.id.version,
            isInstalled: version.attributes.status === 'installed' || 
                (this.props.devicesStore.device.isDirector && _.first(this.props.devicesStore.device.directorAttributes).image.hash.sha256 === version.id.version),
        });
        let packageVersion = this.props.packagesStore._getPackageVersionByUuid(versionUuid);
        if(packageVersion.isBlacklisted) {
            this.props.packagesStore.fetchBlacklistedPackage({ name: packageVersion.id.name, version: packageVersion.id.version});
        }
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
                                hardwareStore={hardwareStore}
                                device={device}
                                activeEcu={this.activeEcu}
                            />
                            <DeviceSoftwarePanel
                                devicesStore={devicesStore}
                                packagesStore={packagesStore}
                                hardwareStore={hardwareStore}
                                device={device}
                                togglePackageAutoUpdate={this.togglePackageAutoUpdate}
                                installPackage={this.installPackage}
                                onFileDrop={this.onFileDrop}
                                packageVersion={this.packageVersion}
                                loadPackageVersionProperties={this.loadPackageVersionProperties}
                            />
                            <DevicePropertiesPanel
                                packagesStore={packagesStore}
                                showPackageBlacklistModal={this.showPackageBlacklistModal}
                                onFileDrop={this.onFileDrop}
                                togglePackageAutoUpdate={this.togglePackageAutoUpdate}
                                packageVersion={this.packageVersion}
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