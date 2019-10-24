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

@inject('stores')
@observer
class Device extends Component {
  @observable packageCreateModalShown = false;

  @observable fileDropped = null;

  @observable activeTabId = '0';

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
  };

  selectEcu = (hardwareId, serial, filepath, type, e) => {
    if (e) e.preventDefault();
    const { stores } = this.props;
    const { softwareStore, devicesStore, hardwareStore } = stores;
    hardwareStore.activeEcu = {
      hardwareId,
      serial,
      type,
    };
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
  };

  installPackage = (data) => {
    const { stores } = this.props;
    const { devicesStore, hardwareStore } = stores;
    // eslint-disable-next-line no-param-reassign
    data.hardwareId = hardwareStore.activeEcu.hardwareId;
    devicesStore.createMultiTargetUpdate(data, devicesStore.device.uuid);
    this.selectQueue();
    this.setOverviewPanelActiveTabId('1');
  };

  togglePackageAutoUpdate = (packageName, deviceId, isAutoInstallEnabled, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const { stores } = this.props;
    const { softwareStore, hardwareStore } = stores;
    const activeEcuSerial = hardwareStore.activeEcu.serial;
    if (isAutoInstallEnabled) softwareStore.disablePackageAutoInstall(packageName, deviceId, activeEcuSerial);
    else softwareStore.enablePackageAutoInstall(packageName, deviceId, activeEcuSerial);
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
    const isPackageUnmanaged = pack === 'unmanaged';
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
