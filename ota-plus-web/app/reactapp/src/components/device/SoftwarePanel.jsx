import React, { Component, PropTypes } from 'react';
import { observe } from 'mobx';
import { observer } from 'mobx-react';
import { Form } from 'formsy-react';
import { SubHeader, SearchBar, Loader } from '../../partials';
import { PackagesList } from './packages';
import _ from 'underscore';

const title = "Software";
const noSearchResults = "No matching packages found.";

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
        const { devicesStore, packagesStore, hardwareStore, togglePackageAutoUpdate, toggleTufPackageAutoUpdate, onFileDrop, showPackageDetails, packagesReady } = this.props;
        return (
            <div className="software-panel">
                <div className="darkgrey-header">
                    {title}
                </div>
                <div className="wrapper-full">
                    <div className="wrapper-software">
                        {!packagesReady ?
                            <div className="wrapper-loader">
                                <Loader />
                            </div>
                        :
                            Object.keys(packagesStore.preparedPackages).length ?                                
                                <PackagesList
                                    packagesStore={packagesStore}
                                    devicesStore={devicesStore}
                                    hardwareStore={hardwareStore}
                                    onFileDrop={onFileDrop}
                                    togglePackageAutoUpdate={togglePackageAutoUpdate}
                                    toggleTufPackageAutoUpdate={toggleTufPackageAutoUpdate}
                                    showPackageDetails={showPackageDetails}
                                />
                            :
                                <div className="wrapper-center">
                                    {noSearchResults}
                                </div>
                        }
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
    togglePackageAutoUpdate: PropTypes.func.isRequired,
    toggleTufPackageAutoUpdate: PropTypes.func.isRequired,
    onFileDrop: PropTypes.func.isRequired,
    showPackageDetails: PropTypes.func.isRequired,
}

export default SoftwarePanel;