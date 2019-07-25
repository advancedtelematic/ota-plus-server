/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';
import { Tooltip } from 'antd';

import InstallationEvents from '../InstallationEvents';
import Loader from '../../../partials/Loader';

@inject('stores')
@observer
class MtuListItem extends Component {
  render() {
    const { update, cancelMtuUpdate, events, stores, t } = this.props;
    const { devicesStore } = stores;
    const { device } = devicesStore;
    const devicePrimaryEcu = device.directorAttributes.primary;
    const deviceSecondaryEcus = device.directorAttributes.secondary;
    const { correlationId, targets, campaign } = update;
    const type = campaign ? 'campaign' : 'singleInstallation';

    return (
      <li className="overview-panel__item">
        {type === 'campaign' ? (
          <div className="overview-panel__item-header">
            <div className="overview-panel__item-header--title overview-panel__item-header--title__queue">
              <div>
                <span id={`update-id-title-${correlationId}`} className="overview-panel__item-header--title__label">
                  {t('devices.mtu.common.campaign')}
                </span>
                <span id={`update-id-${correlationId}`}>{campaign.name}</span>
              </div>
              <div>
                <Tooltip title={t('devices.mtu.approval_pending.cancel_tooltip_info')} placement="left">
                  <button
                    type="button"
                    id="cancel-mtu"
                    className="ant-btn ant-btn--sm ant-btn-error"
                    onClick={cancelMtuUpdate.bind(this, correlationId)}
                  >
                    {t('devices.mtu.common.cancel')}
                  </button>
                </Tooltip>
              </div>
            </div>
            <div className="overview-panel__item-header--update">
              <div className="overview-panel__item-header--update__name">
                <span id={`update-id-title-${correlationId}`} className="overview-panel__item-header__label">
                  {t('devices.mtu.common.update_name')}
                </span>
                <span id={`update-id-${correlationId}`}>{campaign.update.name}</span>
              </div>
              <div className="overview-panel__item-header--update__description">
                <span id={`update-id-title-${correlationId}`} className="overview-panel__item-header__label">
                  {t('devices.mtu.common.update_description')}
                </span>
                <span id={`update-id-${correlationId}`}>{campaign.update.description}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="overview-panel__item-header">
            <div className="overview-panel__item-header--title overview-panel__item-header--title__queue">
              <div>
                <span id={`update-id-title-${correlationId}`} className="overview-panel__item-header--title__label">
                  {t('devices.mtu.common.single_device_update')}
                </span>
              </div>
              <div>
                <button
                  type="button"
                  id="cancel-mtu"
                  className="ant-btn ant-btn--sm ant-btn-error"
                  onClick={cancelMtuUpdate.bind(this, correlationId)}
                >
                  {t('devices.mtu.common.cancel')}
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="overview-panel__operations">
          {_.map(targets, (target, serial) => {
            let hardwareId = null;
            if (devicePrimaryEcu.id === serial) {
              const { hardwareId: primaryHardwareId } = devicePrimaryEcu;
              hardwareId = primaryHardwareId;
            }
            const serialFromSecondary = _.find(deviceSecondaryEcus, ecu => ecu.id === serial);
            if (serialFromSecondary) {
              const { hardwareId: secondaryHardwareId } = serialFromSecondary;
              hardwareId = secondaryHardwareId;
            }
            const hash = target.image.fileinfo.hashes.sha256;
            const { filepath } = target.image;
            const { length } = target.image.fileinfo;
            return (
              <div className="overview-panel__operation overview-panel__operation__queued" key={hash}>
                <div className="overview-panel__label overview-panel__label--queued">{t('common.statuses.queued')}</div>
                <div className="overview-panel__operation-info">
                  <div className="overview-panel__operation-info-line">
                    <div className="overview-panel__operation-info-block">
                      <span id={`ecu-serial-title-${correlationId}`} className="overview-panel__operation-info--label">
                        {t('devices.mtu.common.ecu_type')}
                      </span>
                      <span id={`ecu-serial-${correlationId}`}>{hardwareId}</span>
                    </div>
                    <div className="overview-panel__operation-info-block">
                      <span id={`ecu-serial-title-${correlationId}`} className="overview-panel__operation-info--label">
                        {t('devices.mtu.common.ecu_identifier')}
                      </span>
                      <span id={`ecu-serial-${correlationId}`}>{serial}</span>
                    </div>
                  </div>
                  <div className="overview-panel__operation-info-line">
                    <div className="overview-panel__operation-info-block">
                      <span id={`target-title-${correlationId}`} className="overview-panel__operation-info--label">
                        {t('devices.mtu.common.target')}
                      </span>
                      <span id={`target-${correlationId}`}>{filepath}</span>
                    </div>
                    {length !== 0 ? (
                      <div className="overview-panel__operation-info-block">
                        <span id={`length-title-${correlationId}`} className="overview-panel__operation-info--label">
                          {t('devices.mtu.common.length')}
                        </span>
                        <span id={`length-${correlationId}`}>
                          {length.toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <div className="overview-panel__operation-info-block" />
                    )}
                  </div>
                  {events.length ? (
                    devicesStore.eventsFetchAsync.isFetching ? (
                      <div className="wrapper-center">
                        <Loader />
                      </div>
                    ) : (
                      <InstallationEvents events={events} />
                    )
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </li>
    );
  }
}

MtuListItem.propTypes = {
  stores: PropTypes.shape({}),
  update: PropTypes.shape({}),
  cancelMtuUpdate: PropTypes.func,
  events: PropTypes.arrayOf(PropTypes.shape({})),
  t: PropTypes.func.isRequired
};

export default withTranslation()(MtuListItem);
