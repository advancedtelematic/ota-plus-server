/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PublicKeyPopover from './PublicKeyPopover';
import _ from 'lodash';
import DeviceHardwareOverlay from './Overlay';

@inject('stores')
@observer
class PrimaryEcu extends Component {
  onEcuClick = e => {
    if (e) e.preventDefault();
    const { selectEcu } = this.props;
    const { devicesStore } = this.props.stores;
    selectEcu(devicesStore._getPrimaryHardwareId(), devicesStore._getPrimarySerial(), devicesStore._getPrimaryFilepath(), 'primary');
  };

  constructor(props) {
    super(props);
    this.onEcuClick = this.onEcuClick.bind(this);
  }

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
      selectEcu,
      copyPublicKey,
      publicKeyCopied,
    } = this.props;
    const { devicesStore } = this.props.stores;
    return (
      <>
        <a href='#' className={'hardware-panel__ecu' + (active ? ' hardware-panel__ecu--selected' : '')} id='hardware-primary-details' onClick={this.onEcuClick.bind(this)}>
          <div className='hardware-panel__ecu-desc'>
            <span>
              {'Type: '}
              <span id='hardware-type-primary' className='hardware-panel__hardware-label app-label'>
                {devicesStore._getPrimaryHardwareId()}
              </span>
              <br />
              {'Identifier: '} <span id='hardware-identifier-value'>{devicesStore._getPrimarySerial()}</span>
            </span>
          </div>
          <div className='hardware-panel__ecu-actions'>
            <div className='hardware-panel__ecu-action hardware-panel__ecu-action--details' id='hardware-details-icon-primary'>
              <DeviceHardwareOverlay
                hardwareOverlayShown={hardwareOverlayShown}
                changeHardwareOverlayVisibility={changeHardwareOverlayVisibility}
                device={device}
                showPackageBlacklistModal={showPackageBlacklistModal}
                onFileDrop={onFileDrop}
                active={active}
              />
            </div>
            <div className='hardware-panel__ecu-action hardware-panel__ecu-action--key' id='hardware-key-icon-primary'>
              <PublicKeyPopover
                serial={devicesStore._getPrimarySerial()}
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
  handleCopy: PropTypes.func,
  handleRequestClose: PropTypes.func,
  handleTouchTap: PropTypes.func,
  popoverShown: PropTypes.bool,
  copied: PropTypes.bool,
  selectEcu: PropTypes.func,
  stores: PropTypes.object,
};

export default PrimaryEcu;
