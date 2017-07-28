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
        const { active, devicesStore, hardwareStore, showKey, showDetails, keyModalShown, hardware, device, selectEcu, ...otherProps} = this.props;
        let dataId = 0;
        if(!_.isUndefined(hardware) && !_.isUndefined(hardware.id) && (!_.isUndefined(hardware.description) || !_.isUndefined(hardware.class))) {
            dataId = hardware['id-nr'];
        }
        return (
            <span>
                <div className="section-header">
                    Primary ECUs
                </div>
                <a
                    href="#" 
                    data-id={dataId}
                    className={active ? " selected" : ""}
                    id="hardware-primary-details"
                    onClick={device.isDirector ? selectEcu.bind(this, devicesStore._getPrimaryHardwareId(), devicesStore._getPrimarySerial(), devicesStore._getPrimaryHash(), 'primary') : e => e.preventDefault()}
                >
                    <div className="desc">
                        { device.isDirector ? 
                            <span>
                                Serial: <span id="hardware-serial-value">{devicesStore._getPrimarySerial()}</span> <br />
                                Hardware ID: <span id="hardware-id-value">{devicesStore._getPrimaryHardwareId()}</span>
                            </span>
                        :
                            <span>
                                Serial: <span id="hardware-serial-value">not reported</span> <br />
                                Hardware ID: <span id="hardware-id-value">not reported</span>
                            </span>
                        }
                    </div>
                    <div className="icons">
                        <i
                            className="fa fa-info hardware-icon details" 
                            id="hardware-details-icon"
                            onClick={showDetails}
                            data-id={dataId}
                        ></i>
                        {device.isDirector ? 
                            <i
                                className="fa fa-key hardware-icon key" 
                                id="hardware-key-icon"
                                onClick={showKey}
                                onTouchTap={otherProps.handleTouchTap}
                            ></i>
                        :
                            null
                        }

                    </div>
                </a>
                {keyModalShown ? 
                    <PublicKeyPopover
                        {...otherProps}
                        hardwareStore={hardwareStore}
                    />
                :
                    null
                }
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
