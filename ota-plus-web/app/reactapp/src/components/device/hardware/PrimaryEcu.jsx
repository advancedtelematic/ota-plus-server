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
        const { ecu, hardwareStore, showKey, showDetails, keyModalShown, hardware, shownIds, device, ...otherProps} = this.props;
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
                    className={"selected" + (shownIds.indexOf(dataId) > -1 ? " shown" : "")}
                    id="hardware-primary-details"
                    onClick={e => e.preventDefault()}
                >
                    <div className="desc">
                        { device.isDirector ? 
                            <span>
                                Serial: <span id="hardware-serial-value">{_.first(device.directorAttributes).id}</span> <br />
                                Hardware ID: <span id="hardware-id-value">{_.first(device.directorAttributes).hardwareId}</span>
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
                        ecu={ecu}
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
    ecu: PropTypes.object.isRequired,
    handleCopy: PropTypes.func,
    handleRequestClose: PropTypes.func,
    handleTouchTap: PropTypes.func,
    popoverShown: PropTypes.bool,
    copied: PropTypes.bool,
};

export default PrimaryEcu;
