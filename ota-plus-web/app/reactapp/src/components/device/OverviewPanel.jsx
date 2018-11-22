import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import { Tabs, Tab } from 'material-ui/Tabs';
import { QueueMtuList } from './queue';
import { HistoryMtuList } from './history';
import { ApprovalPendingMtuList } from './approvalPending';

@inject("stores")
@observer
class OverviewPanel extends Component {
    componentWillUnmount() {
        const { setOverviewPanelActiveTabId } = this.props;
        setOverviewPanelActiveTabId(0);
    }

    componentWillMount() {
        const {setOverviewPanelActiveTabId} = this.props;
        const { devicesStore } = this.props.stores;
        devicesStore.deviceAprrovalPendingCampaigns.campaigns.length ?
            setOverviewPanelActiveTabId(2)
            : devicesStore.multiTargetUpdates.length ?
                setOverviewPanelActiveTabId(1)
                : setOverviewPanelActiveTabId(0)
    }

    render() {
        const { cancelMtuUpdate, activeTabId, setOverviewPanelActiveTabId, showSequencer, cancelApprovalPendingCampaign } = this.props;
        const { devicesStore } = this.props.stores;
        const { device } = devicesStore;
        return (
            <div className={'overview-panel'}>
                <Tabs
                    tabItemContainerStyle={{backgroundColor: '#E7E7E8'}}
                    className="tabs"
                    inkBarStyle={{display: 'none'}}
                    value={activeTabId}
                >
                    <Tab
                        label="History"
                        className={"overview-panel__tab-item"  + (activeTabId === 0 ? " overview-panel__tab-item--active" : "")}
                        id="installation-history"
                        value={0}
                        onActive={setOverviewPanelActiveTabId.bind(this, 0)}
                   />
                    <Tab
                        label="Queue"
                        className={"overview-panel__tab-item" + (devicesStore.multiTargetUpdates.length ? " overview-panel__tab-item--pending" : "") + (activeTabId === 1 ? " overview-panel__tab-item--active" : "")}
                        id="queued-packages"
                        value={1}
                        onActive={setOverviewPanelActiveTabId.bind(this, 1)}
                    />
                    <Tab
                        label="Approval pending"
                        className={"overview-panel__tab-item" + (devicesStore.deviceAprrovalPendingCampaigns.campaigns.length ? " overview-panel__tab-item--pending" : '') + (activeTabId === 2 ? " overview-panel__tab-item--active" : "")}
                        id="approval-pending-campaigns"
                        value={2}
                        onActive={setOverviewPanelActiveTabId.bind(this, 2)}
                    />
                </Tabs>
                {
                    activeTabId === 0 &&
                        <div>
                            <HistoryMtuList
                                device={device}
                            />
                        </div>
                }
                {
                    activeTabId === 1 &&
                    <QueueMtuList
                        cancelMtuUpdate={cancelMtuUpdate}
                        showSequencer={showSequencer}
                    />
                }
                {
                    activeTabId === 2 &&
                    <ApprovalPendingMtuList
                        cancelApprovalPendingCampaign={cancelApprovalPendingCampaign}
                    />
                }
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