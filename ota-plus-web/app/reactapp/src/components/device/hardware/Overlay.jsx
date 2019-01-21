/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, isObservableArray } from 'mobx';
import DeviceHardwareReportedList from './ReportedList';
import { DeviceHardwarePackagesInstalledList } from './packages';
import { Popover } from 'antd';
import { Loader } from '../../../partials';
import { Form } from 'formsy-antd';
import { SubHeader, SearchBar } from '../../../partials';

const noHardwareReported = 'This device hasn’t reported any information about its hardware or system components yet.';

@inject('stores')
@observer
class Overlay extends Component {
  @observable
  hardwareInfoShown = true;

  componentWillMount() {
    const { device } = this.props;
    const { hardwareStore, packagesStore } = this.props.stores;
    hardwareStore.fetchHardware(device.uuid);
    packagesStore.fetchOndevicePackages(device.uuid);
    packagesStore.fetchBlacklist();
  }

  showPackagesList = e => {
    if (e) e.preventDefault();
    this.hardwareInfoShown = false;
    this.changePackagesFilter('');
  };

  showHardwareInfo = e => {
    if (e) e.preventDefault();
    this.hardwareInfoShown = true;
    this.changeHardwareFilter('');
  };

  changeHardwareFilter = filter => {
    const { hardwareStore } = this.props.stores;
    hardwareStore._filterHardware(filter);
  };

  changePackagesFilter = filter => {
    const { device } = this.props;
    const { packagesStore } = this.props.stores;
    packagesStore.fetchOndevicePackages(device.uuid, filter);
  };

  render() {
    const { changeHardwareOverlayVisibility, hardwareOverlayShown, device, showPackageBlacklistModal, onFileDrop, active } = this.props;
    const { hardwareStore, packagesStore } = this.props.stores;
    let content = (
      <div id='hardware-overlay'>
        <SubHeader>
          <div className='nav'>
            <div className={'item' + (this.hardwareInfoShown ? ' active' : '')} onClick={this.showHardwareInfo}>
              <span id='show-hardware'>Hardware</span>
            </div>
            <div className={'item' + (!this.hardwareInfoShown ? ' active' : '')} onClick={this.showPackagesList}>
              <span id='show-packages'>Packages</span>
            </div>
          </div>
          <Form>
            {this.hardwareInfoShown ? (
              <SearchBar value={hardwareStore.hardwareFilter} changeAction={this.changeHardwareFilter} id='search-installed-hardware-input' additionalClassName='white' />
            ) : (
              <SearchBar value={packagesStore.ondeviceFilter} changeAction={this.changePackagesFilter} id='search-installed-packages-input' additionalClassName='white' />
            )}
          </Form>
        </SubHeader>
        {this.hardwareInfoShown ? (
          hardwareStore.hardwareFetchAsync.isFetching ? (
            <div className='wrapper-center'>
              <Loader />
            </div>
          ) : (isObservableArray(hardwareStore.hardware) ? (
              !hardwareStore.hardware.length
            ) : (
              !Object.keys(hardwareStore.hardware).length
            )) ? (
            <div className='wrapper-center'>{noHardwareReported}</div>
          ) : (
            <div className='hardware-details'>
              <DeviceHardwareReportedList hardware={hardwareStore.filteredHardware} />
            </div>
          )
        ) : (
          <div className='packages-details'>
            <DeviceHardwarePackagesInstalledList device={device} showPackageBlacklistModal={showPackageBlacklistModal} onFileDrop={onFileDrop} />
          </div>
        )}
      </div>
    );
    const contentOfPopover = (
      <div>
        <div className='triangle' />
        <div className='content'>
          <div>
            <div className='heading'>
              <div className='internal'>Reports by this ECU</div>
            </div>
            <div className='body'>
              {content}
              <div className='body-actions'>
                <a href='#' className='btn-primary' onClick={changeHardwareOverlayVisibility.bind(this, false)}>
                  Close
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    return (
      <Popover
        trigger='click'
        overlayClassName='hardware-overlay-modal'
        placement='rightTop'
        visible={hardwareOverlayShown}
        content={contentOfPopover}
        onVisibleChange={changeHardwareOverlayVisibility}
      >
        {active ? (
          <img src='/assets/img/icons/white/info.svg' className='hardware-panel__ecu-action--details-size' alt='Icon' />
        ) : (
          <img src='/assets/img/icons/black/info.svg' className='hardware-panel__ecu-action--details-size' alt='Icon' />
        )}
      </Popover>
    );
  }
}

Overlay.propTypes = {
  // hardware: PropTypes.object,
  // shown: PropTypes.bool.isRequired,
};

export default Overlay;
