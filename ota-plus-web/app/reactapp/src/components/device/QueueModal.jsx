import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Modal } from '../../partials';
import { QueueList } from './queue';
import { HistoryList } from './history';

@observer
class QueueModal extends Component {
    @observable activeTabId = 0;

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
        this.handleActive = this.handleActive.bind(this);
    }
    handleActive(tab) {
        this.activeTabId = tab.props['data-id'];
    }
    render() {
        const { packagesStore, shown, hide, device, cancelInstallation } = this.props;
        const installationStatus = QueueModal.checkStatus(device.status);
        const content = (
            <span>
                <Tabs
                    tabItemContainerStyle={{backgroundColor: 'transparent'}}
                    className="tabs"
                    inkBarStyle={{display: 'none'}}
                >
                    <Tab
                        label="Queued" 
                        className={"tab-item" + (this.activeTabId === 0 ? " active" : "")}
                        data-id={0}
                        onActive={this.handleActive}
                    >
                        <div className="wrapper-list">
                            <QueueList 
                                packagesStore={packagesStore}
                                cancelInstallation={cancelInstallation}
                            />
                        </div>
                    </Tab>
                    <Tab
                        label="History" 
                        className={"tab-item" + (this.activeTabId === 1 ? " active" : "")}
                        data-id={1}
                        onActive={this.handleActive}
                    >
                        <div className="wrapper-list">
                            <HistoryList 
                                packagesStore={packagesStore}
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
}

export default QueueModal;