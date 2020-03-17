/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, isObservableArray } from 'mobx';
import { Popover } from 'antd';
import { Form } from 'formsy-antd';
import { withTranslation } from 'react-i18next';

import DeviceHardwareReportedList from './ReportedList';
import { DeviceHardwarePackagesInstalledList } from './packages';
import { Loader, SubHeader, SearchBar } from '../../../partials';
import { sendAction } from '../../../helpers/analyticsHelper';
import { OTA_DEVICE_SEE_PRIMARY_HARDWARE, OTA_DEVICE_SEE_PRIMARY_PACKAGE } from '../../../constants/analyticsActions';
import { INFO_ICON_BLACK, INFO_ICON_WHITE } from '../../../config';

@inject('stores')
@observer
class Overlay extends Component {
  @observable
  hardwareInfoShown = true;

  componentWillMount() {
    const { device, stores } = this.props;
    const { hardwareStore, softwareStore } = stores;
    hardwareStore.fetchHardware(device.uuid);
    softwareStore.fetchOndevicePackages(device.uuid);
    softwareStore.fetchBlacklist();
  }

  showPackagesList = (e) => {
    if (e) e.preventDefault();
    this.hardwareInfoShown = false;
    this.changePackagesFilter('');
    sendAction(OTA_DEVICE_SEE_PRIMARY_HARDWARE);
  };

  showHardwareInfo = (e) => {
    if (e) e.preventDefault();
    this.hardwareInfoShown = true;
    this.changeHardwareFilter('');
    sendAction(OTA_DEVICE_SEE_PRIMARY_PACKAGE);
  };

  changeHardwareFilter = (filter) => {
    const { stores } = this.props;
    const { hardwareStore } = stores;
    hardwareStore.filterHardware(filter);
  };

  changePackagesFilter = (filter) => {
    const { device, stores } = this.props;
    const { softwareStore } = stores;
    softwareStore.fetchOndevicePackages(device.uuid, filter);
  };

  render() {
    const {
      changeHardwareOverlayVisibility,
      hardwareOverlayShown,
      device,
      showPackageBlacklistModal,
      onFileDrop,
      active,
      stores,
      t
    } = this.props;
    const { hardwareStore, softwareStore } = stores;
    const content = (
      <div id="hardware-overlay">
        <SubHeader>
          <div className="nav">
            <div className={`item${this.hardwareInfoShown ? ' active' : ''}`} onClick={this.showHardwareInfo}>
              <span id="show-hardware">{t('devices.hardware.hardware')}</span>
            </div>
            <div className={`item${!this.hardwareInfoShown ? ' active' : ''}`} onClick={this.showPackagesList}>
              <span id="show-packages">{t('devices.hardware.packages')}</span>
            </div>
          </div>
          <Form>
            {this.hardwareInfoShown ? (
              <SearchBar
                value={hardwareStore.hardwareFilter}
                changeAction={this.changeHardwareFilter}
                id="search-installed-hardware-input"
                additionalClassName="white"
              />
            ) : (
              <SearchBar
                value={softwareStore.ondeviceFilter}
                changeAction={this.changePackagesFilter}
                id="search-installed-packages-input"
                additionalClassName="white"
              />
            )}
          </Form>
        </SubHeader>
        {this.hardwareInfoShown ? (
          hardwareStore.hardwareFetchAsync.isFetching ? (
            <div className="wrapper-center">
              <Loader />
            </div>
          ) : (isObservableArray(hardwareStore.hardware) ? (
            !hardwareStore.hardware.length
          ) : (
            !Object.keys(hardwareStore.hardware).length
          )) ? (
            <div className="wrapper-center">{t('devices.hardware.no_hardware_reported')}</div>
            ) : (
              <div className="hardware-details">
                <DeviceHardwareReportedList hardware={hardwareStore.filteredHardware} />
              </div>
            )
        ) : (
          <div className="packages-details">
            <DeviceHardwarePackagesInstalledList
              device={device}
              showPackageBlacklistModal={showPackageBlacklistModal}
              onFileDrop={onFileDrop}
            />
          </div>
        )}
      </div>
    );
    const contentOfPopover = (
      <div>
        <div className="triangle" />
        <div className="content">
          <div>
            <div className="heading">
              <div className="internal">{t('devices.hardware.reports_by_ecu')}</div>
            </div>
            <div className="body">
              {content}
              <div className="body-actions">
                <a href="#" className="btn-primary" onClick={changeHardwareOverlayVisibility.bind(this, false)}>
                  {t('devices.hardware.close')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    return (
      <Popover
        trigger="click"
        overlayClassName="hardware-overlay-modal"
        placement="rightTop"
        visible={hardwareOverlayShown}
        content={contentOfPopover}
        onVisibleChange={changeHardwareOverlayVisibility}
      >
        {active ? (
          <img src={INFO_ICON_WHITE} className="hardware-panel__ecu-action--details-size" alt="Icon" />
        ) : (
          <img src={INFO_ICON_BLACK} className="hardware-panel__ecu-action--details-size" alt="Icon" />
        )}
      </Popover>
    );
  }
}

Overlay.propTypes = {
  stores: PropTypes.shape({}),
  hardware: PropTypes.shape({}),
  device: PropTypes.shape({}),
  changeHardwareOverlayVisibility: PropTypes.func,
  hardwareOverlayShown: PropTypes.bool,
  showPackageBlacklistModal: PropTypes.func.isRequired,
  onFileDrop: PropTypes.func,
  active: PropTypes.bool,
  t: PropTypes.func.isRequired
};

export default withTranslation()(Overlay);
