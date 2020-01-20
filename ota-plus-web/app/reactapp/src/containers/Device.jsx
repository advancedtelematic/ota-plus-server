/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Loader } from '../partials';
import {
  DeviceHeader,
  DeviceHardwarePanel,
  DevicePropertiesPanel,
  DeviceSoftwarePanel,
  DeviceOverviewPanel
} from '../components/device';
import { SoftwareCreateModal } from '../components/software';
import { getDeviceHttpStatusErrorMessage } from '../helpers/deviceHelper';
import { sendAction } from '../helpers/analyticsHelper';
import {
  OTA_DEVICE_CANCEL_CAMPAIGN,
  OTA_DEVICE_SEE_OVERVIEW,
  OTA_DEVICE_SEE_CONTROL_UNIT,
  OTA_DEVICE_SEE_HISTORY,
  OTA_DEVICE_SEE_INSTALLATION_PENDING,
  OTA_DEVICE_SEE_CONSENT_PENDING,
  OTA_DEVICE_LAUNCH_AUTOMATIC_UPDATE,
  OTA_DEVICE_LAUNCH_SINGLE_UPDATE
} from '../constants/analyticsActions';
import {
  OVERVIEW_PANEL_TAB_ID_0,
  OVERVIEW_PANEL_TAB_ID_1,
  OVERVIEW_PANEL_TAB_ID_2
} from '../constants/deviceConstants';
import { DDV_ACTIVE_TAB_ID, UNMANAGED_KEY } from '../config';

@inject('stores')
@observer
class Device extends Component {
  @observable packageCreateModalShown = false;

  @observable fileDropped = null;

  @observable activeTabId = DDV_ACTIVE_TAB_ID;

  @observable ECUselected = false;

  @observable triggerPackages = false;

  @observable expandedPackageName = null;

  componentWillUnmount = () => {
    const { stores } = this.props;
    const { hardwareStore } = stores;
    hardwareStore.activeEcu = {
      hardwareId: null,
      serial: null,
      type: null,
    };
  };

  cancelMtuUpdate = () => {
    const { stores } = this.props;
    const { devicesStore } = stores;
    const deviceId = devicesStore.device.uuid;
    devicesStore.cancelMtuUpdate(deviceId);
  };

  cancelApprovalPendingCampaign = (campaignId) => {
    const { stores } = this.props;
    const { devicesStore } = stores;
    const deviceId = devicesStore.device.uuid;
    devicesStore.cancelApprovalPendingCampaingPerDevice(campaignId, deviceId);
    sendAction(OTA_DEVICE_CANCEL_CAMPAIGN);
  };

  selectEcu = (hardwareId, serial, filepath, type, e) => {
    if (e) e.preventDefault();
    const { stores } = this.props;
    const { softwareStore, devicesStore, hardwareStore } = stores;
    if (hardwareId !== hardwareStore.activeEcu.hardwareId) {
      sendAction(OTA_DEVICE_SEE_CONTROL_UNIT);
      hardwareStore.activeEcu = {
        hardwareId,
        serial,
        type,
      };
    }
    const expandedPackage = softwareStore.getInstalledPackage(filepath, hardwareId);
    if (!expandedPackage) {
      softwareStore.expandedPackage = {
        unmanaged: true,
      };
      this.expandedPackageName = null;
    } else {
      softwareStore.expandedPackage = expandedPackage;
      this.expandedPackageName = expandedPackage.id.name;
    }
    softwareStore.fetchAutoInstalledPackages(devicesStore.device.uuid, serial);
    this.triggerPackages = true;

    this.ECUselected = true;
  };

  selectQueue = () => {
    this.ECUselected = false;
    const { stores } = this.props;
    const { hardwareStore } = stores;
    hardwareStore.activeEcu = {
      hardwareId: null,
      serial: null,
      type: null,
    };
    sendAction(OTA_DEVICE_SEE_OVERVIEW);
  };

  installPackage = (data) => {
    const { stores } = this.props;
    const { devicesStore, hardwareStore } = stores;
    // eslint-disable-next-line no-param-reassign
    data.hardwareId = hardwareStore.activeEcu.hardwareId;
    devicesStore.createMultiTargetUpdate(data, devicesStore.device.uuid);
    this.selectQueue();
    this.setOverviewPanelActiveTabId(OVERVIEW_PANEL_TAB_ID_1);
  };

  togglePackageAutoUpdate = (packageName, deviceId, isAutoInstallEnabled, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const { stores } = this.props;
    const { softwareStore, hardwareStore } = stores;
    const activeEcuSerial = hardwareStore.activeEcu.serial;
    if (isAutoInstallEnabled) {
      softwareStore.disablePackageAutoInstall(packageName, deviceId, activeEcuSerial);
      sendAction(OTA_DEVICE_LAUNCH_AUTOMATIC_UPDATE);
    } else {
      softwareStore.enablePackageAutoInstall(packageName, deviceId, activeEcuSerial);
      sendAction(OTA_DEVICE_LAUNCH_SINGLE_UPDATE);
    }
  };

  togglePackage = (packageName) => {
    this.expandedPackageName = this.expandedPackageName !== packageName ? packageName : null;
  };

  showPackageCreateModal = (files, e) => {
    if (e) e.preventDefault();
    this.packageCreateModalShown = true;
    this.fileDropped = files ? files[0] : null;
  };

  hidePackageCreateModal = (e) => {
    if (e) e.preventDefault();
    this.packageCreateModalShown = false;
    this.fileDropped = null;
  };

  onFileDrop = (files) => {
    this.showPackageCreateModal(files);
  };

  showPackageDetails = (pack, e) => {
    if (e) e.preventDefault();
    const { stores } = this.props;
    const { softwareStore } = stores;
    const isPackageUnmanaged = pack === UNMANAGED_KEY;
    if (isPackageUnmanaged) {
      softwareStore.expandedPackage = {
        unmanaged: true,
      };
    } else {
      softwareStore.expandedPackage = pack;
    }
  };

  setOverviewPanelActiveTabId = (tabId) => {
    this.activeTabId = tabId;
    if (!this.ECUselected) {
      switch (tabId) {
        case OVERVIEW_PANEL_TAB_ID_0:
        default:
          sendAction(OTA_DEVICE_SEE_HISTORY);
          break;
        case OVERVIEW_PANEL_TAB_ID_1:
          sendAction(OTA_DEVICE_SEE_INSTALLATION_PENDING);
          break;
        case OVERVIEW_PANEL_TAB_ID_2:
          sendAction(OTA_DEVICE_SEE_CONSENT_PENDING);
          break;
      }
    }
  };

  render() {
    const { stores } = this.props;
    const { devicesStore, softwareStore } = stores;
    const { device } = devicesStore;
    return (
      <span>
        <DeviceHeader />
        {devicesStore.devicesOneFetchAsync.isFetching ? (
          <div className="wrapper-center">
            <Loader />
          </div>
        ) : device.lastSeen ? (
          <span>
            {softwareStore.packagesFetchAsync.isFetching ? (
              <div className="wrapper-center">
                <Loader />
              </div>
            ) : (
              <DeviceHardwarePanel
                selectEcu={this.selectEcu}
                onFileDrop={this.onFileDrop}
                ECUselected={this.ECUselected}
                selectQueue={this.selectQueue}
              />
            )}
            {!this.ECUselected ? (
              devicesStore.approvalPendingCampaignsFetchAsync.isFetching
                ? (
                  <ul className="overview-panel__list">
                    <div className="wrapper-center">
                      <Loader />
                    </div>
                  </ul>
                )
                : (
                  <DeviceOverviewPanel
                    cancelMtuUpdate={this.cancelMtuUpdate}
                    cancelApprovalPendingCampaign={this.cancelApprovalPendingCampaign}
                    activeTabId={this.activeTabId}
                    setOverviewPanelActiveTabId={this.setOverviewPanelActiveTabId}
                  />
                )
            ) : (
              <span>
                <DeviceSoftwarePanel
                  togglePackageAutoUpdate={this.togglePackageAutoUpdate}
                  onFileDrop={this.onFileDrop}
                  showPackageDetails={this.showPackageDetails}
                  triggerPackages={this.triggerPackages}
                  expandedPackageName={this.expandedPackageName}
                  togglePackage={this.togglePackage}
                />
                <DevicePropertiesPanel installPackage={this.installPackage} />
              </span>
            )}
          </span>
        ) : (
          <div className="wrapper-center">
            <div className="device-offline-title">
              {getDeviceHttpStatusErrorMessage(device.httpStatus)}
            </div>
          </div>
        )}
        {this.packageCreateModalShown && (
          <SoftwareCreateModal
            shown={this.packageCreateModalShown}
            hide={this.hidePackageCreateModal}
            fileDropped={this.fileDropped}
          />
        )}
      </span>
    );
  }
}

Device.propTypes = {
  stores: PropTypes.shape({}),
};

export default Device;
