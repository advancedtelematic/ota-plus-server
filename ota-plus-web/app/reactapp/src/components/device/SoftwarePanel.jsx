import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { Form } from 'formsy-react';
import { SubHeader, SearchBar, Loader } from '../../partials';
import { PackagesList } from './packages';

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
        this.props.packagesStore.fetchDevicePackages(this.props.device.uuid, filter);
    }
    render() {
        const { packagesStore, device, togglePackageAutoUpdate, onFileDrop, packageVersion, loadPackageVersionProperties } = this.props;
        return (
            <div className="software-panel">
                <div className="darkgrey-header">
                    Software
                </div>
                <div className="wrapper-full">
                    <SubHeader>
                        <Form>
                            <SearchBar 
                                value={packagesStore.devicePackagesFilter}
                                changeAction={this.changeFilter}
                            />
                        </Form>
                        <div className="sort-box">
                            {packagesStore.packagesSort == 'asc' ? 
                                <a href="#" onClick={this.changeSort.bind(this, 'desc')} id="link-sort-packages-desc">
                                    <i className="fa fa-long-arrow-up" aria-hidden="true"></i> A &gt; Z
                                </a>
                            :
                                <a href="#" onClick={this.changeSort.bind(this, 'asc')} id="link-sort-packages-asc">
                                    <i className="fa fa-long-arrow-down" aria-hidden="true"></i> Z &gt; A
                                </a>
                            }
                        </div>
                    </SubHeader>

                    <div className="wrapper-software">
                        {packagesStore.packagesFetchAsync.isFetching && !packagesStore.packagesOndeviceFetchAsync.isFetching ?
                            <div className="wrapper-loader">
                                <Loader />
                            </div>
                        :
                            <PackagesList
                                packagesStore={packagesStore}
                                deviceId={device.uuid}
                                onFileDrop={onFileDrop}
                                togglePackageAutoUpdate={togglePackageAutoUpdate}
                                packageVersion={packageVersion}
                                loadPackageVersionProperties={loadPackageVersionProperties}
                            />
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
    packagesStore: PropTypes.object.isRequired,
    device: PropTypes.object.isRequired,
    togglePackageAutoUpdate: PropTypes.func.isRequired,
    onFileDrop: PropTypes.func.isRequired,
    packageVersion: PropTypes.object.isRequired,
    loadPackageVersionProperties: PropTypes.func.isRequired,
}

export default SoftwarePanel;