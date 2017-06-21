import React, { Component, PropTypes } from 'react';
import { observe } from 'mobx';
import { observer } from 'mobx-react';
import { Form } from 'formsy-react';
import { SubHeader, SearchBar, Loader } from '../../partials';
import { PackagesList } from './packages';
import _ from 'underscore';

@observer
class SoftwarePanel extends Component {
    constructor(props) {
        super(props);
        this.changeSort = this.changeSort.bind(this);
        this.changeFilter = this.changeFilter.bind(this);

        this.packagesChangeHandler = observe(props.packagesStore, (change) => {
            if(change.name === 'initialPackagesForDeviceFetchAsyncBeforePreparing' && change.object[change.name].isFetching === false) {
                if(this.props.device.isDirector) {
                    let hash = _.first(this.props.device.directorAttributes).image.hash.sha256;
                    let pack = this.props.packagesStore._getPackageByVersion(hash);
                    if(!_.isUndefined(this.props.packagesStore.installedPackagesPerDevice[this.props.device.uuid])) {
                        this.props.packagesStore.installedPackagesPerDevice[this.props.device.uuid].push(pack);
                    }
                }
            }
        });
    }
    componentWillUnmount() {
        this.packagesChangeHandler();
    }
    changeSort(sort, e) {
        if(e) e.preventDefault();
        this.props.packagesStore._prepareDevicePackages(sort);
    }
    changeFilter(filter) {
        this.props.packagesStore.fetchPackages(filter);
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
                        {packagesStore.packagesFetchAsync.isFetching ?
                            <div className="wrapper-loader">
                                <Loader />
                            </div>
                        :
                            Object.keys(packagesStore.preparedPackagesPerDevice[device.uuid]).length ?
                                <PackagesList
                                    packagesStore={packagesStore}
                                    device={device}
                                    onFileDrop={onFileDrop}
                                    togglePackageAutoUpdate={togglePackageAutoUpdate}
                                    packageVersion={packageVersion}
                                    loadPackageVersionProperties={loadPackageVersionProperties}
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
    packagesStore: PropTypes.object.isRequired,
    device: PropTypes.object.isRequired,
    togglePackageAutoUpdate: PropTypes.func.isRequired,
    onFileDrop: PropTypes.func.isRequired,
    packageVersion: PropTypes.object.isRequired,
    loadPackageVersionProperties: PropTypes.func.isRequired,
}

export default SoftwarePanel;