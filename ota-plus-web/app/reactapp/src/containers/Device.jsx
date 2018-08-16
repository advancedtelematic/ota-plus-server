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
            installPackage,
            triggerPackages,
            togglePackageAutoUpdate,
            expandedPackageName,
            togglePackage,
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
                                togglePackageAutoUpdate={togglePackageAutoUpdate}
                                onFileDrop={this.onFileDrop}
                                showPackageDetails={this.showPackageDetails}
                                triggerPackages={triggerPackages}
                                expandedPackageName={expandedPackageName}
                                togglePackage={togglePackage}
                            />
                            <DevicePropertiesPanel
                                installPackage={installPackage}
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