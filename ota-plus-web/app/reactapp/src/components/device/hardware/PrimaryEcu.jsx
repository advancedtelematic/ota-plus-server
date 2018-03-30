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
                            <span id="hardware-id-value" className="app-label">{devicesStore._getPrimaryHardwareId()}</span> <br />
                            Serial: <span id="hardware-serial-value">{devicesStore._getPrimarySerial()}</span>
                        </span>
                    </div>
                    <div className="icons">
                        <div className="hardware-icon details" 
                            id="hardware-details-icon-primary"
                            onClick={showHardwareOverlay}
                        >
                            {active ?
                                <img src="/assets/img/icons/white/info_icon.svg" alt="Icon" />
                            :
                                <img src="/assets/img/icons/black/info_icon.svg" alt="Icon" />
                            }
                        </div>
                        <div
                            className="hardware-icon key" 
                            id="hardware-key-icon-primary"
                            onClick={otherProps.handleTouchTap}
                        >
                            {active ?
                                <img src="/assets/img/icons/white/lock.svg" alt="Icon" />
                            :
                                <img src="/assets/img/icons/black/lock.svg" alt="Icon" />
                            }
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
