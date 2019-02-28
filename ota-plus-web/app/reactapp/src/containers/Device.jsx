/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Loader } from '../partials';
import { DeviceHeader, DeviceHardwarePanel, DevicePropertiesPanel, DeviceSoftwarePanel, DeviceOverviewPanel } from '../components/device';
import { SoftwareCreateModal } from '../components/software';

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
    const { hardwareStore } = this.props.stores;
    hardwareStore.activeEcu = {
      hardwareId: null,
      serial: null,
      type: null,
    };
  };
  cancelMtuUpdate = correlationId => {
    const { devicesStore } = this.props.stores;
    let deviceId = devicesStore.device.uuid;
    let data = {
      correlationId: correlationId,
      device: deviceId,
    };
    devicesStore.cancelMtuUpdate(data);
  };
  cancelApprovalPendingCampaign = campaignId => {
    let campaignCorrelationId = 'urn:here-ota:campaign:' + campaignId;
    const { devicesStore } = this.props.stores;
    let deviceId = devicesStore.device.uuid;
    let data = {
      correlationId: campaignCorrelationId,
      device: deviceId,
    };
    devicesStore.cancelApprovalPendingCampaingPerDevice(data);
  };
  selectEcu = (hardwareId, serial, filepath, type, e) => {
    if (e) e.preventDefault();
    const { softwareStore, devicesStore, hardwareStore } = this.props.stores;
    hardwareStore.activeEcu = {
      hardwareId: hardwareId,
      serial: serial,
      type: type,
    };
    let expandedPackage = softwareStore._getInstalledPackage(filepath, hardwareId);
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
    const { hardwareStore } = this.props.stores;
    hardwareStore.activeEcu = {
      hardwareId: null,
      serial: null,
      type: null,
    };
  };
  installPackage = data => {
    const { devicesStore, hardwareStore } = this.props.stores;
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
    const { softwareStore, hardwareStore } = this.props.stores;
    let activeEcuSerial = hardwareStore.activeEcu.serial;
    if (isAutoInstallEnabled) softwareStore.disablePackageAutoInstall(packageName, deviceId, activeEcuSerial);
    else softwareStore.enablePackageAutoInstall(packageName, deviceId, activeEcuSerial);
  };
  togglePackage = packageName => {
    this.expandedPackageName = this.expandedPackageName !== packageName ? packageName : null;
  };
  showPackageCreateModal = (files, e) => {
    if (e) e.preventDefault();
    this.packageCreateModalShown = true;
    this.fileDropped = files ? files[0] : null;
  };
  hidePackageCreateModal = e => {
    if (e) e.preventDefault();
    this.packageCreateModalShown = false;
    this.fileDropped = null;
  };
  onFileDrop = files => {
    this.showPackageCreateModal(files);
  };
  showPackageDetails = (pack, e) => {
    if (e) e.preventDefault();
    const { softwareStore } = this.props.stores;
    let isPackageUnmanaged = pack === 'unmanaged';
    if (isPackageUnmanaged) {
      softwareStore.expandedPackage = {
        unmanaged: true,
      };
    } else {
      softwareStore.expandedPackage = pack;
    }
  };
  setOverviewPanelActiveTabId = tabId => {
    this.activeTabId = tabId;
  };

  render() {
    const { devicesStore, softwareStore } = this.props.stores;
    const { device } = devicesStore;
    return (
      <span>
        <DeviceHeader />
        {devicesStore.devicesOneFetchAsync.isFetching ? (
          <div className='wrapper-center'>
            <Loader />
          </div>
        ) : device.lastSeen ? (
          <span>
            {softwareStore.packagesFetchAsync.isFetching ? (
              <div className='wrapper-center'>
                <Loader />
              </div>
            ) : (
              <DeviceHardwarePanel selectEcu={this.selectEcu} onFileDrop={this.onFileDrop} ECUselected={this.ECUselected} selectQueue={this.selectQueue} />
            )}
            {!this.ECUselected ? (
              devicesStore.approvalPendingCampaignsFetchAsync.isFetching || devicesStore.mtuFetchAsync.isFetching || softwareStore.packagesHistoryFetchAsync.isFetching ? (
                <ul className='overview-panel__list'>
                  <div className='wrapper-center'>
                    <Loader />
                  </div>
                </ul>
              ) : (
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
          <div className='wrapper-center'>
            <div className='device-offline-title'>Device never seen online.</div>
          </div>
        )}
        {this.packageCreateModalShown ? <SoftwareCreateModal shown={this.packageCreateModalShown} hide={this.hidePackageCreateModal} fileDropped={this.fileDropped} /> : null}
      </span>
    );
  }
}

Device.propTypes = {
  stores: PropTypes.object,
};

export default Device;
