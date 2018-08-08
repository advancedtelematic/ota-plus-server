import React, { Component, PropTypes } from 'react';
import { observable, extendObservable, observe } from 'mobx';
import { observer, inject } from 'mobx-react';
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

@inject("stores")
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
    
    showPackageDetails(pack, e) {
        if(e) e.preventDefault();
        const { packagesStore } = this.props.stores;
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
            selectEcu,
            packagesReady,
            disableExpand,
            installTufPackage
        } = this.props;
        const { devicesStore } = this.props.stores;
        const { device } = devicesStore;
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
                                selectEcu={selectEcu}
                                onFileDrop={this.onFileDrop}
                            />
                            <DeviceSoftwarePanel
                                toggleTufPackageAutoUpdate={this.toggleTufPackageAutoUpdate}
                                onFileDrop={this.onFileDrop}
                                showPackageDetails={this.showPackageDetails}
                                packagesReady={packagesReady}
                                disableExpand={disableExpand}
                            />
                            <DevicePropertiesPanel
                                installTufPackage={installTufPackage}
                                packagesReady={packagesReady}
                            />
                        </span>
                    :
                        <div className="wrapper-center">
                            <div className="device-offline-title">
                                Device never seen online.
                            </div>
                        </div>
                }
                {this.packageCreateModalShown ?
                    <PackagesCreateModal 
                        shown={this.packageCreateModalShown}
                        hide={this.hidePackageCreateModal}
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
    stores: PropTypes.object,
    selectEcu: PropTypes.func.isRequired,
}

export default Device;