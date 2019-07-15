/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import moment from 'moment';

@inject('stores')
@observer
class InstallationEvents extends Component {
  render() {
    const { events } = this.props;
    const preparedEvents = {
      ecuDownloadStarted: {
        receivedAt: moment(),
        time: 'Pending',
        status: 'Pending',
      },
      ecuDownloadCompleted: {
        receivedAt: moment.unix(0),
        time: 'Pending',
        status: 'Pending',
      },
      ecuInstallationStarted: {
        receivedAt: moment(),
        time: 'Pending',
        status: 'Pending',
      },
      ecuInstallationCompleted: {
        receivedAt: moment.unix(0),
        time: 'Pending',
        status: 'Pending',
      },
    };

    events
      && events.map((el) => {
        const receivedAt = moment(el.receivedAt);
        const time = receivedAt.format('ddd MMM DD YYYY, h:mm:ss A');
        switch (el.eventType.id) {
          case 'EcuDownloadStarted':
            if (preparedEvents.ecuDownloadStarted.receivedAt.isAfter(receivedAt)) {
              preparedEvents.ecuDownloadStarted.receivedAt = receivedAt;
              preparedEvents.ecuDownloadStarted.time = time;
              preparedEvents.ecuDownloadStarted.status = 'Success';
            }
            break;
          case 'EcuDownloadCompleted':
            if (preparedEvents.ecuDownloadCompleted.receivedAt.isBefore(receivedAt)) {
              preparedEvents.ecuDownloadCompleted.receivedAt = receivedAt;
              preparedEvents.ecuDownloadCompleted.time = time;
              preparedEvents.ecuDownloadCompleted.status = el.payload.success ? 'Success' : 'Error';
            }
            break;
          case 'EcuInstallationStarted':
            if (preparedEvents.ecuInstallationStarted.receivedAt.isAfter(receivedAt)) {
              preparedEvents.ecuInstallationStarted.receivedAt = receivedAt;
              preparedEvents.ecuInstallationStarted.time = time;
              preparedEvents.ecuInstallationStarted.status = 'Success';
            }
            break;
          case 'EcuInstallationCompleted':
            if (preparedEvents.ecuInstallationCompleted.receivedAt.isBefore(receivedAt)) {
              preparedEvents.ecuInstallationCompleted.receivedAt = receivedAt;
              preparedEvents.ecuInstallationCompleted.time = time;
              preparedEvents.ecuInstallationCompleted.status = el.payload.success ? 'Success' : 'Error';
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
              Download start:
            </span>
            <span id="download-start-time">{preparedEvents.ecuDownloadStarted.time}</span>
          </div>
          <div className="overview-panel__operation-info-block overview-panel__operation-info-block--event">
            <span className="overview-panel__event-title">
              <div
                className={`overview-panel__event-icon overview-panel__event-icon--${preparedEvents.ecuDownloadCompleted.status}`}
                id={`status-${preparedEvents.ecuDownloadCompleted.status}`}
              />
              {preparedEvents.ecuDownloadCompleted.status !== 'Error' ? 'Download completed:' : 'Download failed:'}
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
              Installation start:
            </span>
            <span id="installation-start-time">{preparedEvents.ecuInstallationStarted.time}</span>
          </div>
          <div className="overview-panel__operation-info-block overview-panel__operation-info-block--event">
            <span className="overview-panel__event-title">
              <div
                className={`overview-panel__event-icon overview-panel__event-icon--${preparedEvents.ecuInstallationCompleted.status}`}
                id={`status-${preparedEvents.ecuInstallationCompleted.status}`}
              />
              {preparedEvents.ecuInstallationCompleted.status !== 'Error'
                ? 'Installation completed:'
                : 'Installation failed:'
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
  events: PropTypes.arrayOf(PropTypes.shape({}))
};

export default InstallationEvents;
