/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Tabs } from 'antd';
import { withTranslation } from 'react-i18next';

import { QueueMtuList } from './queue';
import { HistoryMtuList } from './history';
import { ApprovalPendingMtuList } from './approvalPending';

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
      cancelApprovalPendingCampaign,
      t
    } = this.props;
    const { devicesStore } = stores;
    const { device } = devicesStore;
    return (
      <div className="overview-panel">
        <Tabs type="card" onChange={setOverviewPanelActiveTabId} activeKey={activeTabId}>
          <Tabs.TabPane tab={t('devices.history')} id="installation-history" key={OVERVIEW_PANEL_TAB_ID_0}>
            <HistoryMtuList device={device} />
          </Tabs.TabPane>
          <Tabs.TabPane tab={t('devices.installation_pending')} id="queued-packages" key={OVERVIEW_PANEL_TAB_ID_1}>
            <QueueMtuList cancelMtuUpdate={cancelMtuUpdate} />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={t('devices.consent_pending')}
            id="approval-pending-campaigns"
            key={OVERVIEW_PANEL_TAB_ID_2}
          >
            <ApprovalPendingMtuList cancelApprovalPendingCampaign={cancelApprovalPendingCampaign} />
          </Tabs.TabPane>
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
  cancelApprovalPendingCampaign: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

export default withTranslation()(OverviewPanel);
