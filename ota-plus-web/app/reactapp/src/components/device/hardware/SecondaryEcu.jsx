import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import PublicKeyPopover from './PublicKeyPopover';
import _ from 'underscore';

@observer
class SecondaryEcu extends Component {
    constructor(props) {
        super(props);
        this.onEcuClick = this.onEcuClick.bind(this);
    }
    onEcuClick(ecu, e) {
        if(e) e.preventDefault();
        const { selectEcu, hideHardwareOverlay, hidePopover } = this.props;
        selectEcu(ecu.hardwareId, ecu.id, ecu.image.filepath, 'secondary');
        hideHardwareOverlay();
        hidePopover();
    }
    render() {
        const { 
            active, 
            ecu, 
            device, 
            showPopover,
            popoverShown,
            copyPublicKey,
            publicKeyCopied,
            hidePopover,
            popoverAnchor,
            hardwareStore
        } = this.props;
        return (
            <span>
                <a
                    href="#"
                    id={"hardware-secondary-" + ecu.id}
                    className={"hardware-panel__ecu" + (active ? " hardware-panel__ecu--selected" : "")}
                    onClick={this.onEcuClick.bind(this, ecu)}
                >
                    <div className="hardware-panel__ecu-desc">
                        <span id={"hardware-id-" + ecu.hardwareId} className="hardware-panel__hardware-label app-label">
                            {ecu.hardwareId}
                        </span> <br />
                        Serial: <span id={"hardware-serial-" + ecu.id}>
                            {ecu.id}
                        </span>
                    </div>
                    <div className="hardware-panel__ecu-actions"
                         id={"hardware-key-icon-secondary-" + ecu.id}
                         onClick={showPopover.bind(this, ecu.id)}>
                            <span className="hardware-panel__ecu-action hardware-panel__ecu-action--key">
                                {active ?
                                    <img src="/assets/img/icons/white/key.svg" className="hardware-panel__ecu-action--key-size" alt="Icon" />
                                :
                                    <img src="/assets/img/icons/black/key.svg" className="hardware-panel__ecu-action--key-size" alt="Icon" />
                                }
                            </span>
                    </div>
                </a>
                {popoverShown ?
                    <PublicKeyPopover
                        serial={ecu.id}
                        device={device}
                        handleRequestClose={hidePopover}
                        handleCopy={copyPublicKey}
                        popoverShown={popoverShown}
                        anchorEl={popoverAnchor}
                        copied={publicKeyCopied}
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
