import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import PublicKeyPopover from './PublicKeyPopover';
import _ from 'underscore';

@observer
class SecondaryEcu extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { ecu, hardwareStore, showKey, showDetails, keyModalShown, hardware, shownIds, device, ...otherProps} = this.props;
        return (
            <span>
                <a
                    href="#"
                    id="hardware-primary-details"
                    onClick={e => e.preventDefault()}
                >
                    <div className="desc">
                        <span>
                            Serial: <span id="hardware-serial-value">{_.first(device.directorAttributes).id}</span> <br />
                            Hardware ID: <span id="hardware-id-value">{_.first(device.directorAttributes).hardwareId}</span>
                        </span>
                    </div>
                    <div className="icons">
                        <i
                            className="fa fa-key hardware-icon key"
                            id="hardware-key-icon"
                            onClick={showKey}
                            onTouchTap={otherProps.handleTouchTap}
                        ></i>
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

SecondaryEcu.propTypes = {
    ecu: PropTypes.object.isRequired,
    handleCopy: PropTypes.func,
    handleRequestClose: PropTypes.func,
    handleTouchTap: PropTypes.func,
    popoverShown: PropTypes.bool,
    copied: PropTypes.bool,
};

export default SecondaryEcu;
