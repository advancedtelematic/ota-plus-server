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
        const { hardwareStore, packagesStore, device, activeEcu, selectEcu } = this.props;
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
                            hardwareStore={hardwareStore}
                            packagesStore={packagesStore}
                            device={device}
                            activeEcu={activeEcu}
                            selectEcu={selectEcu}
                        />
                    }
                </div>
            </div>
        );
    }
}

HardwarePanel.propTypes = {
    hardwareStore: PropTypes.object.isRequired,
    packagesStore: PropTypes.object.isRequired,
    device: PropTypes.object.isRequired,
    activeEcu: PropTypes.object,
    selectEcu: PropTypes.func.isRequired,
}

export default HardwarePanel;