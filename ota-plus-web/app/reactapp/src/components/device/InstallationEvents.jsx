/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import moment from 'moment';

@inject('stores')
@observer
class InstallationEvents extends Component {
  @observable preparedEvents = {
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

  recalculateEvents = (events) => {
    if (events) {
      events.map((el) => {
        const receivedAt = moment(el.receivedAt);
        const time = receivedAt.format('ddd MMM DD YYYY, h:mm:ss A');
        switch (el.eventType.id) {
          case 'EcuDownloadStarted':
            if (this.preparedEvents.ecuDownloadStarted.receivedAt.isAfter(receivedAt)) {
              this.preparedEvents.ecuDownloadStarted.receivedAt = receivedAt;
              this.preparedEvents.ecuDownloadStarted.time = time;
              this.preparedEvents.ecuDownloadStarted.status = 'Success';
            }
            break;
          case 'EcuDownloadCompleted':
            if (this.preparedEvents.ecuDownloadCompleted.receivedAt.isBefore(receivedAt)) {
              this.preparedEvents.ecuDownloadCompleted.receivedAt = receivedAt;
              this.preparedEvents.ecuDownloadCompleted.time = time;
              this.preparedEvents.ecuDownloadCompleted.status = el.payload.success ? 'Success' : 'Error';
            }
            break;
          case 'EcuInstallationStarted':
            if (this.preparedEvents.ecuInstallationStarted.receivedAt.isAfter(receivedAt)) {
              this.preparedEvents.ecuInstallationStarted.receivedAt = receivedAt;
              this.preparedEvents.ecuInstallationStarted.time = time;
              this.preparedEvents.ecuInstallationStarted.status = 'Success';
            }
            break;
          case 'EcuInstallationCompleted':
            if (this.preparedEvents.ecuInstallationCompleted.receivedAt.isBefore(receivedAt)) {
              this.preparedEvents.ecuInstallationCompleted.receivedAt = receivedAt;
              this.preparedEvents.ecuInstallationCompleted.time = time;
              this.preparedEvents.ecuInstallationCompleted.status = el.payload.success ? 'Success' : 'Error';
            }
            break;
          default:
            break;
        }
        return true;
      });
    }
  }

  render() {
    const { events } = this.props;
    this.recalculateEvents(events);

    return (
      <div className="overview-panel__operation-events">
        <div className="overview-panel__operation-info-line">
          <div className="overview-panel__operation-info-block overview-panel__operation-info-block--event">
            <span className="overview-panel__event-title">
              <div
                className={`overview-panel__event-icon overview-panel__event-icon--${this.preparedEvents.ecuDownloadStarted.status}`}
                id={`status-${this.preparedEvents.ecuDownloadStarted.status}`}
              />
              Download start:
            </span>
            <span id="download-start-time">{this.preparedEvents.ecuDownloadStarted.time}</span>
          </div>
          <div className="overview-panel__operation-info-block overview-panel__operation-info-block--event">
            <span className="overview-panel__event-title">
              <div
                className={`overview-panel__event-icon overview-panel__event-icon--${this.preparedEvents.ecuDownloadCompleted.status}`}
                id={`status-${this.preparedEvents.ecuDownloadCompleted.status}`}
              />
              {this.preparedEvents.ecuDownloadCompleted.status !== 'Error' ? 'Download completed:' : 'Download failed:'}
            </span>
            <span id="download-completed-time">{this.preparedEvents.ecuDownloadCompleted.time}</span>
          </div>
        </div>
        <div className="overview-panel__operation-info-line">
          <div className="overview-panel__operation-info-block overview-panel__operation-info-block--event">
            <span className="overview-panel__event-title">
              <div
                className={`overview-panel__event-icon overview-panel__event-icon--${this.preparedEvents.ecuInstallationStarted.status}`}
                id={`status-${this.preparedEvents.ecuInstallationStarted.status}`}
              />
              Installation start:
            </span>
            <span id="installation-start-time">{this.preparedEvents.ecuInstallationStarted.time}</span>
          </div>
          <div className="overview-panel__operation-info-block overview-panel__operation-info-block--event">
            <span className="overview-panel__event-title">
              <div
                className={`overview-panel__event-icon overview-panel__event-icon--${this.preparedEvents.ecuInstallationCompleted.status}`}
                id={`status-${this.preparedEvents.ecuInstallationCompleted.status}`}
              />
              {this.preparedEvents.ecuInstallationCompleted.status !== 'Error'
                ? 'Installation completed:'
                : 'Installation failed:'
              }
            </span>
            <span id="installation-completed-time">{this.preparedEvents.ecuInstallationCompleted.time}</span>
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
