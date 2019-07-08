/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PublicKeyPopover from './PublicKeyPopover';
import DeviceHardwareOverlay from './Overlay';

@inject('stores')
@observer
class PrimaryEcu extends Component {
  constructor(props) {
    super(props);
    this.onEcuClick = this.onEcuClick.bind(this);
  }

  onEcuClick = (e) => {
    if (e) e.preventDefault();
    const { selectEcu, stores } = this.props;
    const { devicesStore } = stores;
    selectEcu(
      devicesStore.getPrimaryHardwareId(),
      devicesStore.getPrimarySerial(),
      devicesStore.getPrimaryFilepath(),
      'primary'
    );
  };

  render() {
    const {
      active,
      showPackageBlacklistModal,
      onFileDrop,
      changeHardwareOverlayVisibility,
      hardwareOverlayShown,
      changePopoverVisibility,
      popoverShown,
      device,
      copyPublicKey,
      publicKeyCopied,
      stores
    } = this.props;
    const { devicesStore } = stores;
    return (
      <>
        <a
          href="#"
          className={`hardware-panel__ecu${active ? ' hardware-panel__ecu--selected' : ''}`}
          id="hardware-primary-details"
          onClick={this.onEcuClick}
        >
          <div className="hardware-panel__ecu-desc">
            <span>
              {'Type: '}
              <span id="hardware-type-primary" className="hardware-panel__hardware-label app-label">
                {devicesStore.getPrimaryHardwareId()}
              </span>
              <br />
              {'Identifier: '}
              <span id="hardware-identifier-value">{devicesStore.getPrimarySerial()}</span>
            </span>
          </div>
          <div className="hardware-panel__ecu-actions">
            <div
              className="hardware-panel__ecu-action hardware-panel__ecu-action--details"
              id="hardware-details-icon-primary"
            >
              <DeviceHardwareOverlay
                hardwareOverlayShown={hardwareOverlayShown}
                changeHardwareOverlayVisibility={changeHardwareOverlayVisibility}
                device={device}
                showPackageBlacklistModal={showPackageBlacklistModal}
                onFileDrop={onFileDrop}
                active={active}
              />
            </div>
            <div className="hardware-panel__ecu-action hardware-panel__ecu-action--key" id="hardware-key-icon-primary">
              <PublicKeyPopover
                serial={devicesStore.getPrimarySerial()}
                device={devicesStore.device}
                handleCopy={copyPublicKey}
                changePopoverVisibility={changePopoverVisibility}
                copied={publicKeyCopied}
                active={active}
                popoverShown={popoverShown}
              />
            </div>
          </div>
        </a>
      </>
    );
  }
}

PrimaryEcu.propTypes = {
  active: PropTypes.bool,
  popoverShown: PropTypes.bool.isRequired,
  selectEcu: PropTypes.func,
  stores: PropTypes.shape({}),
  showPackageBlacklistModal: PropTypes.func,
  onFileDrop: PropTypes.func,
  changeHardwareOverlayVisibility: PropTypes.func,
  hardwareOverlayShown: PropTypes.bool,
  changePopoverVisibility: PropTypes.func,
  device: PropTypes.shape({}),
  copyPublicKey: PropTypes.func,
  publicKeyCopied: PropTypes.bool.isRequired,
};

export default PrimaryEcu;
