import React, { Component, PropTypes } from 'react';
import { observe } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Form } from 'formsy-react';
import { SubHeader, SearchBar, Loader } from '../../partials';
import { PackagesList } from './packages';
import _ from 'underscore';

const title = "Software";
const noSearchResults = "No matching packages found.";

@inject("stores")
@observer
class SoftwarePanel extends Component {
    render() {
        const { toggleTufPackageAutoUpdate, onFileDrop, showPackageDetails, packagesReady, disableExpand } = this.props;
        const { packagesStore } = this.props.stores;
        return (
            <div className="software-panel">
                <div className="software-panel__header darkgrey-header">
                    {title}
                </div>
                <div className="software-panel__wrapper">
                    <span>
                        {!packagesReady ?
                            <div className="wrapper-center">
                                <Loader />
                            </div>
                        :
                            Object.keys(packagesStore.preparedPackages).length ?                                
                                <PackagesList
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
                    </span>
                </div>
            </div>
        );
    }
}

SoftwarePanel.propTypes = {
    stores: PropTypes.object,
    toggleTufPackageAutoUpdate: PropTypes.func.isRequired,
    onFileDrop: PropTypes.func.isRequired,
    showPackageDetails: PropTypes.func.isRequired,
}

export default SoftwarePanel;