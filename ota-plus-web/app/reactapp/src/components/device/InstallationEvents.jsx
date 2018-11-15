import React, { Component, PropTypes } from 'react';
import {inject, observer} from 'mobx-react';
import { observable } from 'mobx';
import moment from "moment";

@inject("stores")
@observer
class InstallationEvents extends Component {
    render() {
        const { events } = this.props;
        let preparedEvents = {
            ecuDownloadStarted: {
                time: 'Pending',
                status: 'Pending'
            },
            ecuDownloadCompleted: {
                time: 'Pending',
                status: 'Pending'
            },
            ecuInstallationStarted: {
                time: 'Pending',
                status: 'Pending'
            },
            ecuInstallationCompleted: {
                time: 'Pending',
                status: 'Pending'
            },
        };

        events && events.map(el => {
            let time = moment(el.receivedAt).format("ddd MMM DD YYYY, h:mm:ss A");
            switch (el.eventType.id) {
                case 'EcuDownloadStarted':
                    preparedEvents.ecuDownloadStarted.time = time;
                    preparedEvents.ecuDownloadStarted.status = "Success";
                    break;
                case 'EcuDownloadCompleted':
                    preparedEvents.ecuDownloadCompleted.time = time;
                    preparedEvents.ecuDownloadCompleted.status = el.payload.success ? "Success" : 'Error';
                    break;
                case 'EcuInstallationStarted':
                    preparedEvents.ecuInstallationStarted.time = time;
                    preparedEvents.ecuInstallationStarted.status = "Success";
                    break;
                case 'EcuInstallationCompleted':
                    preparedEvents.ecuInstallationCompleted.time = time;
                    preparedEvents.ecuInstallationCompleted.status = el.payload.success ? "Success" : 'Error';
                    break;
            }
        });

        return (
            <div className="overview-panel__operation-events">
                <div className="overview-panel__operation-info-line">
                    <div className="overview-panel__operation-info-block overview-panel__operation-info-block--event">
                        <span className="overview-panel__event-title">
                            <div className={"overview-panel__event-icon overview-panel__event-icon--" + preparedEvents.ecuDownloadStarted.status} id={"status-" + preparedEvents.ecuDownloadStarted.status}></div>
                            Download start:
                        </span>
                        <span id="download-start-time">
                            {preparedEvents.ecuDownloadStarted.time}
                        </span>
                    </div>
                    <div className="overview-panel__operation-info-block overview-panel__operation-info-block--event">
                        <span className="overview-panel__event-title">
                            <div className={"overview-panel__event-icon overview-panel__event-icon--" + preparedEvents.ecuDownloadCompleted.status} id={"status-" + preparedEvents.ecuDownloadCompleted.status}></div>
                            {preparedEvents.ecuDownloadCompleted.status !== 'Error' ? "Download completed:" : "Download failed:"}
                        </span>
                        <span id="download-completed-time">
                           {preparedEvents.ecuDownloadCompleted.time}
                        </span>
                    </div>
                </div>
                <div className="overview-panel__operation-info-line">
                    <div className="overview-panel__operation-info-block overview-panel__operation-info-block--event">
                        <span className="overview-panel__event-title">
                            <div className={"overview-panel__event-icon overview-panel__event-icon--" + preparedEvents.ecuInstallationStarted.status} id={"status-" + preparedEvents.ecuInstallationStarted.status}></div>
                            Installation start:
                        </span>
                        <span id="installation-start-time">
                            {preparedEvents.ecuInstallationStarted.time}
                        </span>
                    </div>
                    <div className="overview-panel__operation-info-block overview-panel__operation-info-block--event">
                    <span className="overview-panel__event-title">
                            <div className={"overview-panel__event-icon overview-panel__event-icon--" + preparedEvents.ecuInstallationCompleted.status} id={"status-" + preparedEvents.ecuInstallationCompleted.status}></div>
                        {preparedEvents.ecuInstallationCompleted.status !== 'Error' ? "Installation completed:" : "Installation failed:"}
                        </span>
                        <span id="installation-completed-time">
                            {preparedEvents.ecuInstallationCompleted.time}
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

export default InstallationEvents;