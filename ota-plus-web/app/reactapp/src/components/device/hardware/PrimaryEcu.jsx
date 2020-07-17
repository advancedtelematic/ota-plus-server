/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from 'react-i18next';

import PublicKeyPopover from './PublicKeyPopover';
import DeviceHardwareOverlay from './Overlay';
import { ECU_TYPE_PRIMARY } from '../../../constants/deviceConstants';

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
      ECU_TYPE_PRIMARY
    );
  };

  render() {
    const {
      active,
      showPackageBlocklistModal,
      onFileDrop,
      changeHardwareOverlayVisibility,
      hardwareOverlayShown,
      changePopoverVisibility,
      popoverShown,
      device,
      copyPublicKey,
      publicKeyCopied,
      stores,
      t
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
              {t('devices.hardware.type')}
              <span id="hardware-type-primary" className="hardware-panel__hardware-label app-label">
                {devicesStore.getPrimaryHardwareId()}
              </span>
              <br />
              {t('devices.hardware.identifier')}
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
                showPackageBlocklistModal={showPackageBlocklistModal}
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
  showPackageBlocklistModal: PropTypes.func,
  onFileDrop: PropTypes.func,
  changeHardwareOverlayVisibility: PropTypes.func,
  hardwareOverlayShown: PropTypes.bool,
  changePopoverVisibility: PropTypes.func,
  device: PropTypes.shape({}),
  copyPublicKey: PropTypes.func,
  publicKeyCopied: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired
};

export default withTranslation()(PrimaryEcu);
