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
        const { active, devicesStore, showHardwareOverlay, selectEcu, ...otherProps} = this.props;
        return (
            <span>
                <a
                    href="#" 
                    className={active ? " selected" : ""}
                    id="hardware-primary-details"
                    onClick={selectEcu.bind(
                        this, 
                        devicesStore._getPrimaryHardwareId(), 
                        devicesStore._getPrimarySerial(), 
                        devicesStore._getPrimaryFilepath(), 
                        'primary'
                    )}
                >
                    <div className="desc">
                        <span>
                            <span id="hardware-id-value" className="hardware-label">{devicesStore._getPrimaryHardwareId()}</span> <br />
                            Serial: <span id="hardware-serial-value">{devicesStore._getPrimarySerial()}</span>
                        </span>
                    </div>
                    <div className="icons">
                        <div className="hardware-icon details" 
                            id="hardware-details-icon"
                            onClick={showHardwareOverlay}
                        >
                            <img src="/assets/img/icons/black/icon.svg" alt="Icon" />
                        </div>
                        <div
                            className="hardware-icon key" 
                            id="hardware-key-icon"
                            onClick={otherProps.handleTouchTap}
                        >
                            <img src="/assets/img/icons/key.svg" alt="Icon" />
                        </div>
                    </div>
                </a>
                <PublicKeyPopover
                    {...otherProps}
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
