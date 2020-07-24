/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import { Trans, withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';

import { Header as BaseHeader, ConfirmationModal, EditModal, Dropdown } from '../../partials';
import { FadeAnimation } from '../../utils';
import NetworkInfo from './NetworkInfo';
import { getDeviceHttpStatusErrorMessage } from '../../helpers/deviceHelper';
import { DEVICE_STATUS_ERROR, DEVICE_STATUS_OUTDATED, DEVICE_STATUS_UP_TO_DATE } from '../../constants/deviceConstants';
import { DEVICE_SUMMARY_DATE_FORMAT } from '../../constants/datesTimesConstants';
import { getFormattedDateTime } from '../../helpers/datesTimesHelper';
import { sendAction } from '../../helpers/analyticsHelper';
import { OTA_DEVICE_DELETE } from '../../constants/analyticsActions';

@inject('stores')
@observer
class Header extends Component {
  @observable deleteConfirmationShown = false;

  @observable editNameShown = false;

  @observable headerMenuShown = false;

  showDeleteConfirmation = (e) => {
    if (e) e.preventDefault();
    this.deleteConfirmationShown = true;
  };

  hideDeleteConfirmation = () => {
    this.deleteConfirmationShown = false;
  };

  showEditName = (e) => {
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

  deleteDevice = (e) => {
    if (e) e.preventDefault();
    const { stores, history } = this.props;
    const { devicesStore } = stores;
    const { device } = devicesStore;
    devicesStore.deleteDevice(device.uuid).then(() => {
      history.push('/devices');
    });
    sendAction(OTA_DEVICE_DELETE);
  };

  render() {
    const { stores, t } = this.props;
    const { devicesStore } = stores;
    const { device } = devicesStore;
    let deviceStatus = t('devices.statuses.unknown');
    switch (device.deviceStatus) {
      case DEVICE_STATUS_UP_TO_DATE:
        deviceStatus = t('devices.statuses.synchronized');
        break;
      case DEVICE_STATUS_OUTDATED:
        deviceStatus = t('devices.statuses.unsynchronized');
        break;
      case DEVICE_STATUS_ERROR:
        deviceStatus = t('devices.statuses.error');
        break;
      default:
        break;
    }
    return (
      <BaseHeader
        title={(
          <FadeAnimation>
            {!devicesStore.devicesOneFetchAsync.isFetching && (
            <div id="device-name" className="page-header__device-name">
              {device.deviceName}
            </div>
            )}
          </FadeAnimation>
        )}
        device={device}
        backButtonShown
      >
        <FadeAnimation>
          {!devicesStore.devicesOneFetchAsync.isFetching && (
            <span>
              <div className="page-header__device-report">
                <div className="page-header__device-report-items">
                  <NetworkInfo data={devicesStore.deviceNetworkInfo} />
                  <div className="page-header__device-report-item" id="created-info">
                    <span className="page-header__device-report-label">{t('devices.hardware.created')}</span>
                    <div className="page-header__device-report-desc">
                      {device.createdAt
                        ? getFormattedDateTime(device.createdAt, DEVICE_SUMMARY_DATE_FORMAT)
                        : t('devices.statistics.not_reported')
                      }
                    </div>
                  </div>
                  <div className="page-header__device-report-item" id="activated-info">
                    <span className="page-header__device-report-label">{t('devices.hardware.activated')}</span>
                    <div className="page-header__device-report-desc">
                      {device.activatedAt
                        ? getFormattedDateTime(device.activatedAt, DEVICE_SUMMARY_DATE_FORMAT)
                        : t('devices.statistics.not_reported')
                      }
                    </div>
                  </div>
                  <div
                    className="page-header__device-report-item page-header__device-report-item--last-seen"
                    id="last-seen-online-info"
                  >
                    <span className="page-header__device-report-label">{t('devices.hardware.last-seen-online')}</span>
                    <div className="page-header__device-report-desc">
                      {deviceStatus !== t('devices.statuses.unknown')
                        ? getFormattedDateTime(device.lastSeen, DEVICE_SUMMARY_DATE_FORMAT)
                        : getDeviceHttpStatusErrorMessage(device.httpStatus)
                      }
                    </div>
                  </div>
                </div>
                <div className="page-header__actions">
                  <div className="dots relative" id="device-actions" onClick={this.toggleHeaderMenu}>
                    <span />
                    <span />
                    <span />
                    {this.headerMenuShown && (
                      <Dropdown hideSubmenu={this.hideHeaderMenu} customClassName="relative">
                        <li className="device-dropdown-item">
                          <a className="device-dropdown-item" id="edit-device" onClick={this.showEditName}>
                            {t('devices.rename')}
                          </a>
                        </li>
                        <li className="device-dropdown-item">
                          <a className="device-dropdown-item" id="delete-device" onClick={this.showDeleteConfirmation}>
                            {t('devices.delete')}
                          </a>
                        </li>
                      </Dropdown>
                    )}
                  </div>
                </div>
              </div>
              {this.deleteConfirmationShown && (
                <ConfirmationModal
                  modalTitle={<div className="text-red">{t('devices.delete')}</div>}
                  id="delete-device-confirmation-modal"
                  shown={this.deleteConfirmationShown}
                  hide={this.hideDeleteConfirmation}
                  deleteItem={this.deleteDevice}
                  topText={(
                    <Trans id="delete-device-confirmation-modal-text">
                      {t('devices.delete_confirmation', { device_name: device.deviceName })}
                    </Trans>
                  )}
                />
              )}
              {this.editNameShown && (
                <EditModal
                  modalTitle={<div>Rename device</div>}
                  shown={this.editNameShown}
                  hide={this.hideEditName}
                  device={device}
                />
              )}
            </span>
          )}
        </FadeAnimation>
      </BaseHeader>
    );
  }
}

Header.propTypes = {
  history: PropTypes.shape({}),
  stores: PropTypes.shape({}),
  t: PropTypes.func.isRequired
};

export default withTranslation()(withRouter(Header));
