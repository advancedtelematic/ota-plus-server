import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { observer } from 'mobx-react';
import { Header as BaseHeader, Loader } from '../../partials';
import { FadeAnimation } from '../../utils';

@observer
class Header extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { devicesStore, packagesStore, showQueueModal } = this.props;
        const { device } = devicesStore;
        const lastSeenDate = new Date(device.lastSeen);
        const createdDate = new Date(device.createdAt);
        const activatedDate = new Date(device.activatedAt);
        let deviceStatus = 'Status unknown';
        let installationStatus = 'unknown';
        switch(device.deviceStatus) {
            case 'UpToDate':
                deviceStatus = 'Device synchronized';
                installationStatus = 'success';
            break;
            case 'Outdated':
                deviceStatus = 'Device unsynchronized';
                installationStatus = 'pending';
            break;
            case 'Error':
                deviceStatus = 'Installation error';
                installationStatus = 'error';
            break;
            default:
            break;
        }

        if(packagesStore.deviceQueue.length) {
            installationStatus = 'pending';
        }

        return (
            <BaseHeader
                title={
                    <FadeAnimation>
                        {!devicesStore.devicesOneFetchAsync.isFetching ?
                            <span>
                                {device.deviceName}
                            </span>
                        :
                            null
                        }
                    </FadeAnimation>
                }
                backButtonShown={true}
                backButtonAction={browserHistory.goBack}>
                <FadeAnimation>
                    {!devicesStore.devicesOneFetchAsync.isFetching ?
                        <span className="pull-right">
                            <button className="queue-button" onClick={showQueueModal}>
                                <div className={"status status-" + installationStatus}></div>
                            </button>
                            <div className="dates">
                                <div className="date">
                                    <span className="date-label">Created</span>
                                    <div className="date-desc">
                                        {createdDate.toDateString() + ' ' + createdDate.toLocaleTimeString()}
                                    </div>
                                </div>
                                <div className="date">
                                    <span className="date-label">Activated</span>
                                    <div className="date-desc">
                                        {device.activatedAt !== null ?
                                            <span>
                                                {activatedDate.toDateString() + ' ' + activatedDate.toLocaleTimeString()}
                                            </span>
                                        :
                                            <span>
                                                Device not activated
                                            </span>
                                        }
                                    </div>
                                </div>
                                <div className="date">
                                    <span className="date-label">Last seen online</span>
                                    <div className="date-desc">
                                        {device.status !== 'NotSeen' ?
                                            <span>{lastSeenDate.toDateString() + ' ' + lastSeenDate.toLocaleTimeString()}</span>
                                        :
                                            <span>Never seen online</span>
                                        }
                                    </div>
                                </div>
                            </div>
                        </span>
                    :
                        null
                    }
                </FadeAnimation>
            </BaseHeader>
        );
    }
}

Header.propTypes = {
    devicesStore: PropTypes.object.isRequired,
    showQueueModal: PropTypes.func.isRequired,
}

export default Header;