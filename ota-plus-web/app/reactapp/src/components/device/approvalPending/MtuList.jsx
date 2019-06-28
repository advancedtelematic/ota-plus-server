/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import MtuListItem from './MtuListItem';

@inject('stores')
@observer
class MtuList extends Component {
  render() {
    const { cancelApprovalPendingCampaign, stores } = this.props;
    const { devicesStore } = stores;
    const emptyApprovalPending = (
      <div className="wrapper-center">
        <span className="overview-panel__empty">
          {'There aren\'t any updates that are waiting for approval on this device.'}
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
  stores: PropTypes.shape({}),
  cancelApprovalPendingCampaign: PropTypes.func.isRequired,
};

export default MtuList;
