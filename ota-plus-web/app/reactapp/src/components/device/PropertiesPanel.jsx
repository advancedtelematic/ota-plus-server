import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observe, observable } from 'mobx';
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

        this.uuidChangedHandler = observe(props.packageVersion, (change) => {
            if(change.name === 'uuid' && change.oldValue !== change.object[change.name]) {
                this.shouldShowPackagesDetails = true;
            }
        });
    }
    componentWillMount() {
        this.props.packagesStore.fetchOndevicePackages(this.props.device.uuid);
    }
    componentWillUnmount() {
        this.uuidChangedHandler();
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
        const { packagesStore, showPackageBlacklistModal, onFileDrop, togglePackageAutoUpdate, packageVersion, installPackage, device } = this.props;
        let attributesFetching = packagesStore.packagesFetchAsync.isFetching || packagesStore.packagesForDeviceFetchAsync.isFetching;
        return (
            <div className="properties-panel">
                <div className="darkgrey-header">
                    Properties
                </div>
                <div className="wrapper-full">
                    <SubHeader shouldSubHeaderBeHidden={this.shouldShowPackagesDetails}>
                        <Form>
                            <SearchBar
                                value={packagesStore.packagesOndeviceFilter}
                                changeAction={this.changeFilter}
                                id="search-installed-packages-input"
                            />
                        </Form>
                        <div className="sort-box">
                            {packagesStore.packagesOndeviceSort == 'asc' ?
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
                        {attributesFetching ?
                            <div className="wrapper-loader">
                                <Loader />
                            </div>
                        :
                            packagesStore.overallPackagesCount ?
                                this.shouldShowPackagesDetails ?
                                    <PackagesDetails
                                        packagesStore={packagesStore}
                                        packageVersion={packageVersion}
                                        showPackageBlacklistModal={showPackageBlacklistModal}
                                        installPackage={installPackage}
                                        device={device}
                                    />
                                :
                                    <PropertiesOnDeviceList
                                        packagesStore={packagesStore}
                                        packageVersion={packageVersion}
                                        device={device}
                                        showPackageBlacklistModal={showPackageBlacklistModal}
                                        onFileDrop={onFileDrop}
                                    />
                            :
                                null
                            (packagesStore.overallPackagesCount && packagesStore.packagesOndeviceFetchAsync.isFetching) ?
                                <div className="wrapper-loader">
                                    <Loader />
                                </div>
                            :
                                null
                        }
                    </div>
                </div>
            </div>
        );
    }
}

PropertiesPanel.propTypes = {
    packagesStore: PropTypes.object.isRequired,
    showPackageBlacklistModal: PropTypes.func.isRequired,
    onFileDrop: PropTypes.func.isRequired,
    packageVersion: PropTypes.object.isRequired,
    togglePackageAutoUpdate: PropTypes.func.isRequired,
    packageVersion: PropTypes.object.isRequired,
    installPackage: PropTypes.func.isRequired,
    device: PropTypes.object.isRequired,
}

export default PropertiesPanel;
