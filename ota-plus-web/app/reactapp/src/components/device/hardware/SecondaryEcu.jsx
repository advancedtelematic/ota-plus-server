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
        const { active, ecu, hardwareStore, showKey, selectEcu, ...otherProps} = this.props;
        const hardware = hardwareStore.hardware;
        return (
            <span>
                <a
                    href="#"
                    id={"hardware-secondary-" + ecu.id}
                    className={active ? " selected" : ""}
                    onClick={selectEcu.bind(this, ecu.hardwareId, ecu.id, ecu.image.filepath, 'secondary')}
                >
                    <div className="desc">
                        <span id={"hardware-id-" + ecu.hardwareId} className="hardware-label">
                            {ecu.hardwareId}
                        </span> <br />
                        Serial: <span id={"hardware-serial-" + ecu.id}>
                            {ecu.id}
                        </span>
                    </div>
                    <div className="icons"
                         id="hardware-key-icon"
                         onClick={showKey}
                         onTouchTap={otherProps.handleTouchTap}>
                            <span className="hardware-icon">
                                <img src="/assets/img/icons/key.svg" alt="Icon" />
                            </span>
                    </div>
                </a>
                <PublicKeyPopover
                    {...otherProps}
                    ecu={ecu}
                    hardwareStore={hardwareStore}
                />
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
