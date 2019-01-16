/** @format */

import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'underscore';
import MtuListItem from './MtuListItem';

@inject('stores')
@observer
class MtuList extends Component {
  render() {
    const { cancelApprovalPendingCampaign } = this.props;
    const { devicesStore } = this.props.stores;
    const emptyApprovalPending = (
      <div className='wrapper-center'>
        <span className={'overview-panel__empty'}>You haven't got any campaigns which require approval.</span>
      </div>
    );
    return (
      <ul className={'overview-panel__list' + (!devicesStore.deviceAprrovalPendingCampaigns.campaigns.length ? ' empty' : '')}>
        {devicesStore.deviceAprrovalPendingCampaigns.campaigns.length
          ? _.map(devicesStore.deviceAprrovalPendingCampaigns.campaigns, (campaign, index) => {
              return <MtuListItem key={index} campaign={campaign} cancelApprovalPendingCampaign={cancelApprovalPendingCampaign} />;
            })
          : emptyApprovalPending}
      </ul>
    );
  }
}

MtuList.propTypes = {
  stores: PropTypes.object,
  cancelApprovalPendingCampaign: PropTypes.func.isRequired,
};

export default MtuList;
