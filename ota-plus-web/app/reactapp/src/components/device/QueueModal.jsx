import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Modal } from '../../partials';
import { QueueList } from './queue';
import { HistoryList } from './history';

@observer
class QueueModal extends Component {
    static checkStatus(status) {
        let installationStatus = null;
        switch(status) {
            case 'UpToDate':
                installationStatus = 'success';
            break;
            case 'Outdated':
                installationStatus = 'pending';
            break;
            case 'Error':
                installationStatus = 'error';
            break;
            default:
            break;
        }
        return installationStatus;
    }
    constructor(props) {
        super(props);
    }
    render() {
        const { packagesStore, shown, hide, device, cancelInstallation, activeTabId, setQueueModalActiveTabId } = this.props;
        const installationStatus = QueueModal.checkStatus(device.deviceStatus);
        const content = (
            <span>
                <Tabs
                    tabItemContainerStyle={{backgroundColor: 'transparent'}}
                    className="tabs"
                    inkBarStyle={{display: 'none'}}
                >
                    <Tab
                        label="Queued"
                        className={"tab-item" + (activeTabId === 0 ? " active" : "")}
                        id="queued-packages"
                        data-id={0}
                        onActive={setQueueModalActiveTabId.bind(this, 0)}
                    >
                        <div className={"wrapper-list" + (activeTabId === 1 ? " hide" : "")}>
                            <QueueList 
                                packagesStore={packagesStore}
                                cancelInstallation={cancelInstallation}
                            />
                        </div>
                    </Tab>
                    <Tab
                        label="History" 
                        className={"tab-item" + (activeTabId === 1 ? " active" : "")}
                        id="installation-history"
                        data-id={1}
                        onActive={setQueueModalActiveTabId.bind(this, 1)}
                    >
                        <div className={"wrapper-list" + (activeTabId === 0 ? " hide" : "")}>
                            <HistoryList 
                                packagesStore={packagesStore}
                                device={device}
                            />
                        </div>
                    </Tab>
                </Tabs>
                {installationStatus ?
                    <div className={"installation-status " + installationStatus}>
                        Last installation status: {installationStatus}
                    </div>
                :
                    null
                }
            </span>
        );
        return (
            <Modal 
                title=""
                content={content}
                shown={shown}
                className="queue-modal"
                hideOnClickOutside={true}
                onRequestClose={hide}
            />
        );
    }
}

QueueModal.propTypes = {
    packagesStore: PropTypes.object.isRequired,
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    device: PropTypes.object.isRequired,
    cancelInstallation: PropTypes.func.isRequired,
    activeTabId: PropTypes.number.isRequired,
    setQueueModalActiveTabId: PropTypes.func.isRequired,
}

export default QueueModal;