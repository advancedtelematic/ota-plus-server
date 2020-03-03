/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import moment from 'moment';
import { withTranslation } from 'react-i18next';

import InstallationEvents from '../InstallationEvents';
import Loader from '../../../partials/Loader';
import { DEVICE_MTU_RECEIVED_AT } from '../../../constants/datesTimesConstants';

@inject('stores')
@observer
class MtuListItem extends Component {
  render() {
    const { item, events, stores, t } = this.props;
    const { devicesStore } = stores;
    const { device } = devicesStore;
    const devicePrimaryEcu = device.directorAttributes.primary;
    const deviceSecondaryEcus = device.directorAttributes.secondary;
    const type = item.campaign ? 'campaign' : 'singleInstallation';

    return (
      <li className="overview-panel__item overview-panel__item-history">
        <div className="overview-panel__item-header">
          {type === 'campaign' ? (
            <div>
              <div className="overview-panel__item-header--title">
                <div>
                  <span id={`update-id-title-${item.correlationId}`} className="overview-panel__item-header--title__label">
                    {t('devices.mtu.common.campaign')}
                  </span>
                  <span id={`update-id-${item.correlationId}`}>{item.campaign.name}</span>
                </div>
              </div>
              <div className="overview-panel__item-header--update">
                <div className="overview-panel__item-header--update__name">
                  <span id={`update-id-title-${item.correlationId}`} className="overview-panel__item-header__label">
                    {t('devices.mtu.common.update_name')}
                  </span>
                  <span id={`update-id-${item.correlationId}`}>{item.campaign.update.name}</span>
                </div>
                <div className="overview-panel__item-header--update__description">
                  <span id={`update-id-title-${item.correlationId}`} className="overview-panel__item-header__label">
                    {t('devices.mtu.common.update_description')}
                  </span>
                  <span id={`update-id-${item.correlationId}`}>{item.campaign.update.description}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="overview-panel__item-header--title">
              <div>
                <span id={`update-id-title-${item.correlationId}`} className="overview-panel__item-header--title__label">
                  {t('devices.mtu.common.single_device_update')}
                </span>
              </div>
            </div>
          )}
          <div className="overview-panel__item-header__created">
            <span id={`received-at-title-${item.correlationId}`} className="overview-panel__item-header__label">
              {t('devices.mtu.history.received_at')}
            </span>
            <span id={`received-at-${item.correlationId}`}>
              {moment(item.eventTime ? item.eventTime : item.receivedAt)
                .format(DEVICE_MTU_RECEIVED_AT)}
            </span>
          </div>
        </div>
        <div className="overview-panel__operations">
          {_.map(item.ecuReports, (ecuReport, ecuSerial) => {
            let hardwareId = null;
            if (devicePrimaryEcu.id === ecuSerial) {
              const { hardwareId: primaryHardwareId } = devicePrimaryEcu;
              hardwareId = primaryHardwareId;
            }
            const serialFromSecondary = _.find(deviceSecondaryEcus, ecu => ecu.id === ecuSerial);
            if (serialFromSecondary) {
              const { hardwareId: secondaryHardwareId } = serialFromSecondary;
              hardwareId = secondaryHardwareId;
            }

            return (
              <div className="overview-panel__operation" key={ecuSerial}>
                <div className="overview-panel__operation-info">
                  <div className="overview-panel__operation-info-line">
                    <div className="overview-panel__operation-info-block">
                      <span id={`hardwareId-title-${hardwareId}`} className="overview-panel__operation-info--label">
                        {t('devices.mtu.common.ecu_type')}
                      </span>
                      <span id={`hardwareId-${hardwareId}`}>{hardwareId}</span>
                    </div>
                    <div className="overview-panel__operation-info-block">
                      <span id={`ecu-serial-title-${item.correlationId}`} className="overview-panel__operation-info--label">
                        {t('devices.mtu.common.ecu_identifier')}
                      </span>
                      <span id={`ecu-serial-${item.correlationId}`}>{ecuSerial}</span>
                    </div>
                  </div>
                  <div className="overview-panel__operation-info-line">
                    <div className="overview-panel__operation-info-block">
                      <span id={`target-title-${item.correlationId}`} className="overview-panel__operation-info--label">
                        {t('devices.mtu.common.target')}
                      </span>
                      <span id={`target-${item.correlationId}`}>{ecuReport.target.join()}</span>
                    </div>
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
                <div className="overview-panel__operation-status">
                  <div
                    className={`overview-panel__status-code ${ecuReport.result.success ? 'overview-panel__status-code--success' : 'overview-panel__status-code--error'}`}
                  >
                    <span>{t('devices.hardware.result_code')}</span>
                    <span className="overview-panel__status-code-value" id={`result-code-${item.correlationId}`}>
                      {ecuReport.result.code}
                    </span>
                  </div>
                  <div className="overview-panel__status-text">
                    <span id={`result-text-${item.correlationId}`}>{ecuReport.result.description}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="overview-panel__operation-status">
          <div
            className={`overview-panel__status-code ${item.result.success ? 'overview-panel__status-code--success' : 'overview-panel__status-code--error'}`}
          >
            <span>{t('devices.hardware.result_code')}</span>
            <span className="overview-panel__status-code-value" id={`result-code-${item.correlationId}`}>
              {item.result.code}
            </span>
          </div>
          <div className="overview-panel__status-text">
            <span id={`result-text-${item.result.code}`}>{item.result.description}</span>
          </div>
        </div>
      </li>
    );
  }
}

MtuListItem.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape({})),
  item: PropTypes.shape({}),
  stores: PropTypes.shape({}),
  t: PropTypes.func.isRequired
};

export default withTranslation()(MtuListItem);
