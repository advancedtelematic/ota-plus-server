/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withTranslation } from 'react-i18next';

import PublicKeyPopover from './PublicKeyPopover';
import { ECU_TYPE_SECONDARY } from '../../../constants/deviceConstants';

@observer
class SecondaryEcu extends Component {
  onEcuClick = (ecu, e) => {
    if (e) e.preventDefault();
    const { selectEcu, changeHardwareOverlayVisibility } = this.props;
    selectEcu(ecu.hardwareId, ecu.id, ecu.image.filepath, ECU_TYPE_SECONDARY);
    changeHardwareOverlayVisibility.bind(this, false);
  };

  render() {
    const {
      active,
      ecu,
      device,
      changePopoverVisibility,
      popoverShown,
      copyPublicKey,
      publicKeyCopied,
      index,
      t
    } = this.props;
    return (
      <>
        <a
          href="#"
          id={`hardware-secondary-${ecu.id}`}
          className={`hardware-panel__ecu${active ? ' hardware-panel__ecu--selected' : ''}`}
          onClick={this.onEcuClick.bind(this, ecu)}
        >
          <div className="hardware-panel__ecu-desc">
            {t('devices.hardware.type')}
            <span id={`hardware-type-secondary-${index}`} className="hardware-panel__hardware-label app-label">
              {ecu.hardwareId}
            </span>
            <br />
            {t('devices.hardware.identifier')}
            <span id={`hardware-identifier-${ecu.id}`}>{ecu.id}</span>
          </div>
          <div className="hardware-panel__ecu-actions" id={`hardware-key-icon-secondary-${ecu.id}`}>
            <span className="hardware-panel__ecu-action hardware-panel__ecu-action--key">
              <PublicKeyPopover
                serial={ecu.id}
                device={device}
                handleCopy={copyPublicKey}
                changePopoverVisibility={changePopoverVisibility}
                copied={publicKeyCopied}
                active={active}
                popoverShown={popoverShown}
              />
            </span>
          </div>
        </a>
      </>
    );
  }
}

SecondaryEcu.propTypes = {
  active: PropTypes.bool,
  ecu: PropTypes.shape({}).isRequired,
  changeHardwareOverlayVisibility: PropTypes.func,
  popoverShown: PropTypes.bool,
  selectEcu: PropTypes.func,
  device: PropTypes.shape({}),
  changePopoverVisibility: PropTypes.func,
  copyPublicKey: PropTypes.func,
  publicKeyCopied: PropTypes.bool,
  index: PropTypes.number,
  t: PropTypes.func.isRequired
};

export default withTranslation()(SecondaryEcu);
