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
} from '../components/packages';
import _ from 'underscore';

@observer
class Device extends Component {
    @observable packageCreateModalShown = false;
    @observable fileDropped = null;
    
    constructor(props) {
        super(props);
        this.showPackageCreateModal = this.showPackageCreateModal.bind(this);
        this.hidePackageCreateModal = this.hidePackageCreateModal.bind(this);
        this.onFileDrop = this.onFileDrop.bind(this);
        this.toggleTufPackageAutoUpdate = this.toggleTufPackageAutoUpdate.bind(this);
        this.showPackageDetails = this.showPackageDetails.bind(this);
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
    onFileDrop(files) {
        this.showPackageCreateModal(files);
    }
    toggleTufPackageAutoUpdate(packageName, deviceId, isAutoInstallEnabled, e) {
        if(e) {
            e.preventDefault();
            e.stopPropagation();
        }
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
            disableExpand,
            installTufPackage
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
                                onFileDrop={this.onFileDrop}
                            />
                            <DeviceSoftwarePanel
                                devicesStore={devicesStore}
                                packagesStore={packagesStore}
                                hardwareStore={hardwareStore}
                                toggleTufPackageAutoUpdate={this.toggleTufPackageAutoUpdate}
                                onFileDrop={this.onFileDrop}
                                showPackageDetails={this.showPackageDetails}
                                packagesReady={packagesReady}
                                disableExpand={disableExpand}
                            />
                            <DevicePropertiesPanel
                                packagesStore={packagesStore}
                                devicesStore={devicesStore}
                                campaignsStore={campaignsStore}
                                hardwareStore={hardwareStore}
                                installTufPackage={installTufPackage}
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
            </span>
        );
    }
}

Device.propTypes = {
    devicesStore: PropTypes.object.isRequired,
    packagesStore: PropTypes.object.isRequired,
    hardwareStore: PropTypes.object.isRequired,
    selectEcu: PropTypes.func.isRequired,
}

export default Device;