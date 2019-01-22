/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Tabs } from 'antd';
import { QueueMtuList } from './queue';
import { HistoryMtuList } from './history';
import { ApprovalPendingMtuList } from './approvalPending';

const { TabPane } = Tabs;

@inject('stores')
@observer
class OverviewPanel extends Component {
  componentDidMount() {
    const { stores, setOverviewPanelActiveTabId } = this.props;
    const { devicesStore } = stores;
    if (devicesStore.deviceApprovalPendingCampaigns.campaigns.length) {
      setOverviewPanelActiveTabId('2');
    } else if (devicesStore.multiTargetUpdates.length) {
      setOverviewPanelActiveTabId('1');
    } else {
      setOverviewPanelActiveTabId('0');
    }
  }

  componentWillUnmount() {
    const { setOverviewPanelActiveTabId } = this.props;
    setOverviewPanelActiveTabId('0');
  }

  render() {
    const { stores, cancelMtuUpdate, activeTabId, setOverviewPanelActiveTabId, cancelApprovalPendingCampaign } = this.props;
    const { devicesStore } = stores;
    const { device } = devicesStore;
    return (
      <div className='overview-panel'>
        <Tabs type={'card'} onChange={setOverviewPanelActiveTabId} activeKey={activeTabId}>
          <TabPane tab='History' id='installation-history' key={'0'}>
            <HistoryMtuList device={device} />
          </TabPane>
          <TabPane tab='Queue' id='queued-packages' key={'1'}>
            <QueueMtuList cancelMtuUpdate={cancelMtuUpdate} />
          </TabPane>
          <TabPane tab='Approval pending' id='approval-pending-campaigns' key={'2'}>
            <ApprovalPendingMtuList cancelApprovalPendingCampaign={cancelApprovalPendingCampaign} />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

OverviewPanel.propTypes = {
  stores: PropTypes.object,
  activeTabId: PropTypes.string.isRequired,
  setOverviewPanelActiveTabId: PropTypes.func.isRequired,
};

export default OverviewPanel;
