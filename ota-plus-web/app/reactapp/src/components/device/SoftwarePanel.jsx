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
    }
    render() {
        const { devicesStore, packagesStore, hardwareStore, toggleTufPackageAutoUpdate, onFileDrop, showPackageDetails, packagesReady, disableExpand } = this.props;
        return (
            <div className="software-panel">
                <div className="darkgrey-header">
                    {title}
                </div>
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
                                toggleTufPackageAutoUpdate={toggleTufPackageAutoUpdate}
                                showPackageDetails={showPackageDetails}
                                disableExpand={disableExpand}
                            />
                        :
                            <div className="wrapper-center">
                                {noSearchResults}
                            </div>
                    }
                </div>
            </div>
        );
    }
}

SoftwarePanel.propTypes = {
    devicesStore: PropTypes.object.isRequired,
    packagesStore: PropTypes.object.isRequired,
    hardwareStore: PropTypes.object.isRequired,
    toggleTufPackageAutoUpdate: PropTypes.func.isRequired,
    onFileDrop: PropTypes.func.isRequired,
    showPackageDetails: PropTypes.func.isRequired,
}

export default SoftwarePanel;