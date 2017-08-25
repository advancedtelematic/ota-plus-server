import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { Loader } from '../../partials';
import { DeviceHardware } from './hardware';

@observer
class HardwarePanel extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { devicesStore, hardwareStore, packagesStore, device, activeEcu, selectEcu, showPackageBlacklistModal, onFileDrop, hardwareOverlayShown, showHardwareOverlay, hideHardwareOverlay } = this.props;
        return (
            <div className="hardware-panel">
                <div className="darkgrey-header">
                    Hardware
                </div>

                <div className="inner-container">
                    {hardwareStore.hardwareFetchAsync.isFetching ?
                        <div className="wrapper-center">
                            <Loader />
                        </div>
                    :
                        <DeviceHardware
                            devicesStore={devicesStore}
                            hardwareStore={hardwareStore}
                            packagesStore={packagesStore}
                            device={device}
                            activeEcu={activeEcu}
                            selectEcu={selectEcu}
                            showPackageBlacklistModal={showPackageBlacklistModal}
                            onFileDrop={onFileDrop}
                            hardwareOverlayShown={hardwareOverlayShown}
                            showHardwareOverlay={showHardwareOverlay}
                            hideHardwareOverlay={hideHardwareOverlay}
                        />
                    }
                </div>
            </div>
        );
    }
}

HardwarePanel.propTypes = {
    devicesStore: PropTypes.object.isRequired,
    hardwareStore: PropTypes.object.isRequired,
    packagesStore: PropTypes.object.isRequired,
    device: PropTypes.object.isRequired,
    activeEcu: PropTypes.object,
    selectEcu: PropTypes.func.isRequired,
}

export default HardwarePanel;