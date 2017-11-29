import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observe, observable } from 'mobx';
import { FlatButton, DropDownMenu, MenuItem } from 'material-ui';
import { Loader } from '../../partials';
import { PropertiesList } from './properties';

const title = "Properties";

@observer
class PropertiesPanel extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { packagesStore, devicesStore, hardwareStore, showPackageBlacklistModal, installPackage, installTufPackage, packagesReady } = this.props;
        return (
            <div className="properties-panel">
                <div className="darkgrey-header">
                    {title}
                </div>
                <div className="wrapper-full">                    
                    <div className="wrapper-properties recalculated-properties-height">
                        {!packagesReady ?
                            <div className="wrapper-loader">
                                <Loader />
                            </div>
                        :
                            <PropertiesList
                                packagesStore={packagesStore}
                                devicesStore={devicesStore}
                                hardwareStore={hardwareStore}
                                showPackageBlacklistModal={showPackageBlacklistModal}
                                installPackage={installPackage}
                                installTufPackage={installTufPackage}
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
    hardwareStore: PropTypes.object.isRequired,
    showPackageBlacklistModal: PropTypes.func.isRequired,
    installPackage: PropTypes.func.isRequired,
    installTufPackage: PropTypes.func.isRequired,
}

export default PropertiesPanel;
