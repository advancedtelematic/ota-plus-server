/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import { withTranslation } from 'react-i18next';
import { DEVICE_INSTALLATION_EVENT_DATE_FORMAT } from '../../constants/datesTimesConstants';

import {
  INSTALLATION_EVENT_ERROR,
  INSTALLATION_EVENT_PENDING,
  INSTALLATION_EVENT_SUCCESS
} from '../../constants/deviceConstants';
import { getFormattedDateTime } from '../../helpers/datesTimesHelper';

@inject('stores')
@observer
class InstallationEvents extends Component {
  render() {
    const { events, t } = this.props;
    const preparedEvents = {
      ecuDownloadStarted: {
        receivedAt: moment(),
        time: INSTALLATION_EVENT_PENDING,
        status: INSTALLATION_EVENT_PENDING,
      },
      ecuDownloadCompleted: {
        receivedAt: moment.unix(0),
        time: INSTALLATION_EVENT_PENDING,
        status: INSTALLATION_EVENT_PENDING,
      },
      ecuInstallationStarted: {
        receivedAt: moment(),
        time: INSTALLATION_EVENT_PENDING,
        status: INSTALLATION_EVENT_PENDING,
      },
      ecuInstallationCompleted: {
        receivedAt: moment.unix(0),
        time: INSTALLATION_EVENT_PENDING,
        status: INSTALLATION_EVENT_PENDING,
      },
    };

    events
      && events.map((el) => {
        const receivedAt = moment(el.receivedAt);
        const time = getFormattedDateTime(el.receivedAt, DEVICE_INSTALLATION_EVENT_DATE_FORMAT);
        switch (el.eventType.id) {
          case 'EcuDownloadStarted':
            if (preparedEvents.ecuDownloadStarted.receivedAt.isAfter(receivedAt)) {
              preparedEvents.ecuDownloadStarted.receivedAt = receivedAt;
              preparedEvents.ecuDownloadStarted.time = time;
              preparedEvents.ecuDownloadStarted.status = INSTALLATION_EVENT_SUCCESS;
            }
            break;
          case 'EcuDownloadCompleted':
            if (preparedEvents.ecuDownloadCompleted.receivedAt.isBefore(receivedAt)) {
              preparedEvents.ecuDownloadCompleted.receivedAt = receivedAt;
              preparedEvents.ecuDownloadCompleted.time = time;
              preparedEvents.ecuDownloadCompleted.status = el.payload.success
                ? INSTALLATION_EVENT_SUCCESS : INSTALLATION_EVENT_ERROR;
            }
            break;
          case 'EcuInstallationStarted':
            if (preparedEvents.ecuInstallationStarted.receivedAt.isAfter(receivedAt)) {
              preparedEvents.ecuInstallationStarted.receivedAt = receivedAt;
              preparedEvents.ecuInstallationStarted.time = time;
              preparedEvents.ecuInstallationStarted.status = INSTALLATION_EVENT_SUCCESS;
            }
            break;
          case 'EcuInstallationCompleted':
            if (preparedEvents.ecuInstallationCompleted.receivedAt.isBefore(receivedAt)) {
              preparedEvents.ecuInstallationCompleted.receivedAt = receivedAt;
              preparedEvents.ecuInstallationCompleted.time = time;
              preparedEvents.ecuInstallationCompleted.status = el.payload.success
                ? INSTALLATION_EVENT_SUCCESS : INSTALLATION_EVENT_ERROR;
            }
            break;
          default:
            break;
        }
      });

    return (
      <div className="overview-panel__operation-events">
        <div className="overview-panel__operation-info-line">
          <div className="overview-panel__operation-info-block overview-panel__operation-info-block--event">
            <span className="overview-panel__event-title">
              <div
                className={`overview-panel__event-icon overview-panel__event-icon--${preparedEvents.ecuDownloadStarted.status}`}
                id={`status-${preparedEvents.ecuDownloadStarted.status}`}
              />
              {t('devices.installation_events.download_start')}
            </span>
            <span id="download-start-time">{preparedEvents.ecuDownloadStarted.time}</span>
          </div>
          <div className="overview-panel__operation-info-block overview-panel__operation-info-block--event">
            <span className="overview-panel__event-title">
              <div
                className={`overview-panel__event-icon overview-panel__event-icon--${preparedEvents.ecuDownloadCompleted.status}`}
                id={`status-${preparedEvents.ecuDownloadCompleted.status}`}
              />
              {preparedEvents.ecuDownloadCompleted.status !== INSTALLATION_EVENT_ERROR
                ? t('devices.installation_events.download_completed')
                : t('devices.installation_events.download_failed')}
            </span>
            <span id="download-completed-time">{preparedEvents.ecuDownloadCompleted.time}</span>
          </div>
        </div>
        <div className="overview-panel__operation-info-line">
          <div className="overview-panel__operation-info-block overview-panel__operation-info-block--event">
            <span className="overview-panel__event-title">
              <div
                className={`overview-panel__event-icon overview-panel__event-icon--${preparedEvents.ecuInstallationStarted.status}`}
                id={`status-${preparedEvents.ecuInstallationStarted.status}`}
              />
              {t('devices.installation_events.installation_start')}
            </span>
            <span id="installation-start-time">{preparedEvents.ecuInstallationStarted.time}</span>
          </div>
          <div className="overview-panel__operation-info-block overview-panel__operation-info-block--event">
            <span className="overview-panel__event-title">
              <div
                className={`overview-panel__event-icon overview-panel__event-icon--${preparedEvents.ecuInstallationCompleted.status}`}
                id={`status-${preparedEvents.ecuInstallationCompleted.status}`}
              />
              {preparedEvents.ecuInstallationCompleted.status !== INSTALLATION_EVENT_ERROR
                ? t('devices.installation_events.installation_completed')
                : t('devices.installation_events.installation_failed')
              }
            </span>
            <span id="installation-completed-time">{preparedEvents.ecuInstallationCompleted.time}</span>
          </div>
        </div>
      </div>
    );
  }
}

InstallationEvents.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape({})),
  t: PropTypes.func.isRequired
};

export default withTranslation()(InstallationEvents);
