import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import PublicKeyPopover from './PublicKeyPopover';
import _ from 'underscore';

@observer
class PrimaryEcu extends Component {
    constructor(props) {
        super(props);
        this.onEcuClick = this.onEcuClick.bind(this);
    }
    onEcuClick(e) {
        if(e) e.preventDefault();
        const { selectEcu, hidePopover, devicesStore } = this.props;
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
            devicesStore, 
            showHardwareOverlay, 
            selectEcu, 
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
                    className={active ? " selected" : ""}
                    id="hardware-primary-details"
                    onClick={this.onEcuClick.bind(this)}
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
                                <img src="/assets/img/icons/white/info.svg" alt="Icon" />
                            :
                                <img src="/assets/img/icons/black/info.svg" alt="Icon" />
                            }
                        </div>
                        <div
                            className="hardware-icon key" 
                            id="hardware-key-icon-primary"
                            onClick={showPopover.bind(this, devicesStore._getPrimarySerial())}
                        >
                            {active ?
                                <img src="/assets/img/icons/white/key.svg" alt="Icon" />
                            :
                                <img src="/assets/img/icons/black/key.svg" alt="Icon" />
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
