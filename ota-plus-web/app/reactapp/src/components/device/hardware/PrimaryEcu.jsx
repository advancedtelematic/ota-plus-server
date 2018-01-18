import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import PublicKeyPopover from './PublicKeyPopover';
import _ from 'underscore';

@observer
class PrimaryEcu extends Component {
    constructor(props) {
        super(props);
    }    
    render() {
        const { active, devicesStore, hardwareStore, showHardwareOverlay, selectEcu, ...otherProps} = this.props;
        const device = devicesStore.device;
        const hardware = hardwareStore.hardware;
        return (
            <span>
                <a
                    href="#" 
                    className={active ? " selected" : ""}
                    id="hardware-primary-details"
                    onClick={device.isDirector ? selectEcu.bind(
                        this, 
                        devicesStore._getPrimaryHardwareId(), 
                        devicesStore._getPrimarySerial(), 
                        devicesStore._getPrimaryFilepath(), 
                        'primary'
                    ) : e => e.preventDefault()}
                >
                    <div className="desc">
                        {device.isDirector ? 
                            <span>
                                <span id="hardware-id-value" className="hardware-label">{devicesStore._getPrimaryHardwareId()}</span> <br />
                                Serial: <span id="hardware-serial-value">{devicesStore._getPrimarySerial()}</span>
                            </span>
                        :
                            <span>
                                Serial: <span id="hardware-serial-value">not reported</span> <br />
                                Hardware ID: <span id="hardware-id-value">not reported</span>
                            </span>
                        }
                    </div>
                    <div className="icons">
                        <div className="hardware-icon details" 
                            id="hardware-details-icon"
                            onClick={showHardwareOverlay}
                        >
                            <img src="/assets/img/icons/black/icon.svg" alt="Icon" />
                        </div>
                        {device.isDirector ? 
                            <div
                                className="hardware-icon key" 
                                id="hardware-key-icon"
                                onTouchTap={otherProps.handleTouchTap}
                            >
                                <img src="/assets/img/icons/key.svg" alt="Icon" />
                            </div>
                        :
                            null
                        }
                    </div>
                </a>
                <PublicKeyPopover
                    {...otherProps}
                    hardwareStore={hardwareStore}
                />
            </span>
        );
    }
}

PrimaryEcu.propTypes = {
    active: PropTypes.bool,
    handleCopy: PropTypes.func,
    handleRequestClose: PropTypes.func,
    handleTouchTap: PropTypes.func,
    popoverShown: PropTypes.bool,
    copied: PropTypes.bool,
    selectEcu: PropTypes.func,
};

export default PrimaryEcu;
