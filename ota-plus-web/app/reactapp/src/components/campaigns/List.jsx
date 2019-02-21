/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import ListItem from './ListItem';
import { contains } from '../../utils/Helpers';

@inject('stores')
@observer
class List extends Component {
  static propTypes = {
    stores: PropTypes.object,
    status: PropTypes.string.isRequired,
    expandedCampaigns: PropTypes.array.isRequired,
    toggleCampaign: PropTypes.func,
    showCancelCampaignModal: PropTypes.func,
    showDependenciesModal: PropTypes.func,
  };

  render() {
    const { stores } = this.props;
    const { campaignsStore } = stores;
    const { campaigns } = campaignsStore;
    const { status, expandedCampaigns, showCancelCampaignModal, showDependenciesModal, showRetryModal, toggleCampaign } = this.props;

    const campaignsAvailable = !!campaigns.length;

    return campaignsAvailable ? (
      <div className='campaigns__list'>
        {campaigns.map(campaign => {
          const isExpanded = contains(expandedCampaigns, campaign);
          const isCancelable = status === 'launched';
          return (
            <ListItem
              key={campaign.id}
              campaign={campaign}
              type={status}
              isExpanded={isExpanded}
              showCancelCampaignModal={showCancelCampaignModal}
              showDependenciesModal={showDependenciesModal}
              showRetryModal={showRetryModal}
              toggleCampaign={toggleCampaign}
              isCancelable={isCancelable}
            />
          );
        })}
      </div>
    ) : (
      <div className='campaigns__list--empty'>{`Currently there are no ${status} campaigns.`}</div>
    );
  }
}

export default List;
