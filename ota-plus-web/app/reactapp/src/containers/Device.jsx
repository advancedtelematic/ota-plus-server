import React, { Component, PropTypes } from 'react';
import { observable, extendObservable } from 'mobx';
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

@observer
class Device extends Component {
    @observable packageCreateModalShown = false;
    @observable fileDropped = null;
    @observable packageBlacklistModalShown = false;
    @observable packageBlacklistAction = {};
    @observable packageProperties = {};
    @observable packageVersion = { uuid: 1 };

    constructor(props) {
        super(props);
        this.showPackageCreateModal = this.showPackageCreateModal.bind(this);
        this.hidePackageCreateModal = this.hidePackageCreateModal.bind(this);
        this.showPackageBlacklistModal = this.showPackageBlacklistModal.bind(this);
        this.hidePackageBlacklistModal = this.hidePackageBlacklistModal.bind(this);
        this.onFileDrop = this.onFileDrop.bind(this);
        this.togglePackageAutoUpdate = this.togglePackageAutoUpdate.bind(this);
        this.installPackage = this.installPackage.bind(this);
        this.cancelInstallation = this.cancelInstallation.bind(this);
        this.clearStepsHistory = this.clearStepsHistory.bind(this);
        this.loadPackageVersionProperties = this.loadPackageVersionProperties.bind(this);
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
            isInstalled: version.attributes.status === 'installed'
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
                            />
                            <DeviceSoftwarePanel
                                devicesStore={devicesStore}
                                packagesStore={packagesStore}
                                device={device}
                                togglePackageAutoUpdate={this.togglePackageAutoUpdate}
                                installPackage={this.installPackage}
                                onFileDrop={this.onFileDrop}
                                packageVersion={this.packageVersion}
                                loadPackageVersionProperties={this.loadPackageVersionProperties}
                            />
                            <DevicePropertiesPanel
                                showPackageCreateModal={this.showPackageCreateModal}
                                showPackageBlacklistModal={this.showPackageBlacklistModal}
                                packagesStore={packagesStore}
                                devicesStore={devicesStore}
                                onFileDrop={this.onFileDrop}
                                togglePackageAutoUpdate={this.togglePackageAutoUpdate}
                                installPackage={this.installPackage}
                                device={device}
                                packageVersion={this.packageVersion}
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
                    fileDropped={this.fileDropped}
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
}

export default Device;