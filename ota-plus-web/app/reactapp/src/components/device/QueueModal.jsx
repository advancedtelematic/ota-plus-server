import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Popover } from 'material-ui';
import { QueueMtuList } from './queue';
import { HistoryMtuList } from './history';
import _ from 'underscore';

@inject("stores")
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
        const { shown, hide, cancelMtuUpdate, activeTabId, setQueueModalActiveTabId, anchorEl, showSequencer } = this.props;
        const { devicesStore } = this.props.stores;
        const { device } = devicesStore;
        const installationStatus = QueueModal.checkStatus(device.deviceStatus);
        const content = (
            <span>
                <Tabs
                    tabItemContainerStyle={{backgroundColor: 'transparent', 'justifyContent': 'center'}}
                    className="tabs"
                    inkBarStyle={{display: 'none'}}
                >
                    <Tab
                        label="Queued"
                        className={"queue-modal__tab-item" + (activeTabId === 0 ? " queue-modal__tab-item--active" : "")}
                        id="queued-packages"
                        data-id={0}
                        onActive={setQueueModalActiveTabId.bind(this, 0)}
                    >
                        <QueueMtuList 
                            cancelMtuUpdate={cancelMtuUpdate}
                            showSequencer={showSequencer}
                        />
                    </Tab>
                    <Tab
                        label="History" 
                        className={"queue-modal__tab-item" + (activeTabId === 1 ? " queue-modal__tab-item--active" : "")}
                        id="installation-history"
                        data-id={1}
                        onActive={setQueueModalActiveTabId.bind(this, 1)}
                    >
                        <HistoryMtuList
                            device={device}
                        />
                    </Tab>
                </Tabs>
                {installationStatus ?
                    <div className={"queue-modal__status queue-modal__status--" + installationStatus}>
                        Last installation status: {installationStatus}
                    </div>
                :
                    null
                }
            </span>
        );
        return (
            <Popover
                className="queue-modal"
                open={shown}
                anchorEl={anchorEl}
                anchorOrigin={{horizontal: 'right', vertical: 'center'}}
                targetOrigin={{horizontal: 'left', vertical: 'center'}}
                onRequestClose={hide}
                useLayerForClickAway={false}
                animated={false}
            >
                <div className="queue-modal__triangle"></div>
                <div className="queue-modal__content">
                    {content}
                </div>
            </Popover>
        );
    }
}

QueueModal.propTypes = {
    stores: PropTypes.object,
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    activeTabId: PropTypes.number.isRequired,
    setQueueModalActiveTabId: PropTypes.func.isRequired,
    anchorEl: PropTypes.object,
}

export default QueueModal;