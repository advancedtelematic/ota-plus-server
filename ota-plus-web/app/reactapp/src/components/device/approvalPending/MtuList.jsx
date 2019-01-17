/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import MtuListItem from './MtuListItem';
import { toJS } from 'mobx';

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
      <ul className={'overview-panel__list' + (!devicesStore.deviceApprovalPendingCampaigns.campaigns.length ? ' empty' : '')}>
        {devicesStore.deviceApprovalPendingCampaigns.campaigns.length
          ? _.map(devicesStore.deviceApprovalPendingCampaigns.campaigns, (campaign, index) => {
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
