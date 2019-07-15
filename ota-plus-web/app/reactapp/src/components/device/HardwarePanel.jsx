/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'lodash';
import { DeviceHardwareSecondaryEcuDetails, DevicePrimaryEcu, DeviceSecondaryEcu } from './hardware';
import { FadeAnimation } from '../../utils';
import { PackageBlacklistModal } from '../software';

const title = 'Hardware';
const primaryEcusTitle = 'Primary Ecu';
const secondaryEcusTitle = 'Secondary Ecus';
const noEcus = 'None reported';

@inject('stores')
@observer
class HardwarePanel extends Component {
  @observable
  secondaryDescriptionShown = false;

  @observable
  popoverShownFor = false;

  @observable
  publicKeyCopiedFor = false;

  @observable
  hardwareOverlayShown = false;

  @observable
  packageBlacklistModalShown = false;

  @observable
  packageBlacklistAction = {};

  onSelectQueue = () => {
    const { selectQueue } = this.props;
    selectQueue();
  };

  showSecondaryDescription = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.secondaryDescriptionShown = true;
    this.hardwareOverlayShown = false;
  };

  hideSecondaryDescription = (e) => {
    if (e) e.preventDefault();
    this.secondaryDescriptionShown = false;
  };

  changePopoverVisibility = (id, visibility) => {
    this.hardwareOverlayShown = false;
    this.popoverShownFor = visibility ? id : false;
    if (!visibility) {
      this.resetCopyPublicKey();
    }
  };

  copyPublicKey = (id) => {
    this.publicKeyCopiedFor = id;
  };

  resetCopyPublicKey = () => {
    this.publicKeyCopiedFor = false;
  };

  changeHardwareOverlayVisibility = (visibility) => {
    this.hardwareOverlayShown = !!visibility;
  };

  showPackageBlacklistModal = (name, version, mode, e) => {
    if (e) e.preventDefault();
    this.packageBlacklistModalShown = true;
    this.packageBlacklistAction = {
      name,
      version,
      mode,
    };

    this.hardwareOverlayShown = false;
  };

  hidePackageBlacklistModal = (e) => {
    const { stores } = this.props;
    const { softwareStore } = stores;
    if (e) e.preventDefault();
    this.packageBlacklistModalShown = false;
    this.packageBlacklistAction = {};
    softwareStore.resetBlacklistActions();
  };

  render() {
    const { selectEcu, onFileDrop, ECUselected, stores } = this.props;
    const { devicesStore, hardwareStore } = stores;
    const { device } = devicesStore;
    const isPrimaryEcuActive = hardwareStore.activeEcu.hardwareId === devicesStore.getPrimaryHardwareId();
    const primaryEcus = (
      <span>
        <div className="hardware-panel__title">{primaryEcusTitle}</div>
        <DevicePrimaryEcu
          showPackageBlacklistModal={this.showPackageBlacklistModal}
          onFileDrop={onFileDrop}
          hardwareOverlayShown={this.hardwareOverlayShown}
          changeHardwareOverlayVisibility={this.changeHardwareOverlayVisibility}
          device={device}
          active={isPrimaryEcuActive}
          selectEcu={selectEcu}
          popoverShown={this.popoverShownFor === devicesStore.getPrimarySerial()}
          changePopoverVisibility={this.changePopoverVisibility}
          copyPublicKey={this.copyPublicKey}
          publicKeyCopied={this.publicKeyCopiedFor === devicesStore.getPrimarySerial()}
        />
      </span>
    );
    const secondaryEcus = (
      <span>
        <div className="hardware-panel__title">
          {secondaryEcusTitle}
          {isPrimaryEcuActive ? (
            <img
              src="/assets/img/icons/black/questionmark.svg"
              alt=""
              className="hardware-panel__icon-secondary"
              onClick={this.showSecondaryDescription}
              id="hardware-secondary-ecu-details"
            />
          ) : (
            <img
              src="/assets/img/icons/white/questionmark.svg"
              alt=""
              className="hardware-panel__icon-secondary"
              onClick={this.showSecondaryDescription}
              id="hardware-secondary-ecu-details"
            />
          )}
        </div>
        {!_.isEmpty(device.directorAttributes.secondary) || device.directorAttributes.secondary.length ? (
          _.map(device.directorAttributes.secondary, (item, index) => (
            <DeviceSecondaryEcu
              active={hardwareStore.activeEcu.serial === item.id}
              device={device}
              ecu={item}
              selectEcu={selectEcu}
              popoverShown={this.popoverShownFor === item.id}
              changePopoverVisibility={this.changePopoverVisibility}
              changeHardwareOverlayVisibility={this.changeHardwareOverlayVisibility}
              copyPublicKey={this.copyPublicKey}
              publicKeyCopied={this.publicKeyCopiedFor === item.id}
              key={index}
              index={index}
            />
          ))
        ) : (
          <div className="hardware-panel__no-ecus" id="hardware-secondary-not-available">
            {noEcus}
          </div>
        )}
      </span>
    );
    return (
      <div className="hardware-panel">
        <div
          className={`hardware-panel__overview ${!ECUselected ? 'hardware-panel__overview--selected' : ''}`}
          onClick={this.onSelectQueue}
        >
          <button type="button" className="hardware-panel__overview-button">OVERVIEW</button>
        </div>
        <div className="hardware-panel__header">{title}</div>
        <div className="hardware-panel__wrapper">
          <div className="hardware-panel__primary">{primaryEcus}</div>
          <div className="hardware-panel__secondaries">{secondaryEcus}</div>
          {this.secondaryDescriptionShown ? (
            <FadeAnimation>
              <div className="overlay-animation-container">
                <DeviceHardwareSecondaryEcuDetails
                  hideDetails={this.hideSecondaryDescription}
                  shown={this.secondaryDescriptionShown}
                />
              </div>
            </FadeAnimation>
          ) : null}
        </div>
        <PackageBlacklistModal
          shown={this.packageBlacklistModalShown}
          hide={this.hidePackageBlacklistModal}
          blacklistAction={this.packageBlacklistAction}
        />
      </div>
    );
  }
}

HardwarePanel.propTypes = {
  stores: PropTypes.shape({}),
  selectEcu: PropTypes.func.isRequired,
  onFileDrop: PropTypes.func.isRequired,
  selectQueue: PropTypes.func,
  ECUselected: PropTypes.bool
};

export default HardwarePanel;
