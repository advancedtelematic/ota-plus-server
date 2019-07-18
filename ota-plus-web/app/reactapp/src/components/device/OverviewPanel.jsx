/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Tabs } from 'antd';
import { QueueMtuList } from './queue';
import { HistoryMtuList } from './history';
import { ApprovalPendingMtuList } from './approvalPending';

const { TabPane } = Tabs;

const OVERVIEW_PANEL_TAB_ID_0 = '0';
const OVERVIEW_PANEL_TAB_ID_1 = '1';
const OVERVIEW_PANEL_TAB_ID_2 = '2';

@inject('stores')
@observer
class OverviewPanel extends Component {
  componentDidMount() {
    const { stores, setOverviewPanelActiveTabId } = this.props;
    const { devicesStore } = stores;
    if (devicesStore.deviceApprovalPendingCampaigns.campaigns.length) {
      setOverviewPanelActiveTabId(OVERVIEW_PANEL_TAB_ID_2);
    } else if (devicesStore.multiTargetUpdates.length) {
      setOverviewPanelActiveTabId(OVERVIEW_PANEL_TAB_ID_1);
    } else {
      setOverviewPanelActiveTabId(OVERVIEW_PANEL_TAB_ID_0);
    }
  }

  componentWillUnmount() {
    const { setOverviewPanelActiveTabId } = this.props;
    setOverviewPanelActiveTabId(OVERVIEW_PANEL_TAB_ID_0);
  }

  render() {
    const {
      stores,
      cancelMtuUpdate,
      activeTabId,
      setOverviewPanelActiveTabId,
      cancelApprovalPendingCampaign
    } = this.props;
    const { devicesStore } = stores;
    const { device } = devicesStore;
    return (
      <div className="overview-panel">
        <Tabs type="card" onChange={setOverviewPanelActiveTabId} activeKey={activeTabId}>
          <TabPane tab="History" id="installation-history" key={OVERVIEW_PANEL_TAB_ID_0}>
            <HistoryMtuList device={device} />
          </TabPane>
          <TabPane tab="Queue" id="queued-packages" key={OVERVIEW_PANEL_TAB_ID_1}>
            <QueueMtuList cancelMtuUpdate={cancelMtuUpdate} />
          </TabPane>
          <TabPane tab="Approval pending" id="approval-pending-campaigns" key={OVERVIEW_PANEL_TAB_ID_2}>
            <ApprovalPendingMtuList cancelApprovalPendingCampaign={cancelApprovalPendingCampaign} />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

OverviewPanel.propTypes = {
  stores: PropTypes.shape({}),
  activeTabId: PropTypes.string.isRequired,
  setOverviewPanelActiveTabId: PropTypes.func.isRequired,
  cancelMtuUpdate: PropTypes.func.isRequired,
  cancelApprovalPendingCampaign: PropTypes.func.isRequired
};

export default OverviewPanel;
