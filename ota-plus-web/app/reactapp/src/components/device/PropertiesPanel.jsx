import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { FlatButton, DropDownMenu, MenuItem } from 'material-ui';
import { SubHeader, SearchBar, Loader } from '../../partials';
import { Form } from 'formsy-react';
import { PackagesDetails } from './packages';
import { PropertiesOnDeviceList } from './properties';
import { Switch } from '../../partials';

@observer
class PropertiesPanel extends Component {

    @observable shouldShowPackagesDetails = true;

    constructor(props) {
        super(props);
        this.changeSort = this.changeSort.bind(this);
        this.changeFilter = this.changeFilter.bind(this);
        this.showPackagesList = this.showPackagesList.bind(this);
        this.showPackagesDetails = this.showPackagesDetails.bind(this);
    }
    componentWillMount() {
        this.props.packagesStore.fetchOndevicePackages(this.props.device.uuid);
    }
    changeSort(sort, e) {
        if(e) e.preventDefault();
        this.props.packagesStore._prepareOndevicePackages(sort);
    }
    changeFilter(filter) {
        this.props.packagesStore.fetchOndevicePackages(this.props.device.uuid, filter);
    }
    showPackagesList(e) {
        if(e) e.preventDefault();
        this.shouldShowPackagesDetails = false;
    }
    showPackagesDetails(e) {
        if(e) e.preventDefault();
        this.shouldShowPackagesDetails = true;
    }
    render() {
        const { showPackageCreateModal, showPackageBlacklistModal, onFileDrop, packagesStore, packageVersionUuid, installPackage, device, togglePackageAutoUpdate } = this.props;
        return (
            <div className="properties-panel">
                <div className="darkgrey-header">
                    Properties
                </div>
                <div className="wrapper-full">
                    <SubHeader shouldSubHeaderBeHidden={this.shouldShowPackagesDetails}>
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

                    <Switch 
                        showPackagesList={this.showPackagesList}
                        showPackagesDetails={this.showPackagesDetails}
                        shouldShowPackagesDetails={this.shouldShowPackagesDetails}
                    />

                    <div className={"wrapper-properties" + (this.shouldShowPackagesDetails ? " recalculated-properties-height" : "")}>

                        {packagesStore.overallPackagesCount ?
                            this.shouldShowPackagesDetails ? 
                                <PackagesDetails 
                                    packageVersionUuid={packageVersionUuid}
                                    showPackageBlacklistModal={showPackageBlacklistModal}
                                    packagesStore={packagesStore}
                                    installPackage={installPackage}
                                />
                            :
                                <PropertiesOnDeviceList 
                                    deviceId={device.uuid}
                                    showPackageBlacklistModal={showPackageBlacklistModal}
                                    onFileDrop={onFileDrop}
                                    togglePackageAutoUpdate={togglePackageAutoUpdate}
                                    installPackage={installPackage}
                                    packagesStore={packagesStore}
                                />
                        : null}
                        {packagesStore.overallPackagesCount && (packagesStore.packagesFetchAsync.isFetching || packagesStore.packagesBlacklistFetchAsync.isFetching ||
                        packagesStore.packagesForDeviceFetchAsync.isFetching || packagesStore.packagesAutoInstalledForDeviceFetchAsync.isFetching ||
                        packagesStore.packagesDeviceQueueFetchAsync.isFetching) ? 
                            <div className="wrapper-loader">
                                <Loader />
                            </div>
                        :  
                            null
                        }
                    </div>

                    <div className="wrapper-statistics">
                    </div>
                </div>
            </div>
        );
    }
}

PropertiesPanel.propTypes = {
    showPackageCreateModal: PropTypes.func.isRequired,
    showPackageBlacklistModal: PropTypes.func.isRequired,
    onFileDrop: PropTypes.func.isRequired,
    packagesStore: PropTypes.object.isRequired,
    packageVersionUuid: PropTypes.string,
}

export default PropertiesPanel;