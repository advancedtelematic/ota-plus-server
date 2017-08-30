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
        const { active, ecu, hardwareStore, showKey, keyModalShown, hardware, shownIds, device, selectEcu, ...otherProps} = this.props;
        return (
            <span>
                <a
                    href="#"
                    id={"hardware-secondary-" + ecu.id}
                    className={active ? " selected" : ""}
                    onClick={selectEcu.bind(this, ecu.hardwareId, ecu.id, ecu.image.hash.sha256, 'secondary')}
                >
                    <div className="desc">
                        <span>
                            Serial: <span id={"hardware-serial-" + ecu.id}>{ecu.id}</span> <br />
                            Hardware ID: <span id={"hardware-id-" + ecu.hardwareId}>{ecu.hardwareId}</span>
                        </span>
                    </div>
                    <div className="icons"
                         id="hardware-key-icon"
                         onClick={showKey}
                         onTouchTap={otherProps.handleTouchTap}>
                            <span className="hardware-icon">
                                <img src="/assets/img/icons/key.png" alt="Icon" />
                            </span>
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
    active: PropTypes.bool,
    ecu: PropTypes.object.isRequired,
    handleCopy: PropTypes.func,
    handleRequestClose: PropTypes.func,
    handleTouchTap: PropTypes.func,
    popoverShown: PropTypes.bool,
    copied: PropTypes.bool,
    selectEcu: PropTypes.func,
};

export default SecondaryEcu;
