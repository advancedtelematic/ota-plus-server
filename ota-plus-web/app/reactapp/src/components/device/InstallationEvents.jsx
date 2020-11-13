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

    const pendingEvent = {
      time: INSTALLATION_EVENT_PENDING,
      status: INSTALLATION_EVENT_PENDING,
    };

    const preparedEvents = {
      ecuDownloadStarted: pendingEvent,
      ecuDownloadCompleted: pendingEvent,
      ecuInstallationStarted: pendingEvent,
      ecuInstallationCompleted: pendingEvent
    };

    const toPreparedEvent = (e) => {
      const time = getFormattedDateTime(e.receivedAt, DEVICE_INSTALLATION_EVENT_DATE_FORMAT);
      const status = {}.hasOwnProperty.call(e.payload, 'success')
        ? (e.payload.success ? INSTALLATION_EVENT_SUCCESS : INSTALLATION_EVENT_ERROR) : INSTALLATION_EVENT_SUCCESS;
      return { time, status };
    };

    const firstSuccessOrLastFailed = (eventsArray) => {
      const maybeSuccess = eventsArray.find(e => e.payload.success);
      return maybeSuccess || eventsArray[eventsArray.length - 1];
    };

    const compare = (a, b) => moment(a.receivedAt).isBefore(moment(b.receivedAt)) ? -1 : 1;

    const sortedByDateEvents = events ? events.sort(compare) : [];

    const downloadStartedEvent = sortedByDateEvents.find(e => e.eventType.id === 'EcuDownloadStarted');

    const installationStartedEvent = sortedByDateEvents.find(e => e.eventType.id === 'EcuInstallationStarted');

    const downloadCompletedEvents = sortedByDateEvents.filter(e => e.eventType.id === 'EcuDownloadCompleted');
    const downloadCompletedEvent = firstSuccessOrLastFailed(downloadCompletedEvents);

    const installationCompletedEvents = sortedByDateEvents.filter(e => e.eventType.id === 'EcuInstallationCompleted');
    const installationCompletedEvent = firstSuccessOrLastFailed(installationCompletedEvents);

    if (downloadStartedEvent) {
      preparedEvents.ecuDownloadStarted = toPreparedEvent(downloadStartedEvent);
    }

    if (downloadCompletedEvent) {
      preparedEvents.ecuDownloadCompleted = toPreparedEvent(downloadCompletedEvent);
    }

    if (installationStartedEvent) {
      preparedEvents.ecuInstallationStarted = toPreparedEvent(installationStartedEvent);
    }

    if (installationCompletedEvent) {
      preparedEvents.ecuInstallationCompleted = toPreparedEvent(installationCompletedEvent);
    }

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
