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
        const { hardwareStore, deviceId } = this.props;
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
                            deviceId={deviceId}
                        />
                    }
                </div>
            </div>
        );
    }
}

HardwarePanel.propTypes = {
    hardwareStore: PropTypes.object.isRequired,
    deviceId: PropTypes.string.isRequired,
}

export default HardwarePanel;