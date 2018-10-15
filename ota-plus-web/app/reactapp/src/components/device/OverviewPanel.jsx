import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import { Tabs, Tab } from 'material-ui/Tabs';
import { QueueMtuList } from './queue';
import { HistoryMtuList } from './history';

@inject("stores")
@observer
class OverviewPanel extends Component {
    componentWillUnmount() {
        const { setOverviewPanelActiveTabId } = this.props;
        setOverviewPanelActiveTabId(0);
    }
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
    render() {
        const { cancelMtuUpdate, activeTabId, setOverviewPanelActiveTabId, showSequencer } = this.props;
        const { devicesStore } = this.props.stores;
        const { device } = devicesStore;
        const content = (
            <span>
                <Tabs
                    tabItemContainerStyle={{backgroundColor: '#E7E7E8'}}
                    className="tabs"
                    inkBarStyle={{display: 'none'}}
                >
                    <Tab
                        label="Queued"
                        className={"overview-panel__tab-item" + (activeTabId === 0 ? " overview-panel__tab-item--active" : "")}
                        id="queued-packages"
                        data-id={0}
                        onActive={setOverviewPanelActiveTabId.bind(this, 0)}
                    >
                        <QueueMtuList 
                            cancelMtuUpdate={cancelMtuUpdate}
                            showSequencer={showSequencer}
                        />
                    </Tab>
                    <Tab
                        label="History" 
                        className={"overview-panel__tab-item" + (activeTabId === 1 ? " overview-panel__tab-item--active" : "")}
                        id="installation-history"
                        data-id={1}
                        onActive={setOverviewPanelActiveTabId.bind(this, 1)}
                    >
                        <HistoryMtuList
                            device={device}
                        />
                    </Tab>
                </Tabs>
            </span>
        );
        return (
            <div className={'overview-panel'}>
                    {content}
            </div>


        );
    }
}

OverviewPanel.propTypes = {
    stores: PropTypes.object,
    activeTabId: PropTypes.number.isRequired,
    setOverviewPanelActiveTabId: PropTypes.func.isRequired,
}

export default OverviewPanel;