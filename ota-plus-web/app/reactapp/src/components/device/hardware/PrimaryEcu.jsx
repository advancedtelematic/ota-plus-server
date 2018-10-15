import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import PublicKeyPopover from './PublicKeyPopover';
import _ from 'underscore';

@inject("stores")
@observer
class PrimaryEcu extends Component {
    constructor(props) {
        super(props);
        this.onEcuClick = this.onEcuClick.bind(this);
    }
    onEcuClick = (e) => {
        if(e) e.preventDefault();
        const { selectEcu, hidePopover } = this.props;
        const { devicesStore } = this.props.stores;
        selectEcu(
            devicesStore._getPrimaryHardwareId(),
            devicesStore._getPrimarySerial(),
            devicesStore._getPrimaryFilepath(),
            'primary'
        );
        hidePopover();
    }
    render() {
        const { 
            active, 
            showHardwareOverlay, 
            selectEcu, 
            showPopover,
            popoverShown,
            copyPublicKey,
            publicKeyCopied,
            hidePopover,
            popoverAnchor,
        } = this.props;
        const { devicesStore } = this.props.stores;
        return (
            <span>
                <a
                    href="#" 
                    className={"hardware-panel__ecu" + (active ? " hardware-panel__ecu--selected" : "")}
                    id="hardware-primary-details"
                    onClick={this.onEcuClick.bind(this)}
                >
                    <div className="hardware-panel__ecu-desc">
                        <span>
                            <span id="hardware-id-value" className="hardware-panel__hardware-label app-label">{devicesStore._getPrimaryHardwareId()}</span> <br />
                            Serial: <span id="hardware-serial-value">{devicesStore._getPrimarySerial()}</span>
                        </span>
                    </div>
                    <div className="hardware-panel__ecu-actions">
                        <div className="hardware-panel__ecu-action hardware-panel__ecu-action--details" 
                            id="hardware-details-icon-primary"
                            onClick={showHardwareOverlay}
                        >
                            {active ?
                                <img src="/assets/img/icons/white/info.svg" className="hardware-panel__ecu-action--details-size" alt="Icon" />
                            :
                                <img src="/assets/img/icons/black/info.svg" className="hardware-panel__ecu-action--details-size" alt="Icon" />
                            }
                        </div>
                        <div
                            className="hardware-panel__ecu-action hardware-panel__ecu-action--key" 
                            id="hardware-key-icon-primary"
                            onClick={showPopover.bind(this, devicesStore._getPrimarySerial())}
                        >
                            {active ?
                                <img src="/assets/img/icons/white/key.svg" className="hardware-panel__ecu-action--key-size" alt="Icon" />
                            :
                                <img src="/assets/img/icons/black/key.svg" className="hardware-panel__ecu-action--key-size" alt="Icon" />
                            }
                        </div>
                    </div>
                </a>
                {popoverShown ?
                    <PublicKeyPopover
                        serial={devicesStore._getPrimarySerial()}
                        device={devicesStore.device}
                        handleRequestClose={hidePopover}
                        handleCopy={copyPublicKey}
                        popoverShown={popoverShown}
                        anchorEl={popoverAnchor}
                        copied={publicKeyCopied}
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
    stores: PropTypes.object
};

export default PrimaryEcu;
