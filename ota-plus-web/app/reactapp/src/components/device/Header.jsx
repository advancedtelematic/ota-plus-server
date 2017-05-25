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
    backButtonAction() {
        window.history.back();
    }
    render() {
        const { devicesStore, packagesStore, showQueueModal } = this.props;
        const { device } = devicesStore;
        const lastSeenDate = new Date(device.lastSeen);
        const createdDate = new Date(device.createdAt);
        const activatedDate = new Date(device.activatedAt);
        let deviceStatus = 'Status unknown';
        switch(device.deviceStatus) {
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
                        {!devicesStore.devicesOneFetchAsync.isFetching ?
                            <span id="device-name">
                                {device.deviceName}
                            </span>
                        :
                            null
                        }
                    </FadeAnimation>
                }
                backButtonShown={true}
                backButtonAction={this.backButtonAction}>
                <FadeAnimation>
                    {!devicesStore.devicesOneFetchAsync.isFetching ?
                        <span className="pull-right">
                            <button className="queue-button" id="queue-button" onClick={showQueueModal}>
                                <div className={"status status-" + device.deviceStatus} id={"status=" + device.deviceStatus}></div>
                            </button>
                            <div className="dates">
                                <div className="date" id="created-info">
                                    <span className="date-label">Created</span>
                                    <div className="date-desc">
                                        {createdDate.toDateString() + ' ' + createdDate.toLocaleTimeString()}
                                    </div>
                                </div>
                                <div className="date" id="activated-info">
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
                                <div className="date" id="last-seen-online-info">
                                    <span className="date-label">Last seen online</span>
                                    <div className="date-desc">
                                        {deviceStatus !== 'Status unknown' ?
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