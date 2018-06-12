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
        const { 
            packagesStore, 
            devicesStore, 
            hardwareStore, 
            installTufPackage, 
            packagesReady, 
        } = this.props;
        return (
            <div className="properties-panel">
                <div className="properties-panel__header darkgrey-header">
                    {title}
                </div>
                <div className="properties-panel__wrapper">
                    {!packagesReady ?
                        <div className="wrapper-center">
                            <Loader />
                        </div>
                    :
                        <PropertiesList
                            packagesStore={packagesStore}
                            devicesStore={devicesStore}
                            hardwareStore={hardwareStore}
                            installTufPackage={installTufPackage}
                        />
                    }
                </div>
            </div>
        );
    }
}

PropertiesPanel.propTypes = {
    packagesStore: PropTypes.object.isRequired,
    devicesStore: PropTypes.object.isRequired,
    hardwareStore: PropTypes.object.isRequired,
    installTufPackage: PropTypes.func.isRequired,
}

export default PropertiesPanel;
