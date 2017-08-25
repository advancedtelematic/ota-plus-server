import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observe, observable } from 'mobx';
import { FlatButton, DropDownMenu, MenuItem } from 'material-ui';
import { Loader } from '../../partials';
import { PackagesDetails } from './packages';

@observer
class PropertiesPanel extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
    this.props.packagesStore.fetchOndevicePackages(this.props.device.uuid);
    }
    render() {
        const { devicesStore, showPackageBlacklistModal, packagesStore, expandedPack, installPackage, multiTargetUpdate, device } = this.props;
        let attributesFetching = packagesStore.packagesFetchAsync.isFetching || packagesStore.packagesForDeviceFetchAsync.isFetching;
        return (
            <div className="properties-panel">
                <div className="darkgrey-header">
                    Properties
                </div>
                <div className="wrapper-full">                    
                    <div className="wrapper-properties recalculated-properties-height">
                        {attributesFetching ?
                            <div className="wrapper-loader">
                                <Loader />
                            </div>
                        :
                            <PackagesDetails
                                packagesStore={packagesStore}
                                devicesStore={devicesStore}
                                expandedPack={expandedPack}
                                showPackageBlacklistModal={showPackageBlacklistModal}
                                installPackage={installPackage}
                                multiTargetUpdate={multiTargetUpdate}
                                device={device}
                            />
                        }
                    </div>
                </div>
            </div>
        );
    }
}

PropertiesPanel.propTypes = {
    packagesStore: PropTypes.object.isRequired,
    devicesStore: PropTypes.object.isRequired,
    showPackageBlacklistModal: PropTypes.func.isRequired,
    expandedPack: PropTypes.object,
    installPackage: PropTypes.func.isRequired,
    multiTargetUpdate: PropTypes.func.isRequired,
    device: PropTypes.object.isRequired,
}

export default PropertiesPanel;
