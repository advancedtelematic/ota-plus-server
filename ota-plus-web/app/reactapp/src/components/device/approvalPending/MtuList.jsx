/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';

import MtuListItem from './MtuListItem';

@inject('stores')
@observer
class MtuList extends Component {
  render() {
    const { cancelApprovalPendingCampaign, stores, t } = this.props;
    const { devicesStore } = stores;
    const emptyApprovalPending = (
      <div className="wrapper-center">
        <span className="overview-panel__empty">
          {t('devices.mtu.approval_pending.no_updates')}
        </span>
      </div>
    );
    return (
      <ul className={`overview-panel__list${!devicesStore.deviceApprovalPendingCampaigns.campaigns.length ? ' empty' : ''}`}>
        {devicesStore.deviceApprovalPendingCampaigns.campaigns.length
          ? _.map(devicesStore.deviceApprovalPendingCampaigns.campaigns, (campaign, index) => (
            <MtuListItem
              key={index}
              campaign={campaign}
              cancelApprovalPendingCampaign={cancelApprovalPendingCampaign}
            />
          ))
          : emptyApprovalPending}
      </ul>
    );
  }
}

MtuList.propTypes = {
  cancelApprovalPendingCampaign: PropTypes.func.isRequired,
  stores: PropTypes.shape({}),
  t: PropTypes.func.isRequired
};

export default withTranslation()(MtuList);
