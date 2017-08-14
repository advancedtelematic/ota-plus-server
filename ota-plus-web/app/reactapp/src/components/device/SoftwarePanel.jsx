import React, { Component, PropTypes } from 'react';
import { observe } from 'mobx';
import { observer } from 'mobx-react';
import { Form } from 'formsy-react';
import { SubHeader, SearchBar, Loader } from '../../partials';
import { PackagesCoreList } from './packages';
import _ from 'underscore';

@observer
class SoftwarePanel extends Component {
    constructor(props) {
        super(props);
        this.changeSort = this.changeSort.bind(this);
        this.changeFilter = this.changeFilter.bind(this);
    }
    changeSort(sort, e) {
        if(e) e.preventDefault();
        this.props.packagesStore._prepareDevicePackages(sort);
    }
    changeFilter(filter) {
        this.props.packagesStore.fetchPackages(filter);
    }
    render() {
        const { devicesStore, packagesStore, hardwareStore, device, togglePackageAutoUpdate, toggleTufPackageAutoUpdate, onFileDrop, expandedPack, loadPackageVersionProperties, activeEcu } = this.props;
        return (
            <div className="software-panel">
                <div className="darkgrey-header">
                    Software
                </div>
                <div className="wrapper-full">
                    <div className="wrapper-software">
                        {packagesStore.packagesFetchAsync.isFetching ?
                            <div className="wrapper-loader">
                                <Loader />
                            </div>
                        :
                            Object.keys(packagesStore.preparedPackagesPerDevice[device.uuid]).length ?
                                <PackagesCoreList
                                    packagesStore={packagesStore}
                                    devicesStore={devicesStore}
                                    hardwareStore={hardwareStore}
                                    device={device}
                                    onFileDrop={onFileDrop}
                                    togglePackageAutoUpdate={togglePackageAutoUpdate}
                                    toggleTufPackageAutoUpdate={toggleTufPackageAutoUpdate}
                                    expandedPack={expandedPack}
                                    loadPackageVersionProperties={loadPackageVersionProperties}
                                    activeEcu={activeEcu}
                                />
                            :
                                <span className="content-empty">
                                    <div className="wrapper-center">
                                        No matching packages found.
                                    </div>
                                </span>
                        }
                    </div>

                    <div className="wrapper-statistics">
                        {packagesStore.devicePackagesInstalledCount} installed, {packagesStore.devicePackagesQueuedCount} queued
                    </div>
                </div>
            </div>
        );
    }
}

SoftwarePanel.propTypes = {
    devicesStore: PropTypes.object.isRequired,
    packagesStore: PropTypes.object.isRequired,
    hardwareStore: PropTypes.object.isRequired,
    device: PropTypes.object.isRequired,
    togglePackageAutoUpdate: PropTypes.func.isRequired,
    toggleTufPackageAutoUpdate: PropTypes.func.isRequired,
    onFileDrop: PropTypes.func.isRequired,
    expandedPack: PropTypes.object,
    loadPackageVersionProperties: PropTypes.func.isRequired,
    activeEcu: PropTypes.object,
}

export default SoftwarePanel;