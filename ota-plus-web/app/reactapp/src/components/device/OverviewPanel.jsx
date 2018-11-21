import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import { Tabs, Tab } from 'material-ui/Tabs';
import { QueueMtuList } from './queue';
import { HistoryMtuList } from './history';
import { ApprovalPendingMtuList } from './approvalPending';
import Loader from "../../partials/Loader";

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
        const { cancelMtuUpdate, activeTabId, setOverviewPanelActiveTabId, showSequencer, cancelApprovalPendingCampaign } = this.props;
        const { devicesStore, packagesStore } = this.props.stores;
        const { device } = devicesStore;
        return (
            <div>
                {devicesStore.approvalPendingCampaignsFetchAsync.isFetching || devicesStore.mtuFetchAsync.isFetching || devicesStore.eventsFetchAsync.isFetching || packagesStore.packagesHistoryFetchAsync.isFetching ?
                    <ul className="overview-panel__list">
                        <div className="wrapper-center">
                            <Loader/>
                        </div>
                    </ul>
                    :

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
                            >
                                <ApprovalPendingMtuList
                                    cancelApprovalPendingCampaign={cancelApprovalPendingCampaign}
                                />
                            </Tab>
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