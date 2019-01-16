/** @format */

import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'underscore';
import { Header as BaseHeader, Loader, ConfirmationModal, EditModal, Dropdown } from '../../partials';
import { FadeAnimation, AsyncStatusCallbackHandler } from '../../utils';
import NetworkInfo from './NetworkInfo';

@inject('stores')
@observer
class Header extends Component {
  @observable deleteConfirmationShown = false;
  @observable editNameShown = false;
  @observable headerMenuShown = false;

  showDeleteConfirmation = e => {
    if (e) e.preventDefault();
    this.deleteConfirmationShown = true;
  };
  hideDeleteConfirmation = () => {
    this.deleteConfirmationShown = false;
  };
  showEditName = e => {
    if (e) e.preventDefault();
    this.editNameShown = true;
  };
  hideEditName = () => {
    this.editNameShown = false;
  };
  hideHeaderMenu = () => {
    this.headerMenuShown = false;
  };
  toggleHeaderMenu = () => {
    this.headerMenuShown = true;
  };
  deleteDevice = e => {
    if (e) e.preventDefault();
    const { devicesStore } = this.props.stores;
    const { device } = devicesStore;
    devicesStore.deleteDevice(device.uuid).then(() => {
      this.context.router.push('/devices');
    });
  };
  render() {
    const { devicesStore } = this.props.stores;
    const { device } = devicesStore;
    const lastSeenDate = new Date(device.lastSeen);
    const createdDate = new Date(device.createdAt);
    const activatedDate = new Date(device.activatedAt);
    let deviceStatus = 'Status unknown';
    switch (device.deviceStatus) {
      case 'UpToDate':
        deviceStatus = 'Device synchronized';
        break;
      case 'Outdated':
        deviceStatus = 'Device unsynchronized';
        break;
      case 'Error':
        deviceStatus = 'Installation error';
        break;
      default:
        break;
    }
    return (
      <BaseHeader
        title={
          <FadeAnimation>
            {!devicesStore.devicesOneFetchAsync.isFetching ? (
              <div id='device-name' className='page-header__device-name'>
                {device.deviceName}
              </div>
            ) : null}
          </FadeAnimation>
        }
        device={device}
        backButtonShown={true}
      >
        <FadeAnimation>
          {!devicesStore.devicesOneFetchAsync.isFetching ? (
            <span>
              <div className='page-header__device-report'>
                <div className='page-header__device-report-items'>
                  <NetworkInfo data={devicesStore.deviceNetworkInfo} />
                  <div className='page-header__device-report-item' id='created-info'>
                    <span className='page-header__device-report-label'>Created</span>
                    <div className='page-header__device-report-desc'>{createdDate.toDateString() + ' ' + createdDate.toLocaleTimeString()}</div>
                  </div>
                  <div className='page-header__device-report-item' id='activated-info'>
                    <span className='page-header__device-report-label'>Activated</span>
                    <div className='page-header__device-report-desc'>
                      {device.activatedAt !== null ? <span>{activatedDate.toDateString() + ' ' + activatedDate.toLocaleTimeString()}</span> : <span>Device not activated</span>}
                    </div>
                  </div>
                  <div className='page-header__device-report-item page-header__device-report-item--last-seen' id='last-seen-online-info'>
                    <span className='page-header__device-report-label'>Last seen online</span>
                    <div className='page-header__device-report-desc'>
                      {deviceStatus !== 'Status unknown' ? <span>{lastSeenDate.toDateString() + ' ' + lastSeenDate.toLocaleTimeString()}</span> : <span>Never seen online</span>}
                    </div>
                  </div>
                </div>
                <div className='page-header__actions'>
                  <div className='dots relative' id='device-actions' onClick={this.toggleHeaderMenu}>
                    <span />
                    <span />
                    <span />

                    {this.headerMenuShown ? (
                      <Dropdown hideSubmenu={this.hideHeaderMenu} customClassName={'relative'}>
                        <li className='device-dropdown-item'>
                          <a className='device-dropdown-item' id='edit-device' onClick={this.showEditName}>
                            <img src='/assets/img/icons/edit_icon.svg' alt='Icon' />
                            Edit device
                          </a>
                        </li>
                        <li className='device-dropdown-item'>
                          <a className='device-dropdown-item' id='delete-device' onClick={this.showDeleteConfirmation}>
                            <img src='/assets/img/icons/trash_icon.svg' alt='Icon' />
                            Delete device
                          </a>
                        </li>
                      </Dropdown>
                    ) : null}
                  </div>
                </div>
              </div>
              {this.deleteConfirmationShown ? (
                <ConfirmationModal
                  modalTitle={<div className='text-red'>Delete device</div>}
                  id='delete-device-confirmation-modal'
                  shown={this.deleteConfirmationShown}
                  hide={this.hideDeleteConfirmation}
                  deleteItem={this.deleteDevice}
                  topText={
                    <div className='delete-modal-top-text' id='delete-device-confirmation-modal-text'>
                      Device will be removed.
                    </div>
                  }
                />
              ) : null}
              {this.editNameShown ? <EditModal modalTitle={<div>Edit name</div>} shown={this.editNameShown} hide={this.hideEditName} device={device} /> : null}
            </span>
          ) : null}
        </FadeAnimation>
      </BaseHeader>
    );
  }
}

Header.propTypes = {
  stores: PropTypes.object,
};

Header.wrappedComponent.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

export default Header;
